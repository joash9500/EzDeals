import React, { useState } from "react"
import { addCommentProps } from "./ListingComments"

function ListingCommentForm({submitHandler, submitLabel, comment_id, hasCancelButton, initialText, cancelHandler}: addCommentProps) {
    const [text, setText] = useState(initialText)
    const isTextareaDisabled = text.length === 0
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //reply_id is actually the parent_id which may be null (if its a new comment) or an existing number
        submitHandler(text, comment_id)
        setText('')
    }

    return (
        <form onSubmit={onSubmit}>
            <textarea className="comment-form-textarea" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <button className="comment-form-button" disabled={isTextareaDisabled}>{submitLabel}</button>
            {hasCancelButton ? 
                <button type="button" 
                    className="comment-form-button comment-form-cancel-button" 
                    onClick={cancelHandler}>Cancel
                </button> 
                : null}
        </form>
    )
}

export default ListingCommentForm