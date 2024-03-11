import React from 'react'
import Searchbar from '../components/Searchbar.jsx'
import api from '../api.js'
import { useEffect, useState } from 'react'
import ProductCardSmall from '../components/ProductCardSmall.jsx'


const ProductsPage = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const getProducts = async () => {
            const response = await api.get("/products")

            setProducts(response.data)
        }
        getProducts()
    }, [])

    return (
        <div className='h-full w-full'>
            <div className='bg-orange-50 w-[90%] h-24 shadow-md mx-auto m-2'>
                Banner here
            </div>

            <div className='flex flex-row h-auto w-full'>

                <div className='w-full'>
                    <Searchbar />


                    <div className='bg-gray-200 w-[90%] mx-auto h-screen'>
                        <h3>Products</h3>
                        <ul className='flex flex-row flex-wrap'>
                            {products.map((prod) => {
                                return (
                                    <li key={prod.id}><ProductCardSmall {...prod} /></li>
                                )
                            })}
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ProductsPage
