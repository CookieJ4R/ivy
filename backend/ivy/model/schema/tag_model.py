from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CreateTagRequest(BaseModel):
    """
    Model for create tag request.
    """
    name: str
    color: str = ""

class UpdateTagRequest(BaseModel):
    """
    Model for update tag request.
    """
    id: int
    name: str
    color: str

class TagResponse(BaseModel):
    """
    Model for single tag response.
    """
    id: int
    name: str
    color: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TagUsageResponse(BaseModel):
    """
    Model for tag usage response.
    """
    used: int
    unused: int
