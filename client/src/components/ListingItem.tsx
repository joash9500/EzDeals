import { useLocation } from "react-router-dom"
import ListingComments from "./comments/ListingComments"

function ListingItem() {
    const location:any = useLocation()
    const itemData = location.state.state_data
    
    return (
        <div>
            <h1>{itemData.name}</h1>
            <h3>{itemData.seller}</h3>
            <h3>{itemData.curr_price}</h3>
            <h3>{itemData.list_date}</h3>
            <h3>{itemData.curr_price}</h3>

            <ListingComments></ListingComments>
        </div>
    )
}

export default ListingItem