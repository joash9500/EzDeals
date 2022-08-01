import axios from "axios"
import {useState, useEffect} from 'react'

export function AddListing() {
    //error message
    const [ErrorMsg, setErrorMsg] = useState<string>('')

    //inputs for add listing form
    const [DealName, setDealName] = useState<string>('')
    const [Seller, setSeller] = useState<string>('')
    const [CurrentPrice, setCurrentPrice] = useState<number>(0)
    const [OriginalPrice, setOriginalPrice] = useState<number>(0)
    // Listing Date is automatically set with the CURRENT_DATE executed in the listing.js (server side)
    const [ExpireDate, setExpireDate] = useState<string>()
    //Delivery type is either online or physical. 
    const [DeliveryType, setDeliveryType] = useState<string>('')

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
                //make another request to server and post new listing
                const user_id = currentSession.user_id
                axios.post(`/api//listings/${user_id}/add`, newListing).then((res) => {
                    console.log("new listing added", res)
                })
            }
        })
    }

    return (
        <div>
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
                <label>Delivery Type:
                    <select value={DeliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                        <option value="online">Online</option>
                        <option value="physical">In-person</option>
                    </select>
                </label>
                <button type="submit" value="Submit">Add Listing</button>
            </form>
        </div>
    )
}

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
            {dealList.map((listObj, index) => {
                const name = listObj.deal_name
                const seller = listObj.seller
                const curr_price = listObj.current_price
                const list_date = listObj.list_date
                const exp_date = listObj.expire_date

                return (
                <div key={index}>
                    <h3>{name}</h3>
                    <p>{seller}</p>
                    <p>{curr_price}</p>
                    <p>{list_date}</p>
                    <p>{exp_date}</p>
                </div>
                )
            })}
        </div>
    ) 
}