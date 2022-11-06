import { useState, useEffect } from "react"
import axios from "axios"
import ListingComment from "./ListingComment";
import ListingCommentForm from "./ListingCommentForm";
import { session } from "../../pages/ListingItem";
import { dealList } from "../Listings";

// set up interface for props to ListingComment
export type commentData = {
    id: number,
    body: string,
    users_id: number,
    parent_id: number | null,
    created: string,
    deal_id: number,
    username: string,
}

//set up comment action buttons. null if not logged in
export type commentActions = {
    comment_id: number,
    type: string
}

//for new comments
export type commentDataNew = {
    body: string,
    users_id: number,
    parent_id: number | null,
    deal_id: number,
}

export interface allCommentsProps {
    itemData: dealList,
    sessionData: session
}

export interface commentProps {
    comment: commentData,
    replies: commentData[],
    session: session,
    addComment: (text: string, reply_id: number | null) => void,
    deleteComment: (comment_id: number) => void,
    updateComment: (text: string, comment_id: number | null) => void,
    commentActions: commentActions | null,
    setCommentActions: (action: commentActions | null) => void,
    parent_id: null | number
}  

export interface addCommentProps {
    submitLabel: string,
    comment_id: null | number,
    hasCancelButton: boolean,
    initialText: string,
    submitHandler: (text: string, reply_id: number | null) => void
    cancelHandler: () => void
}

//sessionData will have the userid
export function ListingComments({itemData, sessionData}: allCommentsProps) {
    //state to update comments from database
    const [backendComments, setBackendComments] = useState<commentData[] | []>([])
    //state to store data for replying and editing
    const [commentActions, setCommentActions] = useState<commentActions | null >(null)
    //get parent comments first before rendering child comments, note filter only works on arrays. parent comments have no parents (ie parent_id will be null)
    const rootComments = backendComments.filter(
        (backendComment) => backendComment.parent_id === null
    ).sort((a,b) => 
        new Date(b.created).getTime() - new Date(a.created).getTime()
    )   

    //sort replies to show earliest comments FIRST
    const getReplies = (comment_id: number) => {
        return backendComments.filter((backendComment) =>
            backendComment.parent_id === comment_id
        ).sort((a,b) => 
            new Date(b.created).getTime() - new Date(a.created).getTime()
        )
    }

    //when adding a new comment, you're creating a new rootComment that can potentially have children (ie. reply comments)
    const addComment = (text: string, reply_id: number | null) => {
        if (sessionData.user_id) {
            const user_id = sessionData.user_id
            const username = sessionData.username
            const deal_id = itemData.deal_id
            const newCommentData:commentDataNew = {
                body: text,
                users_id: user_id,
                parent_id: reply_id,
                deal_id: deal_id,
            }

            axios.post('/api/comments', {
                data: newCommentData
            }).then((res) => {
                console.log('new comment added', res)
                const new_comment:commentData = {
                    id: res.data.rows[0].id,
                    body: text,
                    users_id: user_id,
                    parent_id: res.data.rows[0].parent_id,
                    created: res.data.rows[0].created,
                    deal_id: deal_id,
                    username: username,
                }
                //update the page with the new comment that was added
                setBackendComments([new_comment, ...backendComments])
                //remove the reply comment form, after updating state
                setCommentActions(null)
            })
        } 
    }

    //reply, edit and delete functions
    const deleteComment = (comment_id: number) => {
        axios.delete('/api/comments', {
            data: {
                id: comment_id
            }
        }).then((res) => {
            console.log('deleted comment', res)
            //filter out deleted comments and update
            const updatedBackendComments = backendComments.filter((comment) => {
                return comment.id !== comment_id
            })
            setBackendComments(updatedBackendComments)
        }).catch((err) => {{
            console.log('error occured deleting comment', err)
        }})
    }

    const updateComment = (text: string, comment_id: number | null) => {
        axios.put('/api/comments', {
            data: {
                comment_id: comment_id,
                comment: text
            }
        })
        .then((res) => {
            console.log('updated comment', res)
            const updatedComments = backendComments.map((backendComment) => {
                // update only the backendComment with the comment being updated (comment_id)
                // you can update only the specific property by using the spread operator, and referencing the value (e.g. body) that you like to update
                if (backendComment.id === comment_id) {
                    return {...backendComment, body: text }
                }
                return backendComment
            })
            //update the state, to re-render the comment
            setBackendComments(updatedComments)
            //remove the update comment form, after its been sent to state
            setCommentActions(null)
        })
    }

    //mount once
    useEffect(() => {
        axios.get('/api/comments', {
            params: {
                deal_id: itemData.deal_id
            }
        }).then((res) => {
            const comments = res.data
            console.log(comments)
            setBackendComments(comments)
        }) 
    },[])

    return (
        <div className="comments">  
            <h4 className="comment-title">Comments</h4>
            {/* this will be a form to add new comments, so initial text is just an empty string... */}
            {/* setCommentActions to null if not replying or not editing */}
            {sessionData.user_id ? 
                <ListingCommentForm 
                    submitHandler={addComment} 
                    submitLabel="Add Comment" 
                    comment_id={null} 
                    hasCancelButton={false} 
                    initialText={""}
                    cancelHandler={() => setCommentActions(null)}
                    ></ListingCommentForm> 
                : null}

            <div className="comments-container">
                {rootComments.map((rootComment) => {
                    const replies = getReplies(rootComment.id)
                    return (
                    //parent_id is null as these are root comments!
                    //note replies are being sent to the component as well
                    <ListingComment 
                        key={rootComment.id}
                        comment={rootComment}
                        replies={replies}
                        session={sessionData}
                        addComment={addComment}
                        deleteComment={deleteComment}
                        updateComment={updateComment}
                        commentActions={commentActions}
                        setCommentActions={setCommentActions}
                        parent_id={null}
                    ></ListingComment>
                    )
                }
                )} 
            </div>
        </div>
    )
}