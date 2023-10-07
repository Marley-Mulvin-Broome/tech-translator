from fastapi import APIRouter, Depends, HTTPException
from app.models.rss import RssFetchRequest, RssFeedEntriesModel
from app.dependencies import validate_token
from app.internal.rss import fetch_rss_feeds


rss_router = APIRouter(
    prefix="/rss", tags=["rss"], dependencies=[Depends(validate_token)]
)


@rss_router.post("/")
async def get_rss(request: RssFetchRequest) -> list[RssFeedEntriesModel]:
    if request.limit <= 0:
        raise HTTPException(
            status_code=400,
            detail="limitは1以上の整数である必要があります",
        )

    feeds = await fetch_rss_feeds(request.urls)

    return feeds
