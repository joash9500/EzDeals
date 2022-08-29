import React, {useState} from 'react'
import {Navigate} from 'react-router-dom'
import axios from 'axios'
import { CardContent, Typography, Card, Grid, TextField, Button } from '@mui/material'

interface SignupData {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
}

function Signup() {

    //initial signup values
    const initialValues: SignupData = {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: ''
    }

    //render a specific page if signed up or not signed up
    const [Submit, setSubmit] = useState<boolean>(false)
    //error message
    const [ErrorMsg, setErrorMsg] = useState('')
    //inputs from sign up form
    const [values, setValues] = useState(initialValues)

    //store the new user's data into an object
    const newUserData : SignupData = {
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username,
        email: values.email,
        password: values.password
    }

    const InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        //get name and value of each input in form
        const {name, value} = event.target
        //update values in state
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        //prevent page reload
        event.preventDefault()

        axios.post('/api/users', newUserData).then((res) => {
            //after sign up, redirect to home page
            setSubmit(true)
            //log user in after signup, and set session cookies
            axios.post('/api/sessions', {email: values.email, password: values.password}).then((res) => console.log('new user logged in', res))

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
                            <TextField label="First Name" placeholder="Enter First Name" variant='outlined' fullWidth name="first_name" value={values.first_name}  onChange={InputChangeHandler}></TextField>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            <TextField label="Last Name" placeholder="Enter Last Name" variant='outlined' fullWidth name="last_name" value={values.last_name} onChange={InputChangeHandler}></TextField>
                        </Grid>
                        <Grid xs={12} sm={12} item>
                            <TextField label="Username" placeholder="Enter Username" variant='outlined' fullWidth name="username" value={values.username} onChange={InputChangeHandler}></TextField>
                        </Grid>
                        <Grid xs={12} sm={12} item>
                            <TextField label="Email" placeholder="Enter Email" variant='outlined' fullWidth type="email" name="email" value={values.email} onChange={InputChangeHandler}></TextField>
                        </Grid>
                        <Grid xs={12} sm={12} item>
                            <TextField label="Password" placeholder="Enter Password" variant='outlined' fullWidth type="password" name="password" value={values.password} onChange={InputChangeHandler}></TextField>
                        </Grid>

                        <Grid xs={12} item>
                            <Button type="submit" fullWidth variant='contained'>Sign Up</Button>
                        </Grid>
                        
                    </Grid>
                    </form>
            </CardContent>
            </Card>
            
            <p>{ErrorMsg}</p>

        </div>
     )
}

export default Signup