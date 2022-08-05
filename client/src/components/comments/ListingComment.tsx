import { rootCommentData } from "./ListingComments"
import image from '../img/user.png'

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
            </div>

        </div>
    )
}

export default ListingComment