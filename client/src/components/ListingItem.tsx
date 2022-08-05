import { useLocation } from "react-router-dom"
import ListingComments from "./comments/ListingComments"

function ListingItem() {
    const location:any = useLocation()
    const itemData = location.state.state_data
    
    return (
        <div>
            <div className="content">
                <h1>{itemData.name}</h1>
                <h3>{itemData.seller}</h3>
                <h3>{itemData.curr_price}</h3>
                <h3>{itemData.list_date}</h3>
                <h3>{itemData.curr_price}</h3>
            </div>
            <ListingComments></ListingComments>
        </div>
    )
}

export default ListingItem