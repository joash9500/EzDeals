import React, { useState } from "react"
import { addCommentProps } from "./ListingComments"

function ListingCommentForm({submitHandler, submitLabel, reply_id}: addCommentProps) {
    const [text, setText] = useState("")
    const isTextareaDisabled = text.length === 0
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //reply_id is actually the parent_id which may be null (if its a new comment) or an existing number
        submitHandler(text, reply_id)
        setText('')
    }

    return (
        <form onSubmit={onSubmit}>
            <textarea className="comment-form-textarea" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <button className="comment-form-button" disabled={isTextareaDisabled}>{submitLabel}</button>
        </form>
    )
}

export default ListingCommentForm