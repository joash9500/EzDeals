import React, { useState } from "react"
import { addCommentProps } from "./ListingComments"

function ListingCommentForm({handleSubmit}: addCommentProps) {

    const [text, setText] = useState("")
    const isTextareaDisabled = text.length === 0
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        handleSubmit(text, null)
    }

    return (
        <form onSubmit={onSubmit}>
            <textarea className="comment-form-textarea" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <button className="comment-form-button" disabled={isTextareaDisabled}>Add Comment</button>
        </form>
    )
}

export default ListingCommentForm