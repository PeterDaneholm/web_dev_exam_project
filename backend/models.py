from sqlalchemy import Boolean, Column, Integer, String, Float, Date, ForeignKey, VARCHAR
from database import Base
import uuid

class User(Base):
    __tablename__ = 'users'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String(50), unique=True, index=True)
    role = Column(String(50), default='user')
    email_address = Column(String(100), unique=True)
    password = Column(String(100))
    first_name = Column(String(50))
    last_name = Column(String(50))


class Product(Base):
    __tablename__ = 'product'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String(100), unique=True)
    price = Column(Float)
    description = Column(String(200))
    on_sale = Column(Boolean, default=False)
    stock_quantity = Column(Integer)
    category_id = Column(String(50))
    #user_rating = (Float(1))


class Order(Base):
    __tablename__ = 'order'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    quantity = Column(Integer)
    product_id = Column(VARCHAR(36), ForeignKey('product.id'))
    customer = Column(VARCHAR(36), ForeignKey('users.id'))
    order_date = Column(Date)
    total = Column(Float)


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    product_id = Column(VARCHAR(36), ForeignKey('product.id'))
    reviewer_id = Column(VARCHAR(36), ForeignKey('users.id'))
    rating = Column(Integer)
    comment = Column(String(1000))
    date = Column(Date)

