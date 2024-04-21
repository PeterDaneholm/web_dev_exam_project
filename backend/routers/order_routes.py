from fastapi import APIRouter, status, Security, Depends, HTTPException
from typing import Annotated, List
from auth import get_current_user
from sqlalchemy.orm import joinedload 
from pydantic import BaseModel
import models
from datetime import date
from routers.user_routes import UserBase, UserBaseWithoutOrders
from routers.product_routes import ProductBase
from database import db_dependency

router = APIRouter(tags=["Order"])

class OrderBase(BaseModel):
    products: List[str] = []
    size_id: List[str] = []
    customer_id: str
    total: float

class OrderResponse(OrderBase):
    products: List[ProductBase] = []
    total: float
    customer: UserBaseWithoutOrders
    customer_id: str
    order_date: date
 

@router.post("/neworder/", status_code=status.HTTP_200_OK)
async def create_order(order: OrderBase, 
                       db: db_dependency,
                       current_user: Annotated[UserBase, Security(get_current_user)]):
    print(order)
    products = db.query(models.Product).filter(models.Product.id.in_(order.products)).all()
    new_order = models.Order(customer_id=order.customer_id, total=order.total)

    for i in order.size_id:
        db.query(models.ProductSize).filter(models.ProductSize.id == i)\
            .update({models.ProductSize.quantity: models.ProductSize.quantity - 1})

    for product in products:
        new_order.products.append(product)
    
    db.add(new_order)
    db.commit()

    user = db.query(models.User).filter(models.User.id == order.customer_id).first()
    user.orders.append(new_order)

    db.commit()
    return new_order

#Get all Orders
@router.get("/orders/")
async def get_orders(db: db_dependency,
                     current_user: Annotated[UserBase, Security(get_current_user, scopes=["Admin"])]):
    db_orders = db.query(models.Order).options(
        joinedload(models.Order.products).joinedload(models.Product.image_id), 
        joinedload(models.Order.customer)).all()
    if db_orders is None:
        raise HTTPException(status_code=404, detail="Could not find any orders")

    return db_orders

#Get specific Order
@router.get("/orders/{order_id}", status_code=status.HTTP_200_OK)
async def get_order(order_id: str, 
                    db: db_dependency,
                    current_user: Annotated[UserBase, Depends(get_current_user)]):
    
    db_order = db.query(models.Order).options(joinedload(models.Order.products))\
        .filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Could not find order with id: {order_id}")
    
    user = db.query(models.User).filter(models.User.id == db_order.customer_id).first()

    order = {"products": db_order, "customer": user}
    
    return order

