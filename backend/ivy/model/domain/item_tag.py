"""
SQLAlchemy Table for item tag mapping
"""
from sqlalchemy import Table, Column, ForeignKey

from .base import Base

item_tag_mappings = Table(
    "item_tag_mappings",
    Base.metadata,
    Column("item_id", ForeignKey("items.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)