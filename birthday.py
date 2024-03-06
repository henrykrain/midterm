from fastapi import APIRouter, Path, HTTPException, status
from model import BirthdayEntry, BirthdayEntryRequest
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

birthday_router = APIRouter()

# In-memory database
entries = []
max_id = 0

@birthday_router.post("/birthdays/")
async def create_entry(entry: BirthdayEntryRequest):
    global max_id
    max_id += 1
    new_entry = BirthdayEntry(id=max_id, **entry.dict())
    entries.append(new_entry)
    return new_entry

@birthday_router.get("/birthdays/")
async def read_entries():
    return entries

@birthday_router.put("/birthdays/{entry_id}")
async def update_entry(entry_id: int, entry: BirthdayEntryRequest):
    for e in entries:
        if e.id == entry_id:
            e.name = entry.name
            e.birthday = entry.birthday
            return e
    raise HTTPException(status_code=404, detail="Entry not found")

@birthday_router.delete("/birthdays/{entry_id}")
async def delete_entry(entry_id: int):
    for i, e in enumerate(entries):
        if e.id == entry_id:
            return entries.pop(i)
    raise HTTPException(status_code=404, detail="Entry not found")
