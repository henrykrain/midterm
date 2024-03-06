import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from birthday import birthday_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows all origins for the sake of example; adjust in production
    allow_credentials=True,
    allow_methods=["*"],  # Or specify: ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],
)


@app.get("/")
async def read_index():
    return FileResponse("./frontend/index.html")

app.include_router(birthday_router)

app.mount("/", StaticFiles(directory="frontend"), name="static")

# uvicorn.run(app, host="localhost", port=8000)