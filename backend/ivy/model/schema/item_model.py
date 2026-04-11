from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from model.domain.item_attachment_mappings import ItemAttachment
from model.schema.attachment_model import AttachmentModel
from model.schema.location_model import LocationResponse
from model.schema.tag_model import TagResponse


class ItemLocationReference(BaseModel):
    """
    Model for item location reference.
    """
    id: int


class ItemTagReference(BaseModel):
    """
    Model for item tag reference.
    """
    id: int


class CreateItemRequest(BaseModel):
    """
    Model for create item request.
    """
    name: str
    description: str
    image: Optional[str] = None
    location: Optional[ItemLocationReference] = None
    attachments: list[AttachmentModel] = Field(default_factory=list)
    tags: list[ItemTagReference] = Field(default_factory=list)
    quantity: int = 1
    date_of_purchase: Optional[datetime] = Field(alias="dateOfPurchase", default=None)
    buy_price: Optional[float] = Field(alias="buyPrice", default=None)
    bought_from: Optional[str] = Field(alias="boughtFrom", default=None)
    isbn: Optional[str] = None
    model_number: Optional[str] = Field(alias="modelNumber", default=None)
    notes: Optional[str] = None
    serial_number: Optional[str] = Field(alias="serialNumber", default=None)

    model_config = ConfigDict(populate_by_name=True)


class ListItemResponse(BaseModel):
    """
    Model for list item response.
    """
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    location: Optional[LocationResponse] = None
    tags: list[TagResponse] = Field(default_factory=list)
    quantity: int = 1
    isbn: Optional[str] = None
    notes: Optional[str] = None
    date_of_purchase: Optional[datetime] = Field(serialization_alias="dateOfPurchase", default=None)
    buy_price: Optional[float] = Field(serialization_alias="buyPrice", default=None)
    bought_from: Optional[str] = Field(serialization_alias="boughtFrom", default=None)
    model_number: Optional[str] = Field(serialization_alias="modelNumber", default=None)
    serial_number: Optional[str] = Field(serialization_alias="serialNumber", default=None)
    attachments: list[str] = Field(default_factory=list)

    @field_validator("attachments", mode="before")
    @classmethod
    def extract_paths(cls, v):
        """
        Validator is necessary here to extract the strings for the response.
        Without it I also did run into greenlet issues with sqlalchemy.
        """
        return [a.attachment_path if (isinstance(a, ItemAttachment) and hasattr(a, "attachment_path")) else a for a in v]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
