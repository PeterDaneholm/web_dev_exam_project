from fastapi import APIRouter, status, HTTPException, Depends, Request, Security, Response
from auth import get_current_user, get_user, verify_password, create_access_token
from database import db_dependency
from pydantic import BaseModel
from datetime import date, timedelta, datetime
import models
from passlib.context import CryptContext
from sqlalchemy.orm import joinedload
from typing import Annotated, List, Optional
from jose import jwt
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

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
    password: str
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


router = APIRouter(tags=["Users"])


#Create user
@router.post("/register/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, response: Response, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict(by_alias=True)
    user_dict["password"]  = hashed_password
    db_user = models.User(**user_dict)
    db.add(db_user)
    db.commit()
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(data={"sub": db_user.username, "scopes": [db_user.role]}, expires_delta=access_token_expires)
    response.set_cookie(key="access_token", 
                        value=f"Bearer {access_token}", 
                        httponly=True,
                        samesite='None'
                        )
    print(response.headers)
    return db_user

#Authentication route for checking user is logged in
@router.get("/users/me", response_model=UsersMeResponse)
async def read_current_user(user: UserBase = Depends(get_current_user)):
    return user

#Get all users
@router.get("/users/", response_model=List[UserResponse])
async def get_users(db:db_dependency, 
                    request: Request,
                    current_user: Annotated[UserBase, Security(get_current_user, scopes=["Admin"])]
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
        db_users = db.query(models.User).options(joinedload(models.User.orders))\
            .filter(models.User.role == 'user').all()
        if db_users is None:
            raise HTTPException(status_code=404, detail="Users could not be found")

        return db_users
    except Exception as e:
        print(f"Error: {e}")
        raise

#Get specific user
@router.get("/users/{user_id}", response_model=UsersMeResponse, status_code=status.HTTP_200_OK)
async def get_user(user_id: str, db: db_dependency):
    db_user = db.query(models.User)\
        .options(joinedload(models.User.orders)).filter(models.User.username == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    #Validate that the username is the same as the token

    return db_user

#Update User
@router.put("/users/{user_id}", status_code=status.HTTP_200_OK)
async def update_user(user_id: str, user: UpdateUser, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User with id: {user_id} not found")    

    for field, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)

    return db_user

#Update Password
@router.put("/users/{user_id}/change-password", status_code=status.HTTP_200_OK)
async def change_password(user_id: str, 
                          data: UpdateUserPassword, 
                          db: db_dependency,
                          current_user: Annotated[UserBase, Security(get_current_user)]):
    print(data)
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if not verify_password(data.old_password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Old password was not correct")

    new_hashed = pwd_context.hash(data.new_password)
    db_user.password = new_hashed
    db.commit()
    db.refresh(db_user)
    return {"message": f"Password updated for user {db_user.username}"}

#Delete user
@router.delete("/users/{id}", status_code=status.HTTP_200_OK)
async def delete_user(id: str, db: db_dependency):
    db_id = db.query(models.User).filter(models.User.id == id).first() 
    if db_id is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_id)
    db.commit()

@router.post("/password-reset/{email}")
async def password_reset(email: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.email_address == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    password_reset_token = jwt.encode({"sub": user.username, "exp": datetime + timedelta(minutes=15)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"message": "Password reset email sent"}

