from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Maritime Transportation & Port Planning API",
    description="Backend API for Maritime Transportation and Port Planning DSS",
    version="0.1.0"
)

# Enable CORS for frontend connection (port 3000 is standard for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}
