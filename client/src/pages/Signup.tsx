import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import axios from 'axios'
import { CardContent, Typography, Card, Grid, TextField, Button } from '@mui/material'

function Signup() {
    //render a specific page if signed up or not signed up
    const [Submit, setSubmit] = useState<boolean>(false)
    //error message
    const [ErrorMsg, setErrorMsg] = useState('')

    //inputs from sign up form
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [Username, setUsername] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')

    //store the new user's data into an object
    const newUserData = {
        first_name: FirstName,
        last_name: LastName,
        username: Username,
        email: Email,
        password: Password
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        //prevent page reload
        event.preventDefault()

        axios.post('/api/users', newUserData).then((res) => {
            //after sign up, redirect to home page
            setSubmit(true)
            //log user in after signup, and set session cookies
            axios.post('/api/sessions', {email: Email, password: Password}).then((res) => console.log('new user logged in', res))

        }).catch((err) => {
            console.log(err.response.data.message)
            const status = err.response.status
            if (status === 400) {
                setErrorMsg('missing some fields in sign up form')
            } else if (status === 500) {
                setErrorMsg('server error on sign up')
            }
        })
    }

     return (
        <div>
            {/* redirect to home page */}
            {Submit ? <Navigate to="/"/> : null}
            <Card style={{maxWidth:600, margin: '10vh auto', padding: '20px 5px'}}>
            <CardContent>
                    <Typography variant='h5' align='center' margin="10px">Login</Typography>
                    <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                        <Grid xs={12} sm={6} item>
                            <TextField label="First Name" placeholder="Enter First Name" variant='outlined' fullWidth value={FirstName}  onChange={(e) => setFirstName(e.target.value)}></TextField>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            <TextField label="Last Name" placeholder="Enter Last Name" variant='outlined' fullWidth value={LastName} onChange={(e) => setLastName(e.target.value)}></TextField>
                        </Grid>
                        <Grid xs={12} sm={12} item>
                            <TextField label="Username" placeholder="Enter Username" variant='outlined' fullWidth value={Username} onChange={(e) => setUsername(e.target.value)}></TextField>
                        </Grid>
                        <Grid xs={12} sm={12} item>
                            <TextField label="Email" placeholder="Enter Email" variant='outlined' fullWidth type="email" value={Email} onChange={(e) => setEmail(e.target.value)}></TextField>
                        </Grid>
                        <Grid xs={12} sm={12} item>
                            <TextField label="Password" placeholder="Enter Password" variant='outlined' fullWidth type="password" value={Password} onChange={(e) => setPassword(e.target.value)}></TextField>
                        </Grid>


                        <Grid xs={12} item>
                            <Button type="submit" fullWidth variant='contained'>Sign Up</Button>
                        </Grid>
                    </Grid>
                    </form>
            </CardContent>
            </Card>
            
            <p>{ErrorMsg}</p>


            {/* <h1>Sign Up!</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:
                        <input 
                        type="text" 
                        placeholder="Sam" 
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        ></input>
                    </label>
                    <br></br>
                    <label>Last Name:
                        <input 
                        type="text" 
                        placeholder="Smith" 
                        value={LastName}
                        onChange={(e) => setLastName(e.target.value)}
                        ></input>
                    </label>
                    <br></br>
                    <label>Username:
                        <input 
                        type="text" 
                        placeholder="Smith1.0" 
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        ></input>
                    </label>
                    <br></br>
                    <label>Email:
                        <input 
                        type="email" 
                        placeholder="samsmith@example.com" 
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    </label>
                    <br></br>
                    <label>Password: 
                        <input 
                        type="password" 
                        placeholder="Password" 
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        ></input>  
                    </label>    
                    </div>
                <button type="submit" value="submit">Sign Up</button>
            </form> */}

        </div>
     )
}

export default Signup