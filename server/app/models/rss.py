from pydantic import BaseModel
from app.internal.util import strip_html_tags


class RssFetchRequest(BaseModel):
    urls: list[str]
    limit: int = 10


class RssFeedModel(BaseModel):
    title: str
    link: str
    description: str
    published: str
    tags: list[str]

    @staticmethod
    def from_entry(entry):
        return RssFeedModel(
            title=strip_html_tags(entry.title),
            link=entry.link,
            description=strip_html_tags(entry.description),
            published=entry.published,
            tags=[tag.term for tag in entry.tags],
        )


class RssFeedEntriesModel(BaseModel):
    entries: list[RssFeedModel]
