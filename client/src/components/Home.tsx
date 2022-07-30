import {useState, useEffect} from 'react'
import axios from 'axios'

function Home() {
    
    //set up functional states
    const [dealList, setDealList] = useState<any[]>([])

    //initial list of deals. once only request hence '[]'
    useEffect(() => {
        axios.get('/api/listings').then((res) => {    
            const listingData = res.data
            for (const listing of listingData) {
                setDealList(prevList => [listing, ...prevList])
            }
            console.log('something')
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


                return <div key={index}>
                    <h3>{name}</h3>
                    <p>{seller}</p>
                    <p>{curr_price}</p>
                    <p>{list_date}</p>
                    <p>{exp_date}</p>
                </div>
            })}

        </div>
    )
}

export default Home