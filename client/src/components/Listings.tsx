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
    const [voteUp, setVoteUp] = useState<number[]>([])
    const [voteDown, setVoteDown] = useState<number[]>([])
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

    const handleLikes = (deal_id: number, index: number) => {
        // check if item is already liked. if not liked yet, add to vote up list
        const search_index = voteUp.indexOf(deal_id)
        if (search_index === -1) {
            //create new array so state updates
            const new_voteUp = [...voteUp, deal_id]
            setVoteUp(new_voteUp)
            //update listObj vote count using the index value
            dealList[index].vote_up += 1
            setDealList([...dealList])

        // if this item has already been liked then on button click this should unlike the item, so we remove from vote up list 
        } else if (search_index !== -1) {
            //create new array with filter, so state updates
            const new_voteUp = voteUp.filter((elm) => elm !== deal_id)
            setVoteUp(new_voteUp)
            //update listObj vote count using the index value
            dealList[index].vote_up -= 1
            setDealList([...dealList])
        }
    }

    const handleDislikes = (deal_id: number, index: number) => {
               const search_index = voteDown.indexOf(deal_id)
               if (search_index === -1) {
                   const new_voteDown = [...voteDown, deal_id]
                   setVoteDown(new_voteDown)
                   dealList[index].vote_down += 1
                   setDealList([...dealList])
  
               } else if (search_index !== -1) {
                   const new_voteDown = voteDown.filter((elm) => elm !== deal_id)
                   setVoteDown(new_voteDown)
                   dealList[index].vote_down -= 1
                   setDealList([...dealList])
               }
    } 
    
    return (
        <div>
            <h1 className="title">Home</h1>
            <Grid container spacing={4} alignItems="stretch" padding="20px">
                {dealList.map((listObj, index) => {
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
                                <IconButton onClick={() => handleLikes(listObj.deal_id, index)}>
                                    {voteUp.includes(listObj.deal_id) ?  <ThumbUpIcon></ThumbUpIcon> : <ThumbUpOffAltIcon></ThumbUpOffAltIcon>}
                                </IconButton>
                                <Typography>
                                    {listObj.vote_up}
                                </Typography>
                                <IconButton onClick={() => handleDislikes(listObj.deal_id, index)}>
                                    {voteDown.includes(listObj.deal_id) ?  <ThumbDownIcon></ThumbDownIcon> : <ThumbDownOffAltIcon></ThumbDownOffAltIcon>}
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