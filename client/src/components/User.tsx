import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import axios from 'axios';

// interface UserData {
//     user_id: number,
//     first_name: string,
//     last_name: string,
//     date_joined: Date,
// }

export function User() {
    //profile page
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axios.get('/api/sessions').then((res) => {
            const session = res.data.sessionData
            setMsg('Welcome Back ' + session.username)
        }).catch((err) => {
            console.log('Error: ' + err)
        })
    }, [])

    return (
        <div className='content'>
            <nav>
                <h1>User Profile</h1>
                <h2>{msg}</h2>
            </nav>
        </div>
    )
}