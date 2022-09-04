import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CardContent, Typography, Card, Grid, TextField, Button } from '@mui/material'

interface Login {
    email: string,
    password: string
}

export function Login() {

    const initialValues : Login = {
        email: '',
        password: ''
    }

    //formdata
    const [values, setValues] = useState(initialValues)

    // const [Email, setEmail] = useState<string>('')
    // const [Password, setPassword] = useState<string>('')

    //to redirect to different page
    const navigate = useNavigate()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //break up each item in input form
        const {name, value} = event.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        //dont reload page after submitting form
        event.preventDefault()
        const data = {email: values.email, password: values.password}
        axios.post('/api/sessions', data).then((resp) => {
            console.log(resp.data)
            //clear input fields after logging in
            setValues({email: '', password: ''})
            //redirect to home page
            navigate('/')
        })
    }

    return (
    <div>
        <Card style={{maxWidth:450, margin: '10vh auto', padding: '20px 5px'}}>
            <CardContent>
                    <Typography variant='h5' align='center'>Login</Typography>
                    <form onSubmit={handleLogin}>
                    <Grid container spacing={1}>
                        <Grid xs={12} sm={6} item>
                            <TextField label="Email" placeholder="Enter Email" variant='outlined' fullWidth type="email" name="email" value={values.email} onChange={handleInputChange}></TextField>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            <TextField label="Password" placeholder="Enter Password" variant='outlined' fullWidth type="password" name="password" value={values.password} onChange={handleInputChange}></TextField>
                        </Grid>
                        <Grid xs={12} item>
                            <Button type="submit" fullWidth variant='contained'>Sign In</Button>
                        </Grid>
                    </Grid>
                    </form>

            </CardContent>
        </Card>
 
    </div>
    )
}