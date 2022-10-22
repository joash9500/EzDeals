import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {ListingComments} from "../components/comments/ListingComments"
import axios from "axios"

export type session = {
    cookie: object,
    email: string,
    first_name: string,
    user_id: number | null,
    username: string
}

function ListingItem() {
    const location:any = useLocation()
    //access data from navigate() using location and state
    const itemData = location.state.state_data

    const initialSession = {
        cookie: {}, 
        email: '', 
        first_name: '', 
        user_id: null, 
        username: ''
    }

    const [session, setSession] = useState<session>(initialSession)

    useEffect(()=> {
        axios.get('/api/sessions').then((res) => {
            const session:session = res.data.sessionData
            setSession(session)
        }).catch((err) => {
            //set up error message...
            console.log(err)
        })
        console.log(session)
    },[])

    return (
        <div>
            <div className="content">
                <h1>{itemData.name}</h1>
                <img src={itemData.aws_url}></img>
                <h3>{itemData.seller}</h3>
                <h3>$ {itemData.curr_price}</h3>
                <h3>Posted on: {itemData.list_date}</h3>
            </div>
            {/* send the item data as prop to comments - to update the database later */}
            <ListingComments itemData={itemData} sessionData={session}></ListingComments>

        </div>
    )
}

export default ListingItem