import React from 'react'
import Searchbar from '../components/Searchbar.jsx'
import api from '../api.js'
import { useEffect, useState } from 'react'
import ProductCardSmall from '../components/ProductCardSmall.jsx'


const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const categories = ["Baseball", "Jacket", "Suit", "Sportclothes", "Shoes", "Accessories", "Sport Equipment"]

    useEffect(() => {
        const getProducts = async () => {
            const response = await api.get("/products")

            setProducts(response.data)
        }
        getProducts()
    }, [])

    const filterProducts = (productList, category) => {
        const filtered = productList.filter((prod) => (
            prod.category_id.includes(category.toLowerCase())
        ))
        setFilteredProducts(filtered)
    }

    return (
        <div className='h-full w-full z-10'>
            <div className='flex flex-row h-auto w-full'>

                <div className='w-full pt-10'>
                    <Searchbar />

                    <div className='flex flex-row w-full h-10 m-2 justify-evenly'>
                        {categories.map((item, index) => (
                            <div onClick={() => filterProducts(products, item)} key={index}
                                className='bg-contrastdark p-2 rounded-2xl hover:bg-contrast hover:cursor-pointer '>
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className='bg-gray-200 w-[90%] mx-auto h-screen'>
                        <h3>Products</h3>
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
