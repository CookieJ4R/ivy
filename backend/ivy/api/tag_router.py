from fastapi import APIRouter, HTTPException, Response, status

from model.schema.tag_model import CreateTagRequest, TagResponse, TagUsageResponse, UpdateTagRequest
from service import tag_service


def create_tags_router() -> APIRouter:
    """
    Creates the router for tag related endpoints.
    """
    router = APIRouter()
    @router.post("/create")
    @router.put("/create")
    async def create_tag(tag: CreateTagRequest):
        """
        Creates a new tag.
        """
        try:
            await tag_service.create_tag(tag)
            return Response(status_code=status.HTTP_201_CREATED)
        except ValueError as e:
            raise HTTPException(400, str(e))

    @router.get("/list")
    async def list_tags() -> list[TagResponse]:
        """
        Lists all tags.
        :return: A list of TagModel instances.
        """
        return await tag_service.list_tags()

    @router.get("/usage")
    async def list_tag_usage() -> TagUsageResponse:
        """
        Lists the usage statistics of tags.
        :return: TagUsageModel containing usage statistics.
        """
        return await tag_service.list_tags_usage()

    @router.post("/edit")
    async def edit_tag(tag: UpdateTagRequest):
        """
        Edits an existing tag.
        :param tag: The TagModel model passed from the frontend.
        """
        try:
            await tag_service.update_tag(tag)
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
            await tag_service.delete_tag(tag_id)
            return Response(status_code=status.HTTP_200_OK)
        except ValueError as e:
            raise HTTPException(400, str(e))

    return router
