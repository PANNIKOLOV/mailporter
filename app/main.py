from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.api import api_router
from app.core.config import settings
from app.core.database import engine, Base
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000", "https://mailporter.dionisos.icu"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve React Frontend
# We check if the build directory exists (production mode)
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if os.path.exists(frontend_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # If the path starts with /api, let it fall through to the API router (handled above)
        # But wait, the API router is already included with prefix.
        # So if we are here, it didn't match an API route.
        
        # Check if file exists in frontend/dist (e.g. favicon.ico)
        file_path = os.path.join(frontend_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Otherwise return index.html for React Router to handle
        return FileResponse(os.path.join(frontend_dir, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to MailPorter API (Frontend build not found)"}
