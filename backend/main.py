from fastapi import FastAPI
from routes import analyze, risk, lifecycle

app = FastAPI(title="ILCS Contract AI")

app.include_router(analyze.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(lifecycle.router, prefix="/api")
