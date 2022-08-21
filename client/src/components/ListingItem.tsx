import { useLocation } from "react-router-dom"
import {ListingComments} from "./comments/ListingComments"
import { cardData } from "./Listings"

export interface itemData {
    itemData: cardData
}

function ListingItem() {
    const location:any = useLocation()
    const itemData = location.state.state_data
    console.log(itemData)
    return (
        <div>
            <div className="content">
                <h1>{itemData.name}</h1>
                <img src={itemData.aws_url}></img>
                <h3>{itemData.seller}</h3>
                <h3>{itemData.curr_price}</h3>
                <h3>{itemData.list_date}</h3>
                <h3>{itemData.curr_price}</h3>
            </div>
            {/* send the item data as prop to comments - to update the database later */}
            <ListingComments itemData={itemData}></ListingComments>
        </div>
    )
}

export default ListingItem