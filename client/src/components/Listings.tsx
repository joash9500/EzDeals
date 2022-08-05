import axios from "axios"
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';

interface dealList {
    id: number,
    deal_name: string,
    seller: string,
    current_price: number,
    original_price: number,
    list_date: string,
    expire_date: string,
    delivery_type: string,
    image_name: string,
    users_id: number,
    deal_id: number,
    deal_status: boolean,
    aws_url: string
}

interface urlData {
    url: string
}

// interface dealId {
//     deal_id: number
// }

export function Listings() {

    const navigate = useNavigate()

    //set up functional states
    const [dealList, setDealList] = useState<dealList[]>([])
    //initial list of deals. once only request hence '[]'
    useEffect(() => {
        axios.get<dealList[]>('/api/listings/active').then((res) => { 

            const listingData = res.data
            for (const listing of listingData) {

                let id = listing.deal_id
                axios.get<urlData>('/api/images', {
                    params: {
                        deal_id: id
                    }
                }).then((res) => {
                    console.log('running api images response', res.data)

                    const url = res.data.url
                    //update the listing with the aws image url
                    listing['aws_url'] = url
                    setDealList(prevList => [listing, ...prevList])
                })
            }

        })
    }, [])

    const handleRedirect = (data: object) => {
        console.log('clicked', data)
        navigate('/listing/item', {state: {
            state_data: data
        }})
    }
    
    return (
        <div>
            <h1 className="title">Home</h1>
            <Grid container spacing={4} alignItems="center" justifyContent="center" padding="20px">

                {dealList.map((listObj, index) => {

                    const cardData = {
                        name: listObj.deal_name,
                        seller: listObj.seller,
                        curr_price: listObj.current_price,
                        list_date: listObj.list_date,
                        exp_date: listObj.expire_date,
                    }

                    return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ minWidth: 200 }}>
                            <CardActionArea onClick={() => handleRedirect(cardData)}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={listObj.aws_url}
                                alt="random image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {cardData.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Seller: {cardData.seller} 
                                Current Price: {cardData.curr_price} 
                                Date Listed: {cardData.list_date} 
                                Expiry: {cardData.exp_date} 
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