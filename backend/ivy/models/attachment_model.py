from typing import Optional

from pydantic import BaseModel

class AttachmentModel(BaseModel):
    """
    Model representing an attachment associated with an item.
    """
    id: Optional[int] = None
    path: str
