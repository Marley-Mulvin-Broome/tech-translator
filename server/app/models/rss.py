from pydantic import BaseModel
from app.internal.util import strip_html_tags
from typing import List, Optional

class RssFetchRequest(BaseModel):
    urls: List[str]
    limit: int = 10
    image_url: Optional[str] = None

class RssFeedModel(BaseModel):
    title: str
    link: str
    description: str
    published: str
    tags: list[str]
    image_url: str | None

    @staticmethod
    def from_entry(entry):
        image_url = None
        if 'enclosures' in entry:
            for enclosure in entry.enclosures:
                if enclosure.type.startswith('image/'):
                    image_url = enclosure.href
                    break
        elif 'media_content' in entry:
            for media in entry.media_content:
                if media['type'].startswith('image/'):
                    image_url = media['url']
                    break
        
        return RssFeedModel(
            title=strip_html_tags(entry.title),
            link=entry.link,
            description=strip_html_tags(entry.description),
            published=entry.published,
            tags=[tag.term for tag in entry.tags],
            image_url=image_url
        )


class RssFeedEntriesModel(BaseModel):
    entries: list[RssFeedModel]
