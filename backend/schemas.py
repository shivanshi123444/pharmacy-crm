from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicineCreate(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    category: Optional[str] = None
    batch_no: Optional[str] = None
    expiry_date: Optional[str] = None
    quantity: int = 0
    cost_price: Optional[float] = None
    mrp: Optional[float] = None
    supplier: Optional[str] = None
    status: str = "Active"

class MedicineUpdate(BaseModel):
    medicine_name: Optional[str] = None
    generic_name: Optional[str] = None
    category: Optional[str] = None
    batch_no: Optional[str] = None
    expiry_date: Optional[str] = None
    quantity: Optional[int] = None
    cost_price: Optional[float] = None
    mrp: Optional[float] = None
    supplier: Optional[str] = None
    status: Optional[str] = None

class MedicineResponse(MedicineCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SaleResponse(BaseModel):
    id: int
    invoice_no: str
    patient_name: str
    items_count: int
    payment_method: str
    total_amount: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True