import {useEffect, useState} from 'react'
import axios from 'axios';

export function User() {
    //profile page
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axios.get('/api/sessions').then((res) => {
            const session = res.data.sessionData
            setMsg('Welcome Back ' + session.username.toUpperCase())
        }).catch((err) => {
            console.log('Error: ' + err)
        })
    }, [])

    return (
        <div className='content'>
            <nav>
                <h2>{msg}</h2>
            </nav>
        </div>
    )
}