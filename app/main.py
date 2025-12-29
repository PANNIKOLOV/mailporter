import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Βρίσκουμε το root path
root_dir = os.getcwd() # Είναι συνήθως το /app στο Dokploy
dist_dir = os.path.join(root_dir, "frontend", "dist")

# 1. Έλεγχος αν πέτυχε το build
if not os.path.exists(dist_dir):
    print(f"SOS: Δεν βρέθηκε ο φάκελος {dist_dir}. Κάτι πήγε στραβά με το npm run build.")

# 2. Mount τα Assets του Vite (JS/CSS)
# Το Vite συνήθως βάζει τα αρχεία στο dist/assets
assets_dir = os.path.join(dist_dir, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# 3. Σερβίρισμα του index.html (React App)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Εξαίρεση για το API (μην το μπερδεύουμε με το React)
    if full_path.startswith("api"):
        return {"error": "API endpoint not found"}
    
    # Για οποιοδήποτε άλλο URL, στέλνουμε το index.html του React
    # (ώστε να δουλεύει το React Router αν έχεις)
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"error": "React Build not found (dist folder missing)"}

# 4. Τα API endpoints σου (ΠΡΕΠΕΙ να είναι ΠΑΝΩ από το React route αν θες να είσαι τυπικός, 
# αλλά με το if check που έβαλα είσαι οκ)
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "env": "production"}