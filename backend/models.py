from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    medicine_name = Column(String, nullable=False)
    generic_name = Column(String)
    category = Column(String)
    batch_no = Column(String)
    expiry_date = Column(String)
    quantity = Column(Integer, default=0)
    cost_price = Column(Float)
    mrp = Column(Float)
    supplier = Column(String)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=func.now())

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String, unique=True)
    patient_name = Column(String)
    items_count = Column(Integer)
    payment_method = Column(String)
    total_amount = Column(Float)
    status = Column(String, default="Completed")
    created_at = Column(DateTime, default=func.now())