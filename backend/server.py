from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', '')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class PropertyBase(BaseModel):
    title: str
    location: str
    price: int
    property_type: str  # villa, penthouse, estate, apartment
    bedrooms: int
    bathrooms: int
    area: int  # sq ft
    description: str
    features: List[str] = []
    images: List[str] = []
    featured: bool = False

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    price: Optional[int] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[int] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    images: Optional[List[str]] = None
    featured: Optional[bool] = None

class Property(PropertyBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InquiryCreate(BaseModel):
    property_id: Optional[str] = None
    property_title: Optional[str] = None
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class Inquiry(InquiryCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== PROPERTY ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "Quiet Wealth Real Estate API"}

@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    property_type: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    location: Optional[str] = Query(None),
    bedrooms: Optional[int] = Query(None),
    featured: Optional[bool] = Query(None)
):
    query = {}
    if property_type:
        query["property_type"] = property_type
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if bedrooms:
        query["bedrooms"] = {"$gte": bedrooms}
    if featured is not None:
        query["featured"] = featured
    
    properties = await db.properties.find(query, {"_id": 0}).to_list(100)
    for prop in properties:
        if isinstance(prop.get('created_at'), str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
    return properties

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    prop = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if isinstance(prop.get('created_at'), str):
        prop['created_at'] = datetime.fromisoformat(prop['created_at'])
    return prop

@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    prop = Property(**property_data.model_dump())
    doc = prop.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.properties.insert_one(doc)
    return prop

@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, property_data: PropertyUpdate):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = {k: v for k, v in property_data.model_dump().items() if v is not None}
    if update_data:
        await db.properties.update_one({"id": property_id}, {"$set": update_data})
    
    updated = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}

# ==================== INQUIRY ENDPOINTS ====================

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry_data: InquiryCreate):
    inquiry = Inquiry(**inquiry_data.model_dump())
    doc = inquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.inquiries.insert_one(doc)
    
    # Send email notification if configured
    if resend.api_key and NOTIFICATION_EMAIL:
        try:
            property_info = ""
            if inquiry_data.property_title:
                property_info = f"<p><strong>Property:</strong> {inquiry_data.property_title}</p>"
            
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #050505;">New Property Inquiry</h2>
                {property_info}
                <p><strong>Name:</strong> {inquiry_data.name}</p>
                <p><strong>Email:</strong> {inquiry_data.email}</p>
                <p><strong>Phone:</strong> {inquiry_data.phone or 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #f5f5f4; padding: 15px; border-left: 3px solid #E5D0AC;">{inquiry_data.message}</p>
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [NOTIFICATION_EMAIL],
                "subject": f"New Inquiry: {inquiry_data.property_title or 'General Contact'}",
                "html": html_content
            }
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email notification sent for inquiry {inquiry.id}")
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
    
    return inquiry

@api_router.get("/inquiries", response_model=List[Inquiry])
async def get_inquiries():
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for inq in inquiries:
        if isinstance(inq.get('created_at'), str):
            inq['created_at'] = datetime.fromisoformat(inq['created_at'])
    return inquiries

@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted successfully"}

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    # Check if properties already exist
    count = await db.properties.count_documents({})
    if count > 0:
        return {"message": f"Database already has {count} properties"}
    
    sample_properties = [
        {
            "id": str(uuid.uuid4()),
            "title": "The Midnight Estate",
            "location": "Beverly Hills, California",
            "price": 45000000,
            "property_type": "estate",
            "bedrooms": 8,
            "bathrooms": 12,
            "area": 18500,
            "description": "An architectural masterpiece of understated grandeur. Conceived by a Pritzker laureate, this residence commands the most coveted promontory in Beverly Hills. Floor-to-ceiling glass walls dissolve the boundary between interior sanctuary and panoramic cityscape.",
            "features": ["Infinity Pool", "Wine Cellar", "Home Theater", "Guest House", "Motor Court", "Smart Home"],
            "images": [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
            ],
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Obsidian Penthouse",
            "location": "Manhattan, New York",
            "price": 32000000,
            "property_type": "penthouse",
            "bedrooms": 5,
            "bathrooms": 6,
            "area": 8200,
            "description": "Suspended above the city, this penthouse offers a rare convergence of privacy and prominence. Italian marble, hand-selected oak, and bronze accents create an atmosphere of quiet power. The wraparound terrace presents Manhattan as a private theater.",
            "features": ["Private Elevator", "Wraparound Terrace", "Chef's Kitchen", "Library", "Wine Room"],
            "images": [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
                "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200"
            ],
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Villa Serenità",
            "location": "Lake Como, Italy",
            "price": 28000000,
            "property_type": "villa",
            "bedrooms": 7,
            "bathrooms": 8,
            "area": 12000,
            "description": "A testament to Italian craftsmanship, this lakefront villa has hosted generations of quiet distinction. Original frescoes complement contemporary renovations, while private gardens descend to a centuries-old boat house.",
            "features": ["Lake Access", "Historic Gardens", "Guest Quarters", "Wine Cellar", "Boat House"],
            "images": [
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200"
            ],
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "The Glass Pavilion",
            "location": "Aspen, Colorado",
            "price": 38000000,
            "property_type": "estate",
            "bedrooms": 6,
            "bathrooms": 8,
            "area": 14000,
            "description": "Where architecture meets wilderness. This mountain retreat frames the Rockies through expansive glass walls that disappear into the landscape. Radiant heated floors, a ski-in trail, and complete privacy define alpine luxury.",
            "features": ["Ski Access", "Heated Driveway", "Spa", "Gym", "Media Room", "Generator"],
            "images": [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
                "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200"
            ],
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Maison Noir",
            "location": "Paris, France",
            "price": 22000000,
            "property_type": "apartment",
            "bedrooms": 4,
            "bathrooms": 4,
            "area": 5500,
            "description": "In the heart of the 7th arrondissement, this Haussmann masterpiece has been reimagined for contemporary living. Original moldings and herringbone parquet harmonize with a curated palette of midnight hues and burnished metals.",
            "features": ["Eiffel View", "Terrace", "Concierge", "Parking", "Wine Storage"],
            "images": [
                "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200",
                "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"
            ],
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Harbour Sanctuary",
            "location": "Sydney, Australia",
            "price": 35000000,
            "property_type": "penthouse",
            "bedrooms": 5,
            "bathrooms": 5,
            "area": 7800,
            "description": "Commanding uninterrupted views of the Opera House and Harbour Bridge, this residence represents the pinnacle of Sydney living. Stone, timber, and bronze create a distinctly Australian interpretation of global luxury.",
            "features": ["Harbour Views", "Private Pool", "Wine Cellar", "Staff Quarters", "Triple Garage"],
            "images": [
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
                "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200"
            ],
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.properties.insert_many(sample_properties)
    return {"message": f"Seeded {len(sample_properties)} properties"}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
