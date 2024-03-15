from sqlalchemy import Boolean, Column, Integer, String, Float, Date, ForeignKey, VARCHAR, BLOB, Enum, PrimaryKeyConstraint, Table
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum as PythonEnum
import uuid
import datetime

class CategoryEnum(PythonEnum):
    BASEBALL = 'baseball'
    JACKET = 'jacket'
    SUIT = 'suit'
    SPORTCLOTHES = 'sportclothes'
    SHOES = 'shoes'
    ACCESORIES = 'accessories'
    SPORTEQUIPMENT = 'sportequipment'

#association table between orders and users
#class OrderProducts(Base):
#    __tablename__ = "orderproducts"
#    products = Column(VARCHAR(36), ForeignKey('products.id'), primary_key=True)
#    orders = Column(VARCHAR(36), ForeignKey('orders.id'), primary_key=True)


class ProductSize(Base):
    __tablename__ = "productsize"
    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, index=True)
    size = Column(String(10), index=True)
    quantity = Column(Integer)
    product_id = Column(VARCHAR(36), ForeignKey('products.id'))


class User(Base):
    __tablename__ = 'users'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String(50), unique=True, index=True)
    role = Column(String(50), default='user')
    email_address = Column(String(100), unique=True)
    password = Column(String(100))
    first_name = Column(String(50))
    last_name = Column(String(50))
    orders = relationship('Order', back_populates='customer')

class Product(Base):
    __tablename__ = 'products'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String(100), unique=True)
    price = Column(Float)
    description = Column(String(400))
    on_sale = Column(Boolean, default=False)
    category_id = Column(Enum(CategoryEnum), nullable=False)
    image_id = Column(String(100))
    #user_rating = (Float(1))
    size = relationship('ProductSize', backref='productsize')
    reviews = relationship('Review', backref='reviews')


class Order(Base):
    __tablename__ = 'orders'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    products = relationship('Product', secondary='orderproducts')
    customer_id = Column(VARCHAR(36), ForeignKey('users.id'))
    customer = relationship('User', back_populates='orders')
    order_date = Column(Date, default=datetime.datetime.now)
    total = Column(Float)


OrderProducts = Table('orderproducts', Base.metadata,
                    Column('order_id', VARCHAR(36), ForeignKey('orders.id'), primary_key=True),
                    Column('product_id', VARCHAR(36), ForeignKey('products.id'), primary_key=True))


#User.orders = relationship('Order', back_populates='customer')
Product.orders = relationship('Order', secondary='orderproducts', back_populates='products')


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(VARCHAR(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    product_id = Column(VARCHAR(36), ForeignKey('products.id'))
    reviewer_id = Column(VARCHAR(36), ForeignKey('users.id'))
    rating = Column(Integer)
    comment = Column(String(1000))
    date = Column(Date)

