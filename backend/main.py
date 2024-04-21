from fastapi import FastAPI, HTTPException, Depends, status, Security, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
import datetime
from datetime import date, timedelta
from database import engine, SessionLocal
from jose import JWTError, jwt
import models
from auth import get_current_user, verify_password, authenticate_user, create_access_token, Token, oath2_scheme
from database import db_dependency, get_db
from passlib.context import CryptContext
import os
from routers.user_routes import router as user_router
from routers.product_routes import router as product_router


app = FastAPI()
app.include_router(user_router)
app.include_router(product_router)

origins = [
    "http://localhost:5173",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

models.Base.metadata.create_all(bind=engine)

class ProductSize(BaseModel):
    id: str
    size: str
    quantity: int

class ProductImage(BaseModel):
    url: str = None

class ProductBase(BaseModel):
    id: str
    name: str
    price: float
    description: str
    on_sale: bool = False
    size: List[ProductSize] = None
    category_id: str
    image_id: Optional[List[ProductImage]] = None

class OrderBase(BaseModel):
    products: List[str] = []
    size_id: List[str] = []
    customer_id: str
    total: float

class UserBase(BaseModel):
    id: str
    username:str
    password: str
    email_address: str
    first_name: str
    last_name: str
    role: str
    orders: Optional[List[OrderBase]] = []

class UserResponse(BaseModel):
    id: str
    username: str
    email_address: str
    first_name: str
    last_name: str
    orders: Optional[List[OrderBase]] = []

class UserBaseWithoutOrders(BaseModel):
    id: str
    username: str
    email_address:str
    first_name: str
    last_name: str
    role: str

class OrderResponse(OrderBase):
    products: List[ProductBase] = []
    total: float
    customer: UserBaseWithoutOrders
    customer_id: str
    order_date: date
    id: str

class UsersMeResponse(BaseModel):
    id: str
    username: str
    email_address: str
    first_name: str
    last_name: str
    role: str
    orders: Optional[List[OrderResponse]] = []
       
class UpdateUser(UserBase):
    id: str = None
    email_address: str = None
    username: str = None
    first_name: str = None
    last_name: str = None
    password: str = None
    role: str = 'user'

class UpdateUserPassword(BaseModel):
    id: str = None
    username: str = None
    old_password: str = None
    new_password: str = None

class UpdateProduct(ProductBase):
    id: str = None
    name: str = None
    price: float = None
    description: str = None
    on_sale: bool = None
    size: List[ProductSize] = None
    category_id: str = None
    image_id: Optional[List[ProductImage]] | None

class UpdateSize(BaseModel):
    id: str = None
    size: str = None
    quantity: int = None


#ROUTES

#LOGIN
@app.post("/login", tags=["Auth"])
async def create_access_token_from_login(
                                        db: db_dependency,
                                        response: Response,
                                        form_data: OAuth2PasswordRequestForm = Depends(),
                                         ):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(data={"sub": user.username, "scopes": [user.role]}, expires_delta=access_token_expires)
    response.set_cookie(key="access_token", 
                        value=f"Bearer {access_token}", 
                        httponly=True,

                        )
    print(response.headers)
    return {"access_token": access_token, "token_type": "bearer"}


#LOGOUT
@app.post("/logout", tags=["Auth"])
async def logout(response: Response ):
    #response.delete_cookie("access_token")
    response.set_cookie(key="access_token", value="", httponly=True, expires=timedelta(seconds=1))
    print(response.headers)
    return {"status": "success"}


@app.get("/checktoken", tags=["Auth"])
async def check_token(current_user: Annotated[UserBase, Depends(get_current_user)]):
    return current_user

@app.post("/password-reset/{email}")
async def password_reset(email: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.email_address == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    password_reset_token = jwt.encode({"sub": user.username, "exp": datetime + timedelta(minutes=15)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"message": "Password reset email sent"}

#USER ROUTES


#PRODUCT ROUTES
#Create Product


#ORDER ROUTES
#Create new Order
@app.post("/neworder/", status_code=status.HTTP_200_OK)
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
@app.get("/orders/")
async def get_orders(db: db_dependency,
                     current_user: Annotated[UserBase, Security(get_current_user, scopes=["Admin"])]):
    db_orders = db.query(models.Order).options(
        joinedload(models.Order.products).joinedload(models.Product.image_id), 
        joinedload(models.Order.customer)).all()
    if db_orders is None:
        raise HTTPException(status_code=404, detail="Could not find any orders")

    return db_orders

#Get specific Order
@app.get("/orders/{order_id}", status_code=status.HTTP_200_OK)
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

