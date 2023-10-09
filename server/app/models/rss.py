from pydantic import BaseModel
from app.internal.util import strip_html_tags
from typing import List, Optional


class RssFetchRequest(BaseModel):
    urls: List[str]
    limit: int = 10
    image_url: Optional[str] = None


def extract_image_url(entry):
    img_url = ""

    if "media_content" in entry:
        for media in entry.media_content:
            img_url = media["url"]

    return img_url


class RssFeedModel(BaseModel):
    title: str
    link: str
    description: str
    published: str
    tags: list[str]
    image_url: str | None

    @staticmethod
    def from_entry(entry):
        image_url = extract_image_url(entry)

        return RssFeedModel(
            title=strip_html_tags(entry.title),
            link=entry.link,
            description=strip_html_tags(entry.description),
            published=entry.published,
            tags=[tag.term for tag in entry.tags],
            image_url=image_url,
        )


class RssFeedEntriesModel(BaseModel):
    entries: list[RssFeedModel]
