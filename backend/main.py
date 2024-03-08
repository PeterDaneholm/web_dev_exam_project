from fastapi import FastAPI, HTTPException, Depends, status, Security, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated, List
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from datetime import date, timedelta
from database import engine, SessionLocal
from jose import JWTError, jwt
import models
from auth import get_current_user, get_admin_user, authenticate_user, create_access_token, Token, oath2_scheme
from database import db_dependency, get_db
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

app = FastAPI()

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

class UserBase(BaseModel):
    id: str
    username:str
    email_address: str
    first_name: str
    last_name: str
    role: str

class UpdateUser(UserBase):
    id: str = None
    email_address: str = None
    username: str = None
    first_name: str = None
    last_name: str = None
    password: str = None
    role: str = 'user'

class ProductSize(BaseModel):
    size: str
    quantity: int

class ProductBase(BaseModel):
    id: str
    name: str
    price: float
    description: str
    on_sale: bool = False
    size: List[ProductSize] = None
    category_id: str
    #user_rating: float

class UpdateProduct(ProductBase):
    id: str = None
    name: str = None
    price: float = None
    description: str = None
    on_sale: bool = None
    size: str = None
    category_id: str = None
    #user_rating: float = None

class OrderBase(BaseModel):
    id: str
    product_id: str
    quantity: int
    customer: str
    order_date: date
    total: float

#LOGIN
@app.post("/login")
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

#LOGIN
#@app.post("/login/")
#async def create_access_from_login(response: Response, 
#                                   form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
#                                   db: db_dependency):
#    user = authenticate_user(db, form_data.username, form_data.password)
#    if not user:
#        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
#    access_token_expires = timedelta(minutes=60)
#    access_token = create_access_token(data={"sub": user.username, "scopes": user.role}, expires_delta=access_token_expires)
#    print("Token: " + access_token)
#    response.set_cookie(key="access_token", 
#                        value=f"Bearer {access_token}", 
#                        httponly=True,
#                        #samesite=True,
#                        #secure=True,
#                        #domain="localhost:8000",
#                        )
#    print(response.headers)
#    return {"access_token": access_token, "token_type": "bearer"}
#    #return Token(access_token=access_token, token_type="bearer")


#LOGOUT
@app.post("/logout")
async def logout(response: Response ):
    response.delete_cookie("access_token")
    print(response.headers)
    return {"status": "success"}


@app.get("/checktoken")
async def check_token(current_user: Annotated[UserBase, Depends(get_current_user)]):
    return current_user


#USER ROUTES
#Create user
@app.post("/register/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict(by_alias=True)
    user_dict["password"]  = hashed_password
    db_user = models.User(**user_dict)
    db.add(db_user)
    db.commit()
    return db_user

@app.get("/users/me", response_model=UserBase)
async def read_current_user(user: UserBase = Depends(get_current_user)):
    return user

#Get all users
@app.get("/users/", response_model=List[UserBase])
async def get_users(db:db_dependency, 
                    request: Request,
                    current_user: Annotated[UserBase, Security(get_current_user, scopes=["Admin"])]
                    #token: str = Depends(oath2_scheme)
                    ):
    try:
        token = request.cookies.get("access_token")
        print(f"Token: {token}")
        if token.startswith("Bearer "):
            token = token[7:]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Payload: {payload}")
        if 'Admin' not in payload["scopes"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": "Bearer"}
            )
        db_users = db.query(models.User).filter(models.User.role == 'user').all()
        if db_users is None:
            raise HTTPException(status_code=404, detail="Users could not be found")
        users_without_password = []
        for user in db_users:
            user_dict = user.__dict__
            user_dict.pop('_sa_instance_state', None) #Is this necessary? Included for now until tested
            user_dict.pop('password', None)
            users_without_password.append(user_dict)

        return users_without_password
    except Exception as e:
        print(f"Error: {e}")
        raise

#Get specific user
@app.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(user_id: str, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    #Validate that the username is the same as the token


    return db_user

#Update User
@app.put("/users/{user_id}", status_code=status.HTTP_200_OK)
async def update_user(user_id: str, user: UpdateUser, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User with id: {user_id} not found")    

    for field, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)

    return db_user

#Delete user
@app.delete("/users/{id}", status_code=status.HTTP_200_OK)
async def delete_user(id: str, db: db_dependency):
    db_id = db.query(models.User).filter(models.User.id == id).first() 
    if db_id is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_id)
    db.commit()


#PRODUCT ROUTES
#Create Product
@app.post("/products/", status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductBase, 
                         db: db_dependency,
                         #current_user: Annotated[UserBase, Security(get_current_user, scopes=["Admin"])]
                         ):
    print(product)
    product_data = product.dict(by_alias=True)
    sizes = product_data.pop('size')
    size_instance = [models.ProductSize(**size) for size in sizes]
    new_product = models.Product(**product_data, size=size_instance)
    #new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    return new_product


#Get all Products
@app.get("/products/", response_model=List[ProductBase])
async def get_products(db: db_dependency):
    db_products = db.query(models.Product).all()
    if db_products is None:
        raise HTTPException(status_code=404, detail="Products could not be found")
        
    return db_products


#Get specific Product
@app.get("/products/{product_id}", status_code=status.HTTP_200_OK)
async def get_product(product_id: str, db: db_dependency):
    db_product = db.query(models.Product).options(joinedload(models.Product.size))\
        .filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


#Update Product
@app.put("/products/{product_id}", status_code=status.HTTP_200_OK)
async def update_product(product_id: str, product: UpdateProduct, db: db_dependency):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product is not found")
    
    for field, value in product.model_dump(exclude_unset=True).items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)

    return db_product


#Delete Product
@app.delete("/products/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(product_id: str, db: db_dependency):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()


#ORDER ROUTES
#Create new Order
@app.post("/orders/", status_code=status.HTTP_200_OK)
async def create_order(order: OrderBase, db: db_dependency):
    new_order = models.Order(**order.model_dump())
    db.add(new_order)
    db.commit()
    return new_order

#Get all Orders
@app.get("/orders/", response_model=List[OrderBase])
async def get_orders(db: db_dependency):
    db_orders = db.query(models.Order).all()
    if db_orders is None:
        raise HTTPException(status_code=404, detail="Could not find any orders")

    return db_orders

#Get specific Order
@app.get("/orders/{order_id}", status_code=status.HTTP_200_OK)
async def get_order(order_id: str, db: db_dependency):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Could not find order with id: {order_id}")
    
    return db_order

#Update Order??

#Delete Order??
