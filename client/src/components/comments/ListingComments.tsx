import { useState, useEffect } from "react"
import axios from "axios"
import ListingComment from "./ListingComment";

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

export interface commentProps {
    comment: commentData,
    replies: commentData[]
}

//props will be the userid
function ListingComments() {

    const [backendComments, setBackendComments] = useState<commentData[] | []>([])

     //get parent comments first before rendering child comments, note filter only works on arrays. parent comments have no parents (ie parent_id will be null)
     const rootComments = backendComments.filter(
        backendComment => backendComment.parent_id === null
    ); 

    //sort replies to show newest comments LAST. earliest comments FIRST
    const getReplies = (comment_id: number) => {
        console.log('get replies is running')
        return backendComments.filter((backendComment) =>
            backendComment.parent_id === comment_id
        ).sort((a,b) => 
            new Date(a.created).getTime() - new Date(b.created).getTime()
        )
    }

    //run once when mounting component
    useEffect(() => {
        axios.get('/api/comments').then((res) => {
            const comments = res.data
            setBackendComments(comments)
        })
    }, [])

    return (
        <div className="comments">  
            <h4 className="comment-title">Comments:</h4>
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

export default ListingComments