
from fastapi import APIRouter, status, HTTPException, Response
from pydantic import BaseModel

from models.location_model import LocationModel
from services.location_service import LocationService


def create_locations_router(service: LocationService) -> APIRouter:
    """
    Creates the router for location related endpoints.
    """
    router = APIRouter()
    @router.post("/create")
    @router.put("/create")
    async def create_location(location: LocationModel):
        """
        Creates a new location.
        :param location: The LocationModel model passed from the frontend.
        """
        try:
            await service.create(location.name)
            return Response(status_code=status.HTTP_201_CREATED)
        except ValueError as e:
            raise HTTPException(400, str(e))

    @router.get("/list")
    async def list_locations() -> list[LocationModel]:
        """
        Lists all locations.
        :return: A list of LocationModel instances.
        """
        locations = await service.list()
        return locations

    # delete location
    @router.delete("/delete/{location_id}")
    async def delete_location(location_id: int):
        """
        Deletes a location by its ID.
        :param location_id: The ID of the location to delete.
        """
        try:
            await service.delete(location_id)
            return Response(status_code=status.HTTP_200_OK)
        except ValueError as e:
            raise HTTPException(400, str(e))

    # edit location
    @router.post("/edit")
    async def edit_location(location: LocationModel):
        """
        Edits a location's name by its ID.
        :param location: The LocationModel model passed from the frontend containing the ID and new name.
        """
        try:
            await service.update(location)
            return Response(status_code=status.HTTP_200_OK)
        except ValueError as e:
            raise HTTPException(400, str(e))

    return router
