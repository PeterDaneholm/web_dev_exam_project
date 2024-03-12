import React from 'react'
import { useState, useEffect } from 'react'
import api from '../api'


const Searchbar = () => {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getProducts = async () => {
            const response = await api.get("/products/")
            setProducts(response.data)
        }
        getProducts()
    }, [])

    const handleChange = (e) => {
        setSearch(e.target.value)
    }

    const filterSearch = products.filter(prod => {
        return prod.name.toLowerCase().includes(search.toLowerCase())
            || prod.category_id.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <div className='relative'>
            <form className='h-auto'>
                <input type="text" onChange={handleChange} placeholder='Search for Product'
                    className='w-full h-8 text-center rounded-3xl my-3 shadow-md text-black outline-none' />
            </form>

            {search.length == 0 ? '' :
                <div className='bg-slate-200 bg-opacity-90 absolute w-4/5 border-black border-2 rounded-lg p-3 right-[10%]'>
                    <ul>
                        {filterSearch.map(prod => {
                            return <li key={prod.id}>
                                {prod.name}</li>
                        })}
                    </ul>
                </div>
            }
        </div>
    )
}

export default Searchbar
