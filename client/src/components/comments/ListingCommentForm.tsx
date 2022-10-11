import React, { useState } from "react"
import { addCommentProps } from "./ListingComments"

function ListingCommentForm({submitHandler, commentFormTitle, reply_id}: addCommentProps) {
    const [text, setText] = useState("")
    const isTextareaDisabled = text.length === 0
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //handle null case for reply_id
        if (reply_id !== null) {
            submitHandler(text, reply_id)
            setText('')
        } 
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="comment-form-title">{commentFormTitle}</div>
            <textarea className="comment-form-textarea" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <button className="comment-form-button" disabled={isTextareaDisabled}>Submit</button>
        </form>
    )
}

export default ListingCommentForm