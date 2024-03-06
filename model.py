from pydantic import BaseModel
from datetime import date


class BirthdayEntry(BaseModel):
    id: int
    name: str
    birthday: date

class BirthdayEntryRequest(BaseModel):
    name: str
    birthday: date