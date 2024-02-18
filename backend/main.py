from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import engine, SessionLocal
import models

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

models.Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    id: int
    username:str
    email_address: str
    first_name: str
    last_name: str
    password: str
    role: str

class ProductBase(BaseModel):
    id: int
    name: str
    price: float
    description: str
    on_sale: bool
    stock_quantiy: int
    category_id: str
    user_rating: float


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/")
async def root():
    return {"message": "hello world"}

#USER ROUTES
#Create user
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()

#Get all users
@app.get("/users/", response_model=List[UserBase])
async def get_users(db:db_dependency):
    db_users = db.query(models.User).filter(models.User.role == 'user').all()
    return db_users

#Get specific user
@app.get("/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(user_id: int, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

#Update User
@app.put("/users/{user_id}", status_code=status.HTTP_200_OK)


#Delete user
@app.delete("/users/{id}", status_code=status.HTTP_200_OK)
async def delete_user(id: int, db: db_dependency):
    db_id = db.query(models.User).filter(models.User.id == id).first() 
    if db_id is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_id)
    db.commit()


#PRODUCT ROUTES
#Create Product
@app.post("/products/", status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductBase, db: db_dependency):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()

#Get all Products
@app.get("/products/", response_model=List[ProductBase])
async def get_products(db: db_dependency):
    db_products = db.query(models.Product).all()
    return db_products

#Get specific Product
@app.get("/products/{product_id}", status_code=status.HTTP_200_OK)
async def get_product(product_id: int, db: db_dependency):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

#Update Product
@app.put("/products/{product_id}", status_code=status.HTTP_200_OK)


#Delete Product
@app.delete("/products/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(product_id: int, db: db_dependency):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()


#ORDER ROUTES

