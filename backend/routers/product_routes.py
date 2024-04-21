from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import joinedload
from typing import List, Optional
from pydantic import BaseModel
import models
from database import db_dependency


router = APIRouter(tags=["Products"])


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

class UpdateProduct(ProductBase):
    id: str = None
    name: str = None
    price: float = None
    description: str = None
    on_sale: bool = None
    size: List[ProductSize] = None
    category_id: str = None
    image_id: Optional[List[ProductImage]] | None

class UpdateSize(BaseModel):
    id: str = None
    size: str = None
    quantity: int = None



@router.post("/products/", status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductBase, 
                         db: db_dependency,
                         ):
    print(product)
    product_data = product.dict(by_alias=True)
    sizes = product_data.pop('size')
    size_instance = [models.ProductSize(**size) for size in sizes]
    image_urls = [image.get("url") for image in product_data.get("image_id", [])]
    image_instance = [models.ProductImage(url=url) for url in image_urls] if image_urls else []

    db.add_all(image_instance)
    db.commit()
    
    product_data['image_id'] = image_instance
    new_product = models.Product(**product_data, size=size_instance)
    db.add(new_product)
    db.commit()
    return new_product


#Get all Products
@router.get("/products/", response_model=List[ProductBase])
async def get_products(db: db_dependency):
    db_products = db.query(models.Product).all()
    if db_products is None:
        raise HTTPException(status_code=404, detail="Products could not be found")
        
    return db_products


#Get specific Product
@router.get("/products/{product_id}", status_code=status.HTTP_200_OK)
async def get_product(product_id: str, db: db_dependency):
    db_product = db.query(models.Product)\
        .options(joinedload(models.Product.size), 
                 joinedload(models.Product.image_id))\
        .filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


#Update Product
@router.put("/products/{product_id}", status_code=status.HTTP_200_OK)
async def update_product(product_id: str, product: UpdateProduct, db: db_dependency):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product is not found")
    
    print(f"Product: {product} ")
    update_data = product.dict(exclude_unset=True)
    if 'size' in update_data:
        del update_data['size']

    if 'image_id' in update_data:
        for image in update_data['image_id']:
            new_image = models.ProductImage(**image)
            db.add(new_image)
            db_product.image_id.append(new_image)
        del update_data['image_id']

    #for field, value in product.model_dump(exclude_unset=True).items():
    for field, value in update_data.items():
        print(f"Field: {field}, Value: {value}")
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)

    return db_product

#Update Product quantities
@router.put("/productquantity/{product_id}", status_code=status.HTTP_200_OK)
async def update_quantity(product_size: List[UpdateSize],
                          db: db_dependency,
                          ):
    for product in product_size:
        db_product_size = db.query(models.ProductSize).filter(models.ProductSize.id == product.id).first()
        if db_product_size is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
        for field, value in product.model_dump(exclude_unset=True).items():
            setattr(db_product_size, field, value)
    
        db.commit()
        db.refresh(db_product_size)
    return {"message": "Sizes updated correctly"}


#Delete Product
@router.delete("/products/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(product_id: str, db: db_dependency):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()

