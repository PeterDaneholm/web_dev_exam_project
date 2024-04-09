import React from 'react'
import { useEffect, useState, useContext } from 'react'
import api from '../api'
import { useParams } from 'react-router-dom'
import { CartContext } from '../components/CartContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast/ToastContext'
import Button from '../components/basicelements/Button'
import Image from '../components/basicelements/Image'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const ProductPage = () => {
    const [product, setProduct] = useState({});
    const [currentSize, setCurrentSize] = useState({})
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate()
    const { showToast } = useToast()

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    useEffect(() => {
        const getProduct = async () => {
            const response = await api.get(`/products/${id}`)

            setProduct(response.data)
        }

        getProduct()
    }, [id])
    console.log(product)

    const AddProduct = (e) => {
        if (currentSize.quantity === 0) {
            showToast("Could not add since it's sold out", 'warning')
        } else {
            const toCart = { ...product, size: [currentSize] }
            console.log(toCart)
            addToCart(toCart)
            navigate("/shop")
            showToast('Added to Cart', 'success')
        }
    }

    return (
        <div className=' mx-auto w-4/5 p-2 rounded-lg'>
            <h2 className='text-2xl font-bold text-center m-2'>{product.name}</h2>
            {product && product.image_id &&
                <Slider {...settings}>
                    {product.image_id.map((image, index) => (
                        <div key={index}>
                            <Image source={image.url} styles={'mx-auto'} />
                        </div>
                    ))}
                </Slider>}

            <p className='text-center m-3 mt-5'>{product.description}</p>
            <h3 className='text-center'>{product.price} EUR</h3>

            <div className='flex flex-row'>
                {product.size && Object.values(product.size).map((item) =>
                    <Button onClick={() => setCurrentSize(item)}
                        key={item.id} text={`${item.size} - ${item.quantity} in stock`} width='w-1/3'
                        my='mx-2' />
                )}
            </div>

            <Button text="Add to Cart" onClick={AddProduct} my='ml-[30%]' width='w-2/5' bg='bg-contrast hover:bg-contrastdark' />
        </div>
    )
}

export default ProductPage
