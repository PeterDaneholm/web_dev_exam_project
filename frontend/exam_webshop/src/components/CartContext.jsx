import React, { createContext, useState } from 'react'

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    const addToCart = (item) => {
        item.size[0].quantity = 1;

        if (cart.length === 0) {
            setCart([...cart, item])
        }
        else {
            for (let i = 0; i < cart.length; i++) {
                if (item.id == cart[i].id) {
                    for (let j = 0; j < cart[i].size.length; j++) {
                        if (item.size[0].id == cart[i].size[j].id) {
                            cart[i].size[j].quantity += item.size[0].quantity
                            return;
                        }
                        else {
                            console.log("item to add when similar is in cart", item)
                            cart[i].size.push(item.size[0])
                        }
                    }
                } else {
                    console.log("item to add when similar is not in cart", item)
                    setCart([...cart, item])
                    console.log("testing");
                }
            }
        }
        //setCart([...cart, item])
        console.log(cart)
    }

    const removeFromCart = () => {
        setCart([]);
    }
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider