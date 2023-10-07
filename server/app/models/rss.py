from pydantic import BaseModel


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
            title=entry.title,
            link=entry.link,
            description=entry.description,
            published=entry.published,
            tags=[tag.term for tag in entry.tags],
        )


class RssFeedEntriesModel(BaseModel):
    entries: list[RssFeedModel]
