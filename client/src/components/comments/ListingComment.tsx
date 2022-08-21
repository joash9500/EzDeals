import { commentProps } from "./ListingComments"
import image from '../../img/user.png'

function ListingComment({comment, replies}: commentProps) {
    
    return (
        <div className="comment">
            <div className="comment-image-container">
                <img src={image} alt="user-icon" width={25} height={25}></img>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.username}</div>
                    <div>{comment.created}</div>
                </div>
                <div className="comment-text">{comment.body}</div>
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => {
                            return (
                        <ListingComment 
                            key={reply.id} 
                            comment={reply}
                            replies={[]}
                        ></ListingComment>)
                        }
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListingComment