from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional, List
import models, schemas
from database import engine, get_db, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pharmacy CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_data():
    db = SessionLocal()
    if db.query(models.Medicine).count() == 0:
        medicines = [
            models.Medicine(medicine_name="Paracetamol 650mg", generic_name="Acetaminophen",
                category="Analgesic", batch_no="PCM-2024-0892", expiry_date="2026-08-20",
                quantity=500, cost_price=15.0, mrp=25.0, supplier="MedSupply Co.", status="Active"),
            models.Medicine(medicine_name="Omeprazole 20mg Capsule", generic_name="Omeprazole",
                category="Gastric", batch_no="OMP-2024-5873", expiry_date="2025-11-10",
                quantity=45, cost_price=65.0, mrp=95.75, supplier="HealthCare Ltd.", status="Low Stock"),
            models.Medicine(medicine_name="Aspirin 75mg", generic_name="Aspirin",
                category="Anticoagulant", batch_no="ASP-2023-3421", expiry_date="2024-09-30",
                quantity=300, cost_price=20.0, mrp=45.0, supplier="GreenMed", status="Expired"),
            models.Medicine(medicine_name="Atorvastatin 10mg", generic_name="Atorvastatin Besylate",
                category="Cardiovascular", batch_no="AME-2024-0945", expiry_date="2026-10-15",
                quantity=0, cost_price=145.0, mrp=195.0, supplier="PharmaCorp", status="Out of Stock"),
        ]
        db.add_all(medicines)
        sales = [
            models.Sale(invoice_no="INV-2024-1234", patient_name="Rajesh Kumar",
                items_count=3, payment_method="Card", total_amount=340, status="Completed"),
            models.Sale(invoice_no="INV-2024-1235", patient_name="Sarah Smith",
                items_count=2, payment_method="Cash", total_amount=145, status="Completed"),
            models.Sale(invoice_no="INV-2024-1236", patient_name="Michael Johnson",
                items_count=5, payment_method="UPI", total_amount=525, status="Completed"),
        ]
        db.add_all(sales)
        db.commit()
    db.close()

seed_data()

@app.get("/")
def root():
    return {"status": "Pharmacy CRM API is running"}

@app.get("/api/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    today = date.today()
    today_sales = db.query(func.sum(models.Sale.total_amount)).filter(
        func.date(models.Sale.created_at) == today
    ).scalar() or 0
    items_sold = db.query(func.sum(models.Sale.items_count)).filter(
        func.date(models.Sale.created_at) == today
    ).scalar() or 0
    low_stock = db.query(models.Medicine).filter(
        models.Medicine.status == "Low Stock"
    ).count()
    purchase_orders = db.query(models.Medicine).filter(
        models.Medicine.status == "Out of Stock"
    ).count()
    return {
        "today_sales": today_sales,
        "items_sold_today": items_sold,
        "low_stock_items": low_stock,
        "purchase_orders": purchase_orders
    }

@app.get("/api/dashboard/recent-sales")
def get_recent_sales(db: Session = Depends(get_db)):
    sales = db.query(models.Sale).order_by(
        models.Sale.created_at.desc()
    ).limit(10).all()
    return sales

@app.get("/api/inventory", response_model=List[schemas.MedicineResponse])
def get_medicines(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Medicine)
    if search:
        query = query.filter(
            models.Medicine.medicine_name.ilike(f"%{search}%") |
            models.Medicine.generic_name.ilike(f"%{search}%")
        )
    if status:
        query = query.filter(models.Medicine.status == status)
    if category:
        query = query.filter(models.Medicine.category == category)
    return query.all()

@app.get("/api/inventory/overview")
def get_inventory_overview(db: Session = Depends(get_db)):
    total = db.query(models.Medicine).count()
    active = db.query(models.Medicine).filter(models.Medicine.status == "Active").count()
    low_stock = db.query(models.Medicine).filter(models.Medicine.status == "Low Stock").count()
    total_value = db.query(
        func.sum(models.Medicine.mrp * models.Medicine.quantity)
    ).scalar() or 0
    return {
        "total_items": total,
        "active_stock": active,
        "low_stock": low_stock,
        "total_value": total_value
    }

@app.post("/api/inventory", response_model=schemas.MedicineResponse, status_code=201)
def add_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = models.Medicine(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@app.put("/api/inventory/{medicine_id}", response_model=schemas.MedicineResponse)
def update_medicine(medicine_id: int, updates: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(medicine, key, value)
    db.commit()
    db.refresh(medicine)
    return medicine

@app.patch("/api/inventory/{medicine_id}/status")
def update_status(medicine_id: int, status: str, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    medicine.status = status
    db.commit()
    return {"message": "Status updated", "status": status}

@app.delete("/api/inventory/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(medicine)
    db.commit()
    return {"message": "Deleted successfully"}