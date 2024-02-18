from sqlalchemy import Boolean, Column, Integer, String, Float, Date, ForeignKey
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    role = Column(String(50), default='user')
    email_address = Column(String(100), unique=True)
    password = Column(String(100))
    first_name = Column(String(50))
    last_name = Column(String(50))


class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    price = Column(Float)
    description = Column(String(200))
    on_sale = Column(Boolean, default=False)
    stock_quantity = Column(Integer)
    category_id = Column(String(50))
    #user_rating = (Float(1))


class Order(Base):
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, index=True)    
    quantity = Column(Integer)
    product_id = Column(Integer, ForeignKey('product.id'))
    customer = Column(Integer, ForeignKey('users.id'))
    order_date = Column(Date)
    total = Column(Float)


class Review(Base):
    __tablename__ = 'reviews'

    review_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.id'))
    reviewer_id = Column(Integer, ForeignKey('users.id'))
    rating = Column(Integer)
    comment = Column(String(1000))
    date = Column(Date)
    
