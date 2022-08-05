import { useState, useEffect } from "react"
import axios from "axios"
import ListingComment from "./ListingComment";

// set up interface for props to ListingComment
export interface rootCommentData {
    id: number,
    body: string,
    users_id: number,
    parent_id: number | null,
    created: string,
    deal_id: number,
    username: string
}

//props will be the userid
function ListingComments() {

    const [backendComments, setBackendComments] = useState<any[]>([])

    //run once when mounting component
    useEffect(() => {
        axios.get('/api/comments').then((res) => {
            const comments = res.data
            for (const comment of comments) {
                //update comment list at each iteration
                setBackendComments(previousComments => [comment, ...previousComments])
            }
            // console.log(backendComments)
        })
    }, [])

    //get parent comments first before rendering child comments, note filter only works on arrays. data from database is are objects
    const rootComments: any[] = backendComments.filter(
        backendComments => backendComments.parent_id === null
    ); 
    // console.log(rootComments)

    return (
        <div className="comments">  
            <h4 className="comment-title">Comments:</h4>
                <div className="comments-container">
                    {rootComments.map((rootComment: rootCommentData) => {
                        // <div key={rootComment.id}>{rootComment.body}</div>
                        // console.log(rootComment)
                        return (
                        <ListingComment key={rootComment.id} {...rootComment}></ListingComment>
                        )
                    }
                    )}
                </div>

        </div>
    )
}

export default ListingComments