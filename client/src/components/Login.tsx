import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export function Login() {

    //formdata
    const [Email, setEmail] = useState<string>('')
    const [Password, setPassword] = useState<string>('')

    //to redirect to different page
    const navigate = useNavigate()

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        //dont reload page after submitting form
        event.preventDefault()
        const data = {email: Email, password: Password}
        axios.post('/api/sessions', data).then((resp) => {
            console.log(resp.data)
            //clear input fields once logged in
            setEmail('')
            setPassword('')
            //redirect to home page
            navigate('/')
        })
    }

    return (
    <div>
        <form onSubmit={handleLogin}>
            <div>
            <label>Email:
                <input type="email" placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)}></input>
            </label>
            <br></br>
            <label>Password: 
                <input type="password" placeholder="Password" value={Password} onChange={(e) => setPassword(e.target.value)}></input>  
            </label>    
            </div>
        <button type="submit">Sign In</button>
        </form>
    </div>
    )
}