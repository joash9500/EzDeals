import React, {useState} from 'react'
import axios from "axios"
import {Typography, Grid, TextField, Button, MenuItem, Box} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { UploadFile } from '@mui/icons-material'
import {useNavigate} from 'react-router-dom'

interface AddListing {
    deal_name: string,
    seller: string,
    current_price: number | "",
    original_price: number | "",
    expire_date: string | null,
    delivery_type: string,
}

export function AddListing() {
    //error message
    const [ErrorMsg, setErrorMsg] = useState<string>('')

    //navigate to diff page
    const navigate = useNavigate()

    //inputs for add listing form
    const [DealName, setDealName] = useState<string>('')
    const [Seller, setSeller] = useState<string>('')
    const [CurrentPrice, setCurrentPrice] = useState<number | ''>('')
    const [OriginalPrice, setOriginalPrice] = useState<number | ''>('')
    // Listing Date is automatically set with the CURRENT_DATE executed in the listing.js (server sde)
    const [ExpireDate, setExpireDate] = useState<string | null>('')
    //Delivery type is either online or physical. NOTE, we had to initialise a value here e.g. 'online' otherwise its always an empty string ''
    const [DeliveryType, setDeliveryType] = useState<string>('')

    //For image uploads, which will eventually go into the AMAZON s3 cloud server (NOT psql database). NOTE formData can only take Blob or string types as input
    const [ImageFile, setImageFile] = useState<Blob | string>('')
    const [Filename, setFilename] = useState<string>('')

    //store new post listing data into an object
    const newListing : AddListing = {
        deal_name: DealName,
        seller: Seller,
        current_price: CurrentPrice,
        original_price: OriginalPrice,
        expire_date: ExpireDate,
        delivery_type: DeliveryType
    }

    //form handler
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        //prevent page reload on submit form
        event.preventDefault()

        axios.get('/api/sessions').then((res) => {
            const currentSession = res.data.sessionData
            if (currentSession.user_id == undefined) {
                setErrorMsg('Not Logged in. Cannot add new listing')
                return
            } else {
                //get id from session
                const user_id = currentSession.user_id
                //make another request to server and post new listing
                axios.post(`/api/listings/${user_id}/add`, newListing).then((res) => {
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
                            label="Seller"
                            name="seller"
                            value={Seller} 
                            onChange={(e) => setSeller(e.target.value)}
                        ></TextField>
              
                    </Grid>
                    <Grid item xs={12}>
   
                        <TextField
                           required
                           fullWidth
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                            variant="outlined"
                            label="Current Price"
                            name="current_price"
                            value={CurrentPrice} 
                            onChange={(e) => {
                                const inputAsNumber = parseInt(e.target.value)
                                console.log(inputAsNumber)
                                //check NaN or empty case before updating
                                if (isNaN(inputAsNumber)) {
                                    return setCurrentPrice('')
                                } 
                                setCurrentPrice(inputAsNumber)
                        }}></TextField>
              
                    </Grid>
                    <Grid item xs={12}>
          
                        <TextField
                            required
                            fullWidth
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                            variant="outlined"
                            label="Original Price"
                            name="original_price"
                            value={OriginalPrice} 
                            onChange={(e) => {
                                const inputAsNumber = parseInt(e.target.value)
                                //check NaN or empty case before updating
                                if (isNaN(inputAsNumber)) {
                                    return setOriginalPrice('')
                                } 
                                setOriginalPrice(inputAsNumber)
                        }}></TextField>

                    </Grid>
                    <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker         
                            label="Expiry Date"
                            value={ExpireDate} 
                            onChange={(newValue: string | null) => 
                                {setExpireDate(newValue)
                                }}
                            renderInput={(params) => <TextField name='expire_date' {...params}></TextField>}
                        ></DatePicker>
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
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