import { commentProps } from "./ListingComments"
import image from '../../img/user.png'

function ListingComment({comment, replies, session, deleteComment}: commentProps) {

    //set up controls for reply, edit and delete
    const canReply = Boolean(session.user_id)
    const canEdit = session.user_id === comment.users_id
    const canDelete = session.user_id === comment.users_id

    //format date
    const createdAt = new Date(comment.created).toLocaleDateString()
    
    return (
        <div className="comment">
            <div className="comment-image-container">
                <img src={image} alt="user-icon" width={25} height={25}></img>
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.username}</div>
                    <div>{createdAt}</div>
                </div>
                <div className="comment-text">{comment.body}</div>
                <div className="comment-actions">
                    {canReply ? <div className="comment-action"> Reply</div> : null}
                    {canEdit ? <div className="comment-action"> Edit</div> : null}
                    {canDelete ? <div className="comment-action" onClick={() => deleteComment(comment.id)}> Delete</div> : null}
                </div>
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => {
                            return (
                        <ListingComment 
                            key={reply.id} 
                            comment={reply}
                            replies={[]}
                            session={session}
                            deleteComment={deleteComment}
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