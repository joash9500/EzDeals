import React, {useState} from 'react'
import axios from "axios"

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
    //For image uploads, which will eventually go into the AMAZON s3 cloud server (NOT psql database). NOTE defined the type as a FILE or null (ie. nothing)
    const [ImageFile, setImageFile] = useState<File | null >(null)

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

    //handler for select options in form. select uses a different event listener HTMLSelectElement
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDeliveryType(event.target.value)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        //handle null case
        if (!event.target.files) {
            return 
        } else {
            setImageFile(event.target.files[0])
        }
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
                <label>Image Upload:
                    <input type="file" name="image" accept=".png, .jpg, .jpeg" onChange={handleImageUpload}></input>
                </label>
                <button type="submit" value="Submit">Add Listing</button>
            </form>
        </div>
    )
}