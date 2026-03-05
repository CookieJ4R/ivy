from database.database_manager import DatabaseManager
from models.location_model import LocationModel
from utils.validation_util import validate_tuple_safe


class LocationRepository:
    """
    Repository for managing locations in the database, providing methods for CRUD operations.
    """
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager

    async def create(self, location_name: str):
        """
        Creates a new location with the given name.
        :param location_name: The name of the location to create.
        """
        await self.db_manager.execute(
            "INSERT INTO locations (name) VALUES (?);",
            (location_name,)
        )

    async def update(self, location_id: int, location_name: str):
        """
        Updates the name for an existing location with the given ID.
        :param location_id: The ID of the location to update.
        :param location_name: The new name for the location.
        """
        await self.db_manager.execute(
            "UPDATE locations SET name = ? WHERE id = ?;",
            (location_name, location_id)
        )

    async def delete(self, location_id: int):
        """
        Deletes the location with the given ID.
        :param location_id: The ID of the location to delete.
        """
        await self.db_manager.execute(
            "DELETE FROM locations WHERE id = ?;",
            (location_id,)
        )

    async def list_all(self) -> list[LocationModel]:
        """
        Lists all locations in the database.
        :return: A list of LocationModel instances representing all locations.
        """
        locations = await self.db_manager.fetch_all("SELECT * FROM locations;")
        validated_locations = [validate_tuple_safe(loc, LocationModel) for loc in locations]
        return [loc for loc in validated_locations if loc is not None]

    async def get_location(self, location_id: int) -> LocationModel | None:
        """
        Retrieves a location by its ID.
        :param location_id: The ID of the location to retrieve.
        :return: A LocationModel instance if found, otherwise None.
        """
        row = await self.db_manager.fetch_one(
            "SELECT * FROM locations WHERE id = ?;",
            (location_id,)
        )
        if row:
            location = validate_tuple_safe(row, LocationModel)
            return location
        return None

    async def does_location_exist(self, project_name):
        """
        Checks if a location with the given name already exists in the database.
        :param project_name: The name of the location to check for existence.
        :return: True if a location with the given name exists, otherwise False.
        """
        row = await self.db_manager.fetch_one(
            "SELECT 1 FROM locations WHERE name = ?;",
            (project_name,)
        )
        return row is not None

    async def does_location_id_exist(self, project_id: int):
        """
        Checks if a location with the given ID already exists in the database.
        :param project_id: The ID of the location to check for existence.
        :return: True if a location with the given ID exists, otherwise False.
        """
        row = await self.db_manager.fetch_one(
            "SELECT 1 FROM locations WHERE id = ?;",
            (project_id,)
        )
        return row is not None
