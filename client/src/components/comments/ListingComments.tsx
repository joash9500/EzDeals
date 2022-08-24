import { useState, useEffect } from "react"
import axios from "axios"
import ListingComment from "./ListingComment";
import ListingCommentForm from "./ListingCommentForm";
import { itemData } from "../ListingItem";

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
    replies: commentData[]
}  

export interface addCommentProps {
    handleSubmit: (text: string) => void
}

//props will be the userid
export function ListingComments({itemData}:itemData) {

    const [backendComments, setBackendComments] = useState<commentData[] | []>([])

     //get parent comments first before rendering child comments, note filter only works on arrays. parent comments have no parents (ie parent_id will be null)
     const rootComments = backendComments.filter(
        (backendComment) => backendComment.parent_id === null
    ); 

    //sort replies to show newest comments LAST. earliest comments FIRST
    const getReplies = (comment_id: number) => {
        return backendComments.filter((backendComment) =>
            backendComment.parent_id === comment_id
        ).sort((a,b) => 
            new Date(a.created).getTime() - new Date(b.created).getTime()
        )
    }

    //when adding a new comment, you're creating a new rootComment that can potentially have children (ie. reply comments) later
    const addComment = (text: string) => {
        // console.log('add comment', text, parent_id)

        axios.get('/api/sessions').then((res) => {
            const session = res.data
            const user_id = session.sessionData.user_id
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
                const new_comment = res.data
                console.log(new_comment)
                console.log(backendComments)
                console.log([new_comment, ...backendComments])
                //update the page with the new comment that was added
                setBackendComments([new_comment, ...backendComments])
            })
        })
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
            <div className="comment-form-title">Add Comment</div>
            <ListingCommentForm handleSubmit={addComment}></ListingCommentForm>
            <div className="comments-container">
                {rootComments.map((rootComment) => {
                    const replies = getReplies(rootComment.id)
                    return (
                    <ListingComment 
                        key={rootComment.id}
                        comment={rootComment}
                        replies={replies}
                    ></ListingComment>
                    )
                }
                )} 
            </div>
        </div>
    )
}