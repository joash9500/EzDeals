import { rootCommentData } from "./ListingComments"
import image from '../img/user.png'

export interface ReplyData {
    id: number,
    body: string,
    users_id: number,
    parent_id: number,
    created: string,
    deal_id: number
}

function ListingComment(data: rootCommentData) {
    console.log(data)
    return (
        <div className="comment">
            <div className="comment-image-container">
                <img src={image} alt="user-icon" width={25} height={25}></img>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{data.username}</div>
                    <div>{data.created}</div>
                </div>
                <div className="comment-text">{data.body}</div>
                {/* {data.replies.length > 0 && (
                    <div className="replies">
                        {data.replies.map((reply) => (
                            <ListingComment {...reply} key={reply.id} replies={[]}></ListingComment>
                        ))}
                    </div>
                )} */}
            </div>

        </div>
    )
}

export default ListingComment