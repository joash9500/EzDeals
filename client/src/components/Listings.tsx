import axios from "axios"
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';

interface DealList {
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

interface URLData {
    url: string
}

export interface cardData {
    deal_id: number,
    name: string,
    seller: string,
    curr_price: number,
    list_date: string,
    exp_date: string,
    aws_url: string
}

export function Listings() {
    const navigate = useNavigate()
    //set up functional states. 
    //initial list of deals. once only request hence '[]'
    const [dealList, setDealList] = useState<DealList[]>([])

    // 1. get the listings that are active (ie not expired)
    // 2. (1st promise) iterate over each listing using it's deal_id
    // 3. (2nd promise - nested) fetch the image for the listing.
    // 4. resolve all promises of each listing in the 2nd promise 
    useEffect(() => {
        // 1st promise
        axios.get<DealList[]>('/api/listings/active')
        .then((res) => {
            const listingData = res.data
            //2nd promise - map will return an array of promises
            const promisesWithImgURL = listingData.map((listingObj) => {
                let id = listingObj.deal_id
                return (
                    axios.get<URLData>('/api/images', {
                            params: {
                                deal_id: id
                            }
                        })
                )
            }) 

            Promise.all(promisesWithImgURL).then((resolvedPromises) => {
                const ImgURLs = resolvedPromises.map((resolvedPromise) => resolvedPromise.data.url)

                const listingWithImgURL = listingData.map((listingObj, index) => {
                    listingObj.aws_url = ImgURLs[index]
                    return listingObj
                })

                setDealList(listingWithImgURL)

            }).catch(err => console.log(err))
        })

    }, [])

    //redirect to listing page when card is clicked
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
                    
                    const cardData: cardData = {
                        deal_id: listObj.id,
                        name: listObj.deal_name,
                        seller: listObj.seller,
                        curr_price: listObj.current_price,
                        list_date: listObj.list_date,
                        exp_date: listObj.expire_date,
                        aws_url: listObj.aws_url
                    }

                    //format date
                    const list_date = new Date(cardData.list_date).toLocaleDateString()
                    const exp_date = new Date(cardData.exp_date).toLocaleDateString()

                    return (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ minWidth: 200}}>
                            <CardActionArea onClick={() => handleRedirect(cardData)} >
                            <CardMedia
                                component="img"
                                height="180"
                                image={cardData.aws_url}
                                alt="amazon s3 is not working!!!"
                            />
                            <CardContent sx={{flexDirection: 'column', justifyContent: 'space-between'}}>
                                <Typography gutterBottom variant="h5" component="div" className="card-title">
                                {cardData.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="card-content">
                                Seller: {cardData.seller} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Current Price: {cardData.curr_price} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Date Listed: {list_date} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
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