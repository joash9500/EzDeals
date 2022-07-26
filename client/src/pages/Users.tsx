import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'

function Users() {

    const [msg, setMsg] = useState('');
    const {username} = useParams();

    useEffect(() => {
        if (username) {
            setMsg('Welcome Back ' + username)
        }
    }, [])

    return (
        <div>
            <nav>
                <h1>User Profile</h1>
                <h2>{msg}</h2>
            </nav>
        </div>

    )
}

export default Users