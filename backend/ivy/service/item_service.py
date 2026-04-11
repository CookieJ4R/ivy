"""
Service layer for managing items.
"""
from database.db import AsyncSessionLocal
from model.domain.item import Item
from model.domain.item_attachment_mappings import ItemAttachment
from model.domain.item_tag import item_tag_mappings
from model.schema.item_model import CreateItemRequest, ListItemResponse
from service import file_storage_service
from sqlalchemy import select, delete, insert
from sqlalchemy.orm import selectinload


async def create_item(item_model: CreateItemRequest) -> None:
    """
    Creates a new item in the database based on the provided request model.
    :param item_model: The request model containing the details of the item to create.
    """
    async with AsyncSessionLocal() as session:
        async with session.begin():
            item_data = item_model.model_dump(exclude={"tags", "attachments", "image", "location"})
            item_data["location_id"] = item_model.location.id if item_model.location else None
            item = Item(**item_data)
            session.add(item)
            # flush to get the item ID
            await session.flush()

            if item_model.image is not None:
                image_path = file_storage_service.finalize_image_upload(item_model.image, item.id)
                item.image = image_path
            final_paths = file_storage_service.finalize_upload(item_model.attachments, item.id)
            session.add_all([ItemAttachment(item_id=item.id, attachment_path=path) for path in final_paths])

            # manually add the item_tag mapping because otherwise we run into a greenlet error here
            # (not 100% sure on the reason but seems to be caused by async/sync during the transaction)
            await session.execute(
                insert(item_tag_mappings),
                [{"item_id": item.id, "tag_id": t.id} for t in item_model.tags],
            )

async def delete_item(item_id: int):
    """
    Deletes an item by its ID.
    :param item_id: The ID of the item to delete.
    :raises ValueError: If the item ID does not exist.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(delete(Item).where(Item.id == item_id))
        if result.rowcount == 0:
            raise ValueError(f"Item with ID '{item_id}' does not exist.")
        await session.commit()
    file_storage_service.delete_files_for_item(item_id)

async def list_items() -> list[ListItemResponse]:
    """
    Lists all items with their associated tags, location, and attachments.
    :return: A list of ListItemResponse instances.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Item).options(
                selectinload(Item.tags),
                selectinload(Item.attachments),
                selectinload(Item.location)
            )
        )
        items = result.scalars().all()
        return [ListItemResponse.model_validate(item) for item in items]
