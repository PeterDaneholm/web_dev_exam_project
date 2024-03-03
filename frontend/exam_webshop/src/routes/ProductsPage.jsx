import React from 'react'
import Searchbar from '../components/Searchbar.jsx'


const ProductsPage = () => {


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
                    <div>
                        <h2>Hero Product</h2>
                    </div>

                    <div className='bg-gray-200 w-[90%] mx-auto'>
                        <h3>Products</h3>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ProductsPage
