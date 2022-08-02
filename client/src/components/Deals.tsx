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
            <Grid container spacing={4} alignItems="center" justifyContent="center" padding="20px">

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