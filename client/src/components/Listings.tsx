import axios from "axios"
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
//import from material ui - individual imports to reduce bundle size and load times
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

export interface dealList {
    deal_id: number,
    title: string,
    summary: string,
    vote_up: number,
    vote_down: number,
    added: string,
    starts: string,
    ends: string,
    image_key: string,
    url_link: string,
    users_id: number,
    username: string,
    aws_url: string
}

interface URLData {
    url: string
}

export function Listings() {
    const navigate = useNavigate()
    //set up functional states. 
    //initial empty list of deals.
    const [dealList, setDealList] = useState<dealList[]>([])
    const [likes, setLikes] = useState<number[]>([])
    const [dislikes, setDislikes] = useState<number[]>([])
    // 1. get the listings that are active (ie not expired)
    // 2. (1st promise) iterate over each listing using it's deal_id
    // 3. (2nd promise - nested) fetch the image for the listing.
    // 4. resolve all promises of each listing in the 2nd promise 
    useEffect(() => {
        // 1st promise
        axios.get<dealList[]>('/api/listings/active')
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

    const handleLikes = (deal_id: number) => {
        setLikes(likes.concat(deal_id))
        
    }

    const handleDislikes = (deal_id: number) => {
        setDislikes(dislikes.concat(deal_id))
    }
    
    return (
        <div>
            <h1 className="title">Home</h1>
            <Grid container spacing={4} alignItems="stretch" padding="20px">
                {dealList.map((listObj, index) => {
                    console.log(dealList)
                    //format date
                    const starts = new Date(listObj.starts).toLocaleDateString()
                    const ends = new Date(listObj.ends).toLocaleDateString()
                    return (
                    <Grid item style={{display: 'flex'}} xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ minWidth: 200}} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
                            <CardActionArea onClick={() => handleRedirect(listObj)}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={listObj.aws_url}
                                alt="amazon s3 is not working!!!"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" className="card-title">
                                {listObj.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="card-content">
                                {listObj.summary} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="card-content">
                                {listObj.url_link} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Starts: {starts} 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Expires: {ends} 
                                </Typography>
                            </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <IconButton onClick={() => handleLikes(listObj.deal_id)}>
                                    {likes.includes(listObj.deal_id) ?  <ThumbUpIcon></ThumbUpIcon> : <ThumbUpOffAltIcon></ThumbUpOffAltIcon>}
                                </IconButton>
                                <Typography>
                                    {listObj.vote_up}
                                </Typography>
                                <IconButton onClick={() => handleDislikes(listObj.deal_id)}>
                                    {dislikes.includes(listObj.deal_id) ?  <ThumbDownIcon></ThumbDownIcon> : <ThumbDownOffAltIcon></ThumbDownOffAltIcon>}
                                </IconButton>                                
                                <Typography>
                                    {listObj.vote_down}
                                </Typography>
                            </CardActions>
                        </Card>
                    </Grid>   
                    )
                })}  
            </Grid>
        </div>
    ) 
}