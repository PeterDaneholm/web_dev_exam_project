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
                <div className='w-40 h-auto py-8 px-4 rounded-lg bg-gray-100 border-black mr-3 mt-3'>
                    <h2>Categories</h2>
                    <div className='h-[1px] w-4/5 bg-black mb-3'></div>
                    <div>
                        <ul>
                            <li>Placeholder 1</li>
                            <li>Placeholder 2</li>
                            <li>Placeholder 3</li>
                            <li>Placeholder 4</li>
                        </ul>
                    </div>
                </div>


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
