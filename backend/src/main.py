from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.infrastructure.database import check_database_connection

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

from src.api.routes import project_router, scenario_router, commodity_router, tenant_router, cargo_flow_router
app.include_router(project_router)
app.include_router(scenario_router)
app.include_router(commodity_router)
app.include_router(tenant_router)
app.include_router(cargo_flow_router)

@app.get("/health")
def health_check():
    db_connected = check_database_connection()
    if not db_connected:
        raise HTTPException(status_code=503, detail="Database connection is unavailable")
    return {"status": "ok", "database": "connected"}

