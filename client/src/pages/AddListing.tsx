import React, {useState} from 'react'
import axios from "axios"
import { CardContent, Typography, Card, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { UploadFile } from '@mui/icons-material'

interface AddListing {
    deal_name: string,
    seller: string,
    current_price: number,
    original_price: number,
    expire_date: string | null,
    delivery_type: string,
}

export function AddListing() {
    //error message
    const [ErrorMsg, setErrorMsg] = useState<string>('')

    //inputs for add listing form
    const [DealName, setDealName] = useState<string>('')
    const [Seller, setSeller] = useState<string>('')
    const [CurrentPrice, setCurrentPrice] = useState<number>(0)
    const [OriginalPrice, setOriginalPrice] = useState<number>(0)
    // Listing Date is automatically set with the CURRENT_DATE executed in the listing.js (server side)
    const [ExpireDate, setExpireDate] = useState<string | null>('')
    //Delivery type is either online or physical. NOTE, we had to initialise a value here e.g. 'online' otherwise its always an empty string ''
    const [DeliveryType, setDeliveryType] = useState<string>('online')

    //For image uploads, which will eventually go into the AMAZON s3 cloud server (NOT psql database). NOTE defined the type as a FILE or null (ie. nothing)
    const [ImageFile, setImageFile] = useState<Blob | string>('')

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
                        })
                    }
                })
            }
        })
    }

    // //handler for select options in form. select uses a different event listener HTMLSelectElement
    // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setDeliveryType(event.target.value)
    // }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        //handle null case
        if (event.target.files) {
            setImageFile(event.target.files[0])
        }
    }

    return (
        <div data-testid='AddListing'>
            <FormControl>
                <form onSubmit={handleSubmit}>
                <h1 className='title'>Add New Deal 1</h1>
                <Grid container>
                    <Grid item xs={6}>
                    <TextField
                            variant="outlined"
                            label="Title"
                            name="deal_name"
                            value={DealName} 
                            onChange={(e) => setDealName(e.target.value)}
                        ></TextField>
                        <TextField
                            variant="outlined"
                            label="Seller"
                            name="seller"
                            value={Seller} 
                            onChange={(e) => setSeller(e.target.value)}
                        ></TextField>
                        <TextField
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                            variant="outlined"
                            label="Current Price"
                            name="current_price"
                            value={CurrentPrice} 
                            onChange={(e) => {
                                const inputAsNumber = parseInt(e.target.value)
                                return setCurrentPrice(inputAsNumber)
                        }}></TextField>
                        <TextField
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                            variant="outlined"
                            label="Original Price"
                            name="original_price"
                            value={OriginalPrice} 
                            onChange={(e) => {
                                const inputAsNumber = parseInt(e.target.value)
                                return setOriginalPrice(inputAsNumber)
                        }}></TextField>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker            
                                label="Expiry Date"
                                // name="expire_date"
                                value={ExpireDate} 
                                onChange={(newValue: string | null) => 
                                    {setExpireDate(newValue)
                                    }}
                                renderInput={(params) => <TextField name='expire_date' {...params}></TextField>}
                            ></DatePicker>
                        </LocalizationProvider>
                        <InputLabel id="select-delivery"></InputLabel>
                        <Select
                            labelId='select-delivery'
                            value={DeliveryType}
                            label="Delivery Type"
                            onChange={(e) => setDeliveryType(e.target.value)}
                        >
                            <MenuItem value={'physical'}>Physical</MenuItem>
                            <MenuItem value={'online'}>Online</MenuItem>
                        </Select>
                        <Button
                            component="label"
                            variant='outlined'
                            startIcon={<UploadFile></UploadFile>}
                            sx={{ marginRight: "1rem"}}
                        >
                            Upload Image
                            <input type="file" hidden name="image" accept=".png, .jpg, .jpeg" 
                                onChange={handleImageUpload}></input>
                        </Button>

                        <Button type="submit">Submit</Button>

                    </Grid>
                </Grid>
                </form>
            </FormControl>
 
            {/* <h1 className='title'>Add New Deal 2</h1>
            <form onSubmit={handleSubmit} className="content">
                <label>Title:
                    <input type="text" value={DealName} onChange={(e) => setDealName(e.target.value)}></input>
                </label>
                <br></br>
                <label>Seller:
                    <input type="text" value={Seller} onChange={(e) => setSeller(e.target.value)}></input>
                </label>
                <br></br>
                <label>Current Price:
                    <input type="number" value={CurrentPrice} onChange={(e) => setCurrentPrice(e.target.valueAsNumber)}></input>
                </label>
                <br></br>
                <label>Original Price:
                    <input type="number" value={OriginalPrice} onChange={(e) => setOriginalPrice(e.target.valueAsNumber)}></input>
                </label>
                <br></br>
                <label>Expire Date:
                    <input type="date" value={ExpireDate} onChange={(e) => setExpireDate(e.target.value)}></input>
                </label>
                <br></br>
              
                <label>Delivery Type:
                    <select value={DeliveryType} onChange={handleSelectChange}>
                        <option value="online">Online</option>
                        <option value="physical">Physical</option>
                    </select>
                </label>
                <br></br>
                <label>Image Upload:
                    <input type="file" name="image" accept=".png, .jpg, .jpeg" 
                        onChange={handleImageUpload}></input>
                </label>
                <br></br>
                <button type="submit" value="Submit">Add Listing</button>
            </form> */}
        </div>
    )
}