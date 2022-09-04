import { useState, useEffect } from "react"
import axios from "axios"
import ListingComment from "./ListingComment";
import ListingCommentForm from "./ListingCommentForm";
import { allCommentsProps, session } from "../../pages/ListingItem";

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

//for new comments
export type commentDataNew = {
    body: string,
    users_id: number,
    parent_id: null,
    deal_id: number,
}

export interface commentProps {
    comment: commentData,
    replies: commentData[],
    session: session,
    deleteComment: (comment_id: number) => void
}  

export interface addCommentProps {
    handleSubmit: (text: string) => void
}

//sessionData will have the userid
export function ListingComments({itemData, sessionData}: allCommentsProps) {

    const [backendComments, setBackendComments] = useState<commentData[] | []>([])

    //get parent comments first before rendering child comments, note filter only works on arrays. parent comments have no parents (ie parent_id will be null)
    const rootComments = backendComments.filter(
        (backendComment) => backendComment.parent_id === null
    ).sort((a,b) => 
        new Date(b.created).getTime() - new Date(a.created).getTime()
    )   

    //sort replies to show newest comments LAST. earliest comments FIRST
    const getReplies = (comment_id: number) => {
        return backendComments.filter((backendComment) =>
            backendComment.parent_id === comment_id
        ).sort((a,b) => 
            new Date(b.created).getTime() - new Date(a.created).getTime()
        )
    }

    //when adding a new comment, you're creating a new rootComment that can potentially have children (ie. reply comments) later
    const addComment = (text: string) => {

        if (sessionData.user_id == null) {
            //add code to disable comment
            console.log('user is not logged in, could not add comment')

        } else if (sessionData.user_id) {
            const user_id = sessionData.user_id
            const username = sessionData.username
            const deal_id = itemData.deal_id

            const newCommentData:commentDataNew = {
                body: text,
                users_id: user_id,
                parent_id: null,
                deal_id: deal_id,
            }

            axios.post('/api/comments', {
                data: newCommentData
            }).then((res) => {
                const new_comment:commentData = {
                    id: res.data.rows[0].id,
                    body: text,
                    users_id: user_id,
                    parent_id: null,
                    created: res.data.rows[0].created,
                    deal_id: deal_id,
                    username: username,
                }
                //update the page with the new comment that was added
                setBackendComments([new_comment, ...backendComments])
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
            //filter out the deleted comments and update
            const updatedBackendComments = backendComments.filter((comment) => {
                return comment.id !== comment_id
            })
            //update
            setBackendComments(updatedBackendComments)

        }).catch((err) => {{
            console.log('error occured when deleting comment', err)
        }})
    }

    //run once when mounting component
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
            {sessionData.user_id ? 
                <ListingCommentForm handleSubmit={addComment}></ListingCommentForm> : 
            null}

            <div className="comments-container">
                {rootComments.map((rootComment) => {
                    const replies = getReplies(rootComment.id)
                    return (
                    <ListingComment 
                        key={rootComment.id}
                        comment={rootComment}
                        replies={replies}
                        session={sessionData}
                        deleteComment={deleteComment}
                    ></ListingComment>
                    )
                }
                )} 
            </div>
        </div>
    )
}