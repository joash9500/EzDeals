import React, {useState} from 'react'
import axios from "axios"
import {Typography, Grid, TextField, Button, Box} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { UploadFile } from '@mui/icons-material'
import {useNavigate} from 'react-router-dom'

interface AddListing {
    title: string,
    summary: string,
    url_link: string,
    start_date: string | null,
    end_date: string | null
}

export function AddListing() {
    //error message
    const [ErrorMsg, setErrorMsg] = useState<string>('')

    //navigate to diff page
    const navigate = useNavigate()

    //inputs for add listing form
    const [DealName, setDealName] = useState<string>('')
    const [Summary, setSummary] = useState<string>('')
    const [URL, setURL] = useState<string>('')
    // Listing Date is automatically set with the CURRENT_DATE executed in the listing.js (server side)
    const [StartDate, setStartDate] = useState<string | null>('') 
    const [EndDate, setEndDate] = useState<string | null>('')
    //For image uploads, which will eventually go into the AMAZON s3 cloud server (NOT psql database). NOTE formData can only take Blob or string types as input
    const [ImageFile, setImageFile] = useState<Blob | string>('')
    const [Filename, setFilename] = useState<string>('')

    //store new post listing data into an object
    const newListing : AddListing = {
        title: DealName,
        summary: Summary,
        url_link: URL,
        start_date: StartDate,
        end_date: EndDate,
    }

    //form handler
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        //prevent page reload on submit form
        event.preventDefault()

        axios.get('/api/sessions').then((res) => {
            const currentSession = res.data.sessionData
            if (currentSession.users_id == undefined) {
                setErrorMsg('not logged in. cannot add new listing')
                return
            } else {
                //get id from session
                const users_id = currentSession.users_id
                console.log('adding new deal', users_id, newListing)

                //make another request to server and post new listing
                axios.post(`/api/listings/${users_id}/add`, newListing).then((res) => {
                    console.log("new listing added", res)
                    //update the deals_status table
                    const new_deal_id = {
                        deal_id: res.data.db
                    }
                    axios.post('/api/listings/active', new_deal_id).then((res) => {
                        console.log(res)
                    })
                    
                    //get image file from form. First, check if ImageFile is undefined otherwise post to /api/images
                    if (ImageFile) {
                        const formData = new FormData()
                        formData.append("image", ImageFile)
                        //send deal_id with the image (so we know which deal this image references)
                        formData.append("deal_id", new_deal_id.deal_id)
                        //send image from formdata to server
                        axios.post('/api/images', formData, {
                            headers: {'Content-Type': 'multipart/form-data'}
                        }).then((res) => {
                            //once image has been sent successfully to aws s3, redirect ot home page
                            navigate('/')
                        })
                    }  
                })
            }
        })
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        //handle null case
        if (event.target.files) {
            const file = event.target.files[0]
            const {name} = file
            setFilename(name)
            setImageFile(file)
        }
    }

    return (
        <div data-testid='AddListing' style={{display:'flex', justifyContent: 'center'}}>

            <form onSubmit={handleSubmit} style={{width: '60vw', minWidth: '540px'}}>
                <Grid container spacing={2} marginTop={0} justifyContent="center">
                <Typography variant='h4' margin="10px">Add New Deal</Typography>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            label="Title"
                            name="deal_name"
                            value={DealName} 
                            onChange={(e) => setDealName(e.target.value)}
                        ></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                           required
                           fullWidth
                            variant="outlined"
                            label="Summary"
                            name="summary"
                            value={Summary} 
                            onChange={(e) => setSummary(e.target.value)}
                        ></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            label="URL Link to Deal"
                            name="url_link"
                            value={URL} 
                            onChange={(e) => setURL(e.target.value)}
                        ></TextField>
                    </Grid>
                  
                    <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker         
                            label="Starts"
                            value={StartDate} 
                            onChange={(newValue: string | null) => {
                                    setStartDate(newValue)
                                }}
                            renderInput={(params) => <TextField name='expire_date' {...params}></TextField>}
                        ></DatePicker>
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker         
                            label="Ends"
                            value={EndDate} 
                            onChange={(newValue: string | null) => {
                                    setEndDate(newValue)
                                }}
                            renderInput={(params) => <TextField name='expire_date' {...params}></TextField>}
                        ></DatePicker>
                    </LocalizationProvider>
                    </Grid>
  
                    <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                    <Button
                        component="label"
                        variant='outlined'
                        startIcon={<UploadFile></UploadFile>}
                    >
                        Upload Image
                        <input type="file" hidden name="image" accept=".png, .jpg, .jpeg" 
                            onChange={handleImageUpload}></input>
                    </Button>
                    <Box>{Filename}</Box>
                    </Grid>
                    <Grid item xs={12} style={{display: 'flex',  justifyContent: 'center'}}>
                        <Button 
                                type="submit"
                                variant='outlined'
                            >Submit</Button>
                    </Grid>
          
                </Grid>
                </form>
        </div>
    )
}

// Drop down input example code
{/* <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
<TextField
    required
    fullWidth
    variant='outlined'
    select
    value={DeliveryType}
    onChange={(e) => setDeliveryType(e.target.value)}
    label="Delivery Type"
>
    <MenuItem value={'physical'}>Physical</MenuItem>
    <MenuItem value={'online'}>Online</MenuItem>
</TextField>
</Grid> */}