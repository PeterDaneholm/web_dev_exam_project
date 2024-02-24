#This is following FastAPI's documentation for how to implement authentication, security and specific permissions with scopes. 

from fastapi import FastAPI, HTTPException, Depends, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, SecurityScopes
from typing import Annotated, List
from pydantic import BaseModel, ValidationError
from database import engine
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime,timedelta, timezone

SECRET_KEY = "bdd156f186b21dc04527a7ed4b4feb05d738244c1e5f22bf027bc2984d42a997"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fake_users_db = {
        "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

oath2_scheme = OAuth2PasswordBearer(tokenUrl="token", scopes={"me": "Read information about the current user", "items": "Read items"})

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

def fake_hash_pass(password: str):
    return "fake_hash" + password

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hash_password: str

class Token(BaseModel):
    acces_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
    scopes: List[str] = []

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    
def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hash_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#Do I need anymore?
def fake_decode_token(token):
    user = get_user(fake_users_db, token)
    return user

async def get_current_user(
        security_scopes: SecurityScopes,
        token: Annotated[str, Depends(oath2_scheme)]
        ):
    if security_scopes.scopes:
        authenticate_value = f"Bearer scope='{security_scopes.scope_str}"
    else:
        authenticate_value="Bearer"
    credetials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credetials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(token_scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credetials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credetials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not enough permission", headers={"WWW-Authenticate": authenticate_value})
    return user

async def get_current_active_user(current_user: Annotated[User, Security(get_current_user, scopes=["me"])]):
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return current_user


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect login", headers={"WWW-Authenticate": "Bearer"})
    acces_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username, "scopes": form_data.scopes}, expires_delta=acces_token_expires)
    return Token(access_token=access_token, token_type="bearer")

    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException()
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_pass(form_data.password)
    if not hashed_password == user.hash_password:
        raise HTTPException
    return {"access_token": user.username, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user

@app.get("/users/me/items")
async def read_own_items(current_user: Annotated[User, Security(get_current_active_user, scopes=["items"])]):
    return [{"item_id": "Foo", "owner": current_user.username}]

