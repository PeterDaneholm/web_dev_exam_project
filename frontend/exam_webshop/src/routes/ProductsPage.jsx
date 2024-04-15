import React from 'react'
import Searchbar from '../components/Searchbar.jsx'
import api from '../api.js'
import { useEffect, useState } from 'react'
import ProductCardSmall from '../components/ProductCardSmall.jsx'


const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const categories = ["Baseball", "Jacket", "Suit", "Sportclothes", "Shoes", "Accessories", "Sportequipment"]

    useEffect(() => {
        const getProducts = async () => {
            const response = await api.get("/products")

            setProducts(response.data)
        }
        getProducts()
    }, [])

    const filterProducts = (productList, category) => {
        if (filteredProducts.length > 0) {
            setFilteredProducts([])
        } else {
            const filtered = productList.filter((prod) => (
                prod.category_id.includes(category.toLowerCase())
            ))
            setFilteredProducts(filtered)
        }
    }

    return (
        <div className='h-full w-full z-10'>
            <div className='flex flex-row h-auto w-full'>

                <div className='w-full pt-5 h-full bg-white'>

                    <div className='flex flex-col w-[95%] ml-[2%] justify-evenly m-2 bg-primarydark py-2 rounded-lg'>
                        <div className='flex flex-row justify-evenly mb-2'>
                            {categories.map((item, index) => (
                                <div onClick={() => filterProducts(products, item)} key={index}
                                    className='bg-contrastdark p-2 rounded-lg hover:bg-contrast hover:cursor-pointer '>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <Searchbar />
                    </div>

                    <div className='bg-gray-200 w-[90%] mx-auto h-auto max-h-[808px] rounded-md p-2 shadow-inner '>
                        <ul className='flex flex-row flex-wrap'>
                            {filteredProducts.length == 0 ?
                                <>
                                    {products.map((prod) => {
                                        return (
                                            <li key={prod.id}><ProductCardSmall {...prod} /></li>
                                        )
                                    })}
                                </>
                                : <>
                                    {filteredProducts.map((prod) => {
                                        return (
                                            <li key={prod.id}><ProductCardSmall {...prod} /></li>
                                        )
                                    })}
                                </>
                            }
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ProductsPage
