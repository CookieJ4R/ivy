from database.database_manager import DatabaseManager
from models.tag_model import TagModel, TagUsageModel
from utils.validation_util import validate_tuple_safe


class TagRepository:
    """
    Repository for managing tags in the database, providing methods for crud operations.
    """
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    async def create(self, tag_name: str, tag_color: str):
        """
        Creates a new tag with the given name and color.
        :param tag_name: The name of the tag to create.
        :param tag_color: The color of the tag to create.
        """
        await self.db_manager.execute(
            "INSERT INTO tags (name, color) VALUES (?, ?);",
            (tag_name, tag_color)
        )

    async def update(self, tag_id: int, tag_name: str, tag_color: str):
        """
        Updates the name and color for an existing tag with the given ID.
        :param tag_id: The ID of the tag to update.
        :param tag_name: The new name for the tag.
        :param tag_color: The new color for the tag.
        """
        await self.db_manager.execute(
            "UPDATE tags SET name = ?, color = ? WHERE id = ?;",
            (tag_name, tag_color, tag_id)
        )

    async def delete(self, tag_id: int):
        """
        Deletes the tag with the given ID.
        :param tag_id: The ID of the tag to delete.
        """
        await self.db_manager.execute(
            "DELETE FROM tags WHERE id = ?;",
            (tag_id,)
        )

    async def unlink_tag(self, tag_id: int):
        """
        Unlinks the tag with the given ID from any associated items..
        :param tag_id: The ID of the tag to unlink.
        """
        await self.db_manager.execute("DELETE FROM item_tag_mappings WHERE tag_id = ?;", (tag_id,))

    async def list_all(self) -> list[TagModel]:
        """
        Lists all tags in the database.
        :return: A list of TagModel instances representing all tags.
        """
        tags = await self.db_manager.fetch_all("SELECT * FROM tags;")
        validated_tags = [validate_tuple_safe(tag, TagModel) for tag in tags]
        return [tag for tag in validated_tags if tag is not None]

    async def get_tags_by_ids(self, tag_ids: list[int]) -> list[TagModel]:
        """
        Retrieves tags from the database based on a list of tag IDs.
        :param tag_ids: A list of tag IDs to retrieve.
        :return: A list of TagModel instances corresponding to the provided tag IDs.
        """
        if not tag_ids:
            return []
        placeholders = ','.join('?' for _ in tag_ids)
        query = f"SELECT * FROM tags WHERE id IN ({placeholders});"
        tags = await self.db_manager.fetch_all(query, tuple(tag_ids))
        validated_tags = [validate_tuple_safe(tag, TagModel) for tag in tags]
        return [tag for tag in validated_tags if tag is not None]

    async def list_usage(self) -> TagUsageModel:
        """
        Lists the usage statistics of tags (how many are used, unused, ...)
        Currently only lists used vs unused but can be extended in the future with stuff like most used.
        :return: TagUsageModel containing usage statistics.
        """
        used_tags = await self.db_manager.fetch_all("SELECT COUNT(DISTINCT tag_id) FROM item_tag_mappings;")
        used_tags = used_tags[0][0] if used_tags else 0
        total_tags = await self.db_manager.fetch_all("SELECT COUNT(*) FROM tags;")
        total_tags = total_tags[0][0] if total_tags else 0
        unused_tags = total_tags-used_tags
        tag_usage = validate_tuple_safe((used_tags, unused_tags), TagUsageModel)
        return tag_usage if tag_usage is not None else TagUsageModel.model_validate({"used":0, "unused": 0})

    async def does_tag_exist(self, tag_name: str):
        """
        Checks if a tag with the given name already exists in the database.
        :param tag_name: The name of the tag to check for existence.
        """
        row = await self.db_manager.fetch_one(
            "SELECT 1 FROM tags WHERE name = ?;",
            (tag_name,)
        )
        return row is not None

    async def does_tag_id_exist(self, tag_id: int):
        """
        Checks if a tag with the given ID already exists in the database.
        """
        row = await self.db_manager.fetch_one(
            "SELECT 1 FROM tags WHERE id = ?;",
            (tag_id,)
        )
        return row is not None
