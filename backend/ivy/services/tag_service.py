from models.tag_model import TagModel, TagUsageModel
from repositories.tag_repository import TagRepository
from utils.helper import generate_random_hex_color


class TagService:
    """
    Service layer for managing tags.
    """
    def __init__(self, tag_repository: TagRepository):
        self.repo = tag_repository

    async def create(self, tag_name: str, tag_color: str = ""):
        """
        Creates a new tag with the given name and color. If the color is empty, a random hex color will be generated.
        :param tag_name: The name of the tag to create.
        :param tag_color: The color of the tag to create. If empty, a random color will be generated.
        :raises ValueError: If the tag name is empty or if a tag with the same name already exists.
        """
        if tag_name.strip() == "":
            raise ValueError("Tag name cannot be empty.")
        if await self.repo.does_tag_exist(tag_name):
            raise ValueError(f"Tag '{tag_name}' already exists.")
        if tag_color.strip() == "":
            tag_color = generate_random_hex_color()
        await self.repo.create(tag_name.strip(), tag_color.strip())

    async def update(self, tag_id: int, tag_name: str, tag_color: str):
        """
        Updates the name and color for an existing tag with the given ID.
        If the color is empty, a random hex color will be generated.
        :param tag_id: The ID of the tag to update.
        :param tag_name: The new name for the tag.
        :param tag_color: The new color for the tag. If empty, a random color will be generated.
        :raises ValueError: If the tag ID does not exist or if the tag name is empty.
        """
        if not await self.repo.does_tag_id_exist(tag_id):
            raise ValueError(f"Tag with ID '{tag_id}' does not exist.")
        if tag_name.strip() == "":
            raise ValueError("Tag name cannot be empty.")
        if tag_color.strip() == "":
            tag_color = generate_random_hex_color()
        await self.repo.update(tag_id, tag_name.strip(), tag_color.strip())

    async def delete(self, tag_id: int):
        """
        Deletes the tag with the given ID and unlinks it from any associated items.
        :param tag_id: The ID of the tag to delete.
        :raises ValueError: If the tag ID does not exist.
        """
        if not await self.repo.does_tag_id_exist(tag_id):
            raise ValueError(f"Tag with ID '{tag_id}' does not exist.")
        await self.repo.delete(tag_id)
        await self.repo.unlink_tag(tag_id)

    async def list_usage(self) -> TagUsageModel:
        """
        Lists the usage statistics of tags (how many are used, unused, ...)
        Currently only lists used vs unused but can be extended in the future with stuff like most used tags, least used tags, etc.
        :return: TagUsageModel containing usage statistics.
        """
        return await self.repo.list_usage()

    async def list(self) -> list[TagModel]:
        """
        Lists all tags.
        :return: A list of TagModel instances.
        """
        return await self.repo.list_all()
