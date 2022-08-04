import { useState, useEffect } from "react"
import axios from "axios"
import ListingComment from "./ListingComment";

//set up interface for props to ListingComment
// interface rootCommentData {
//     id: number,
//     body: string,
//     users_id: number,
//     parent_id: number | null,
//     created: string,
//     deal_id: number,
//     username: string
// }

//props will be the userid
function ListingComments(props: object) {

    const [backendComments, setBackendComments] = useState<any[]>([])
    //get parent comments first before rendering child comments, note filter only works on arrays. data from database is are objects
    const rootComments = backendComments.filter(
        backendComments => backendComments.parent_id === null
    ); 

    //run once when mounting component
    useEffect(() => {
        axios.get('/api/comments').then((res) => {
            const comments = res.data
            for (const comment of comments) {
                //update comment list at each iteration
                setBackendComments(previousComments => [comment, ...previousComments])
            }
            console.log(backendComments)
        })
    }, [])

    return (
        <div className="comments">  
            <h4 className="comment-title">Comments:</h4>
                {/* <div className="comments-container">
                    {rootComments.map((rootComment: rootCommentData, index) => (
                        // <div key={rootComment.id}>{rootComment.body}</div>
                        <ListingComment key={rootComment.id} comment={rootComment}></ListingComment>
                    ))}
                </div> */}

            <p>1st comment test</p>
            <p>2nd comment test</p>


        </div>
    )
}

export default ListingComments