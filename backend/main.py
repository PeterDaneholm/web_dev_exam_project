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
from routers.user_routes import UserBase
from routers.user_routes import router as user_router
from routers.product_routes import router as product_router
from routers.order_routes import router as order_router


app = FastAPI()
app.include_router(user_router)
app.include_router(product_router)
app.include_router(order_router)


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

