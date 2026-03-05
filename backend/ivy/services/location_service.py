from models.location_model import LocationModel
from repositories.location_repository import LocationRepository


class LocationService:
    """
    Service layer for managing locations.
    """

    def __init__(self, location_repository: LocationRepository):
        self.repo = location_repository

    async def create(self, location_name: str):
        """
        Creates a new location with the given name.
        :param location_name: The name of the location to create.
        :raises ValueError: If the location name is empty or if a location with the same name already exists.
        """
        if location_name.strip() == "":
            raise ValueError("Location name cannot be empty.")
        if await self.repo.does_location_exist(location_name):
            raise ValueError(f"Location '{location_name}' already exists.")
        await self.repo.create(location_name)

    async def update(self, location: LocationModel):
        """
        Updates the name for an existing location with the given ID.
        :param location: The LocationModel instance containing the ID and new name.
        :raises ValueError: If the location ID does not exist or if the new location name is empty.
        """
        if not await self.repo.does_location_id_exist(location.id):
            raise ValueError(f"Location with ID '{location.id}' does not exist.")
        if location.name.strip() == "":
            raise ValueError("Location name cannot be empty.")
        await self.repo.update(location.id, location.name.strip())

    async def delete(self, location_id: int):
        """
        Deletes the location with the given ID.
        :param location_id: The ID of the location to delete.
        :raises ValueError: If the location ID does not exist.
        """
        if not await self.repo.does_location_id_exist(location_id):
            raise ValueError(f"Location with ID '{location_id}' does not exist.")
        await self.repo.delete(location_id)

    async def list(self) -> list[LocationModel]:
        """
        Lists all locations.
        :return: A list of LocationModel instances.
        """
        return await self.repo.list_all()
