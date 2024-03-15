from fastapi import Depends, HTTPException, status, Security, Request
from fastapi.security import SecurityScopes
from jose import ExpiredSignatureError, JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel , ValidationError
from typing import List, Annotated
from datetime import datetime, timedelta, timezone
from models import User
import models
from sqlalchemy.orm import Session, Mapped
from sqlalchemy import Column, String
from database import db_dependency
from utils import OAuth2PasswordBearerWithCookie
from dotenv import load_dotenv
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#oath2_scheme = OAuth2PasswordBearer(tokenUrl="token", scopes={"Admin": "Can manage website data", "user": "Can browse and shop"})
oath2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/login", scopes={"Admin": "Can manage website data", "user": "Can browse and shop"})

class UserInDB(User):
    hashed_password: Mapped[str] = Column(String(100))

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
    scopes: List[str] = []


def verify_password(plain_password, hash_password):
    return pwd_context.verify(plain_password, hash_password) 

def get_user(username: str, db: Session = Depends(db_dependency)):
    return db.query(models.User).filter(models.User.username == username).first()

    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(db, username:str, password: str):
    user = get_user(username, db)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

async def get_token_from_cookie(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not authenticate")
    if token.startswith("Bearer "):
        token = token[7:]
    #print(f"dependcy cookie {token}")
    return token

async def get_current_user(
        security_scopes: SecurityScopes,
        db:db_dependency,
        token: str = Depends(get_token_from_cookie),
    ):
    if security_scopes.scopes:
        authenticate_value = f"Bearer scope='{security_scopes.scope_str}'"
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    #print(token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        #print(f"payload {payload}")
        token_data = TokenData(username=payload.get("sub"), scopes=payload.get("scopes", []))
        #username: str = payload.get("sub")
        #if username is None:
        #    raise credentials_exception
        #token_scopes = payload.get("scopes", [])
        #token_scopes = token_scopes if isinstance(token_scopes, list) else [token_scopes]
        #token_data = TokenData(token_scopes=token_scopes, username=username)
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token has expired", headers={"WWW-Authenticate": authenticate_value})
    except (JWTError, ValidationError):
        raise credentials_exception
    print("decoded" + token_data.json())
    user = get_user(username=token_data.username, db=db)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not allowed", headers={"WWW-Authenticate": authenticate_value})
    
    return user

async def get_admin_user(admin_user: Annotated[User, Security(get_current_user, scopes=["Admin"])]):
    return admin_user


def create_access_token(data:dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    #print(f"encoding: {to_encode}")
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
