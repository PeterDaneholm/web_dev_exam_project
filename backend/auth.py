from fastapi import Depends, HTTPException, status, Security, Request
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import JWTError, jwt
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

SECRET_KEY = "bdd156f186b21dc04527a7ed4b4feb05d738244c1e5f22bf027bc2984d42a997"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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
    print("getting cookie")
    token = request.cookies.get("access_token")
    print(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not authenticate")
    return token

async def get_current_user(
        db,
        security_scopes: SecurityScopes,
        token: Annotated[str, Depends(get_token_from_cookie)]
    ):
    print(security_scopes)
    if security_scopes.scopes:
        authenticate_value = f"Bearer scope='{security_scopes.scope_str}'"
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    print(token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(token_scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    print("decoded" + token_data)
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    print(user)
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not allowed", headers={"WWW-Authenticate": authenticate_value})
    
    return user

async def get_admin_user(admin_user: Annotated[User, Security(get_current_user, scopes=["Admin"])]):
    return admin_user


def create_access_token(data:dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
