from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CreateLocationRequest(BaseModel):
    """
    Model for create location request.
    """
    name: str


class UpdateLocationRequest(BaseModel):
    """
    Model for update location request.
    """
    id: int
    name: str


class LocationResponse(BaseModel):
    """
    Model for list location response.
    """
    id: int
    name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
