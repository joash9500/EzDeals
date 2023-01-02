import { commentProps } from "./ListingComments"
import image from '../../img/user-icon.png'
import ListingCommentForm from "./ListingCommentForm"

function ListingComment({comment, replies, session, addComment, deleteComment, updateComment, commentActions, setCommentActions, parent_id}: commentProps) {
    //set up controls for reply, edit and delete
    const canReply = Boolean(session.users_id)
    const canEdit = session.users_id === comment.users_id
    const canDelete = session.users_id === comment.users_id
    //note parent_id is null or a number. this keeps comments to just 2 levels (for rootcomment and replies)
    const reply_id = parent_id ? parent_id : comment.id
    //format date 
    const createdAt = new Date(comment.created).toLocaleDateString()
    //check if commentActions is null first before checking type
    const isEditing = commentActions && commentActions.comment_id === comment.id && commentActions.type === "editing"
    const isReplying = commentActions && commentActions.comment_id === comment.id && commentActions.type === "replying"

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

                {/* if not editing, just show the comment */}
                {!isEditing ? <div className="comment-text">{comment.body}</div> : null}
                {/* if editing, show comment form instead of comment */}
                {isEditing ? <ListingCommentForm 
                    submitLabel="Edit Comment" 
                    submitHandler={updateComment} 
                    comment_id={comment.id} 
                    hasCancelButton={true} 
                    initialText={comment.body}
                    cancelHandler={() => setCommentActions(null)}
                    ></ListingCommentForm> 
                    : null}

                <div className="comment-actions">
                    {canReply ? <div className="comment-action" onClick={() => setCommentActions({comment_id: comment.id, type: 'replying'})}> Reply</div> : null}
                    {canEdit ? <div className="comment-action" onClick={() => setCommentActions({comment_id: comment.id, type: 'editing'})}> Edit</div> : null}
                    {canDelete ? <div className="comment-action" onClick={() => deleteComment(comment.id)}>Delete</div> : null}
                </div>

                {/* generate a reply form if the user is replying. this re-uses the listing comment form */}
                {isReplying ? <ListingCommentForm 
                    submitLabel="Reply" 
                    submitHandler={addComment} 
                    comment_id={reply_id} 
                    hasCancelButton={false} 
                    initialText={""}
                    cancelHandler={() => setCommentActions(null)}
                    ></ListingCommentForm> 
                    : null}

                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => {
                            return (
                        <ListingComment 
                            key={reply.id} 
                            comment={reply}
                            replies={[]}
                            session={session}
                            addComment={addComment}
                            deleteComment={deleteComment}
                            updateComment={updateComment}
                            commentActions={commentActions}
                            setCommentActions={setCommentActions}
                            parent_id={comment.id}
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