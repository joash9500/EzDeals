import axios from "axios"
import React, {useState, useEffect} from 'react'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid, makeStyles } from '@mui/material';

// function ListItem(props:any[]) {



//     return (
//         <div>

//         </div>
//     )
// }

export function Listings() {

    //set up functional states
    const [dealList, setDealList] = useState<any[]>([])

    //initial list of deals. once only request hence '[]'
    useEffect(() => {
        axios.get('/api/listings/active').then((res) => {    
            const listingData = res.data
            for (const listing of listingData) {
                setDealList(prevList => [listing, ...prevList])
            }
        })
    }, [])
    
    return (
        <div>
            <h1>Home</h1>
            <Grid container spacing={4} alignItems="center" justifyContent="center">

                {dealList.map((listObj, index) => {
                    const name = listObj.deal_name
                    const seller = listObj.seller
                    const curr_price = listObj.current_price
                    const list_date = listObj.list_date
                    const exp_date = listObj.expire_date

                    return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ minWidth: 200 }}>
                            <CardActionArea>
                            <CardMedia
                                component="img"
                                height="140"
                                image="image.jpg"
                                alt="random image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Seller: {seller} 
                                Current Price: {curr_price} 
                                Date Listed: {list_date} 
                                Expiry: {exp_date} 
                                </Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>   
                    )
                })}
                            
            </Grid>
           
        </div>
    ) 
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
    const [ExpireDate, setExpireDate] = useState<string>('')
    //Delivery type is either online or physical. NOTE, we had to initialise a value here e.g. 'online' otherwise its always an empty string ''
    const [DeliveryType, setDeliveryType] = useState<string>('online')

    //store new post listing data into an object
    const newListing = {
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
                })
            }
        })
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDeliveryType(event.target.value)
    }

    return (
        <div>
            <h1>Add New Deal</h1>
            <form onSubmit={handleSubmit}>
                <label>Title:
                    <input type="text" value={DealName} onChange={(e) => setDealName(e.target.value)}></input>
                </label>
                <label>Seller:
                    <input type="text" value={Seller} onChange={(e) => setSeller(e.target.value)}></input>
                </label>
                <label>Current Price:
                    <input type="number" value={CurrentPrice} onChange={(e) => setCurrentPrice(e.target.valueAsNumber)}></input>
                </label>
                <label>Original Price:
                    <input type="number" value={OriginalPrice} onChange={(e) => setOriginalPrice(e.target.valueAsNumber)}></input>
                </label>
                <label>Expire Date:
                    <input type="date" value={ExpireDate} onChange={(e) => setExpireDate(e.target.value)}></input>
                </label>
                {/* select options has a different format, so we have to set up a unique function to handle the select event ie handleSelectChange */}
                <label>Delivery Type:
                    <select value={DeliveryType} onChange={handleSelectChange}>
                        <option value="online">Online</option>
                        <option value="physical">Physical</option>
                    </select>
                </label>
                <button type="submit" value="Submit">Add Listing</button>
            </form>
        </div>
    )
}