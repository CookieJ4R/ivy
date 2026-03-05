
from fastapi import APIRouter, HTTPException, Response, status

from models.tag_model import TagModel, TagUsageModel
from services.tag_service import TagService


def create_tags_router(service: TagService) -> APIRouter:
    """
    Creates the router for tag related endpoints.
    """
    router = APIRouter()
    @router.post("/create")
    @router.put("/create")
    async def create_tag(tag: TagModel):
        """
        Creates a new tag.
        """
        try:
            await service.create(tag.name, tag.color)
            return Response(status_code=status.HTTP_201_CREATED)
        except ValueError as e:
            raise HTTPException(400, str(e))

    @router.get("/list")
    async def list_tags() -> list[TagModel]:
        """
        Lists all tags.
        :return: A list of TagModel instances.
        """
        return await service.list()

    @router.get("/usage")
    async def list_tag_usage() -> TagUsageModel:
        """
        Lists the usage statistics of tags.
        :return: TagUsageModel containing usage statistics.
        """
        return await service.list_usage()

    @router.post("/edit")
    async def edit_tag(tag: TagModel):
        """
        Edits an existing tag.
        :param tag: The TagModel model passed from the frontend.
        """
        try:
            await service.update(tag.id, tag.name, tag.color)
            return Response(status_code=status.HTTP_200_OK)
        except ValueError as e:
            raise HTTPException(400, str(e))


    @router.delete("/delete/{tag_id}")
    async def delete_tag(tag_id: int):
        """
        Deletes a tag by its ID.
        :param tag_id: The ID of the tag to delete.
        """
        try:
            await service.delete(tag_id)
            return Response(status_code=status.HTTP_200_OK)
        except ValueError as e:
            raise HTTPException(400, str(e))


    return router