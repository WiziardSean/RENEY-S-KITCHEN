from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.database import supabase
from app.ai_service import generate_custom_menu

app = FastAPI(title="Reneey's Kitchen Platform API")

# Configure CORS for local development ports
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Default Vite port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MenuRequest(BaseModel):
    guests: int
    budget: float
    occasion: str
    dietary_restrictions: str

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Reneey's Kitchen API"}

@app.get("/api/menus")
def get_menus():
    """
    Fetch available menu items from the Supabase 'menus' table.
    Falls back gracefully to static mock data if the database table is not set up.
    """
    try:
        response = supabase.table("menus").select("*").execute()
        # Check if we got data back (even if empty)
        if hasattr(response, 'data') and response.data is not None:
            # If the database table exists but is empty, seed it with initial values or return
            if len(response.data) > 0:
                return response.data
        
        # Fallback return value if no data in database table
        raise Exception("Table is empty or not initialized")
    except Exception as e:
        print("Fallback warning: menus table query failed or is empty. Using default catalogs. Error details:", str(e))
        return [
            {
                "id": "1",
                "name": "Mediterranean Sunset Dinner",
                "description": "A refreshing 3-course trip through coastal Greece and Italy. Features fresh herbs, lemon-infused olive oil, and premium wild seafood.",
                "price": 120.00,
                "category": "Main",
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
            },
            {
                "id": "2",
                "name": "Modern French Gastronomy",
                "description": "Classic French techniques redefined. Duck breast with black cherry reduction, truffle frites, and fine dark chocolate souffles.",
                "price": 180.00,
                "category": "Main",
                "image_url": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80"
            },
            {
                "id": "3",
                "name": "Signature Omakase & Sake Pairing",
                "description": "An intimate sushi selection curated live at your residence by Chef Reneey. Accompanied by rare artisanal small-brewery sakes.",
                "price": 250.00,
                "category": "Special",
                "image_url": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80"
            }
        ]

@app.post("/api/ai/recommend-menu")
def recommend_menu(request: MenuRequest):
    """
    Endpoint that triggers OpenAI gpt-4o-mini to build a custom private chef menu.
    """
    try:
        if request.guests <= 0:
            raise HTTPException(status_code=400, detail="Guest count must be at least 1")
        if request.budget <= 0:
            raise HTTPException(status_code=400, detail="Budget must be greater than 0")
            
        menu = generate_custom_menu(
            guests=request.guests,
            budget=request.budget,
            occasion=request.occasion,
            dietary_restrictions=request.dietary_restrictions
        )
        return menu
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
