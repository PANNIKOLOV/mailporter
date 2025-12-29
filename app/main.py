import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

@app.get("/")
async def debug_root():
    # 1. Βρες πού βρισκόμαστε τώρα (Current Working Directory)
    cwd = os.getcwd()
    
    # 2. Δες τι αρχεία υπάρχουν εδώ
    files_in_root = os.listdir(cwd)
    
    # 3. Δες αν υπάρχει φάκελος 'frontend' εδώ
    frontend_path = os.path.join(cwd, "frontend")
    frontend_exists = os.path.exists(frontend_path)
    
    files_in_frontend = "Folder not found"
    if frontend_exists:
        try:
            files_in_frontend = os.listdir(frontend_path)
        except:
            files_in_frontend = "Found but cannot read"

    # Επιστρέφουμε τα στοιχεία για να δούμε τι συμβαίνει
    return {
        "DEBUG_INFO": "Αναφορά αρχείων",
        "Τρέχων Φάκελος (CWD)": cwd,
        "Αρχεία στον τρέχοντα φάκελο": files_in_root,
        "Ψάχνω το frontend εδώ": frontend_path,
        "Υπάρχει το frontend;": frontend_exists,
        "Περιεχόμενα Frontend": files_in_frontend
    }

@app.get("/api/health")
async def health():
    return {"status": "ok"}