from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import engine, SessionLocal
import models

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

models.Base.metadata.create_all(bind=engine)

class PostBase(BaseModel):
    title: str
    content: str
    user_id: int

class UserBase(BaseModel):
    id: int
    username:str
    email_address: str
    first_name: str
    last_name: str
    password: str
    role: str


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

#Delete user
@app.delete("/users/{id}", status_code=status.HTTP_200_OK)
async def delete_user(id: int, db: db_dependency):
    db_id = db.query(models.User).filter(models.User.id == id).first() 
    if db_id is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_id)
    db.commit()