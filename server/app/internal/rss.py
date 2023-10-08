from httpx import AsyncClient
from feedparser import parse as parse_feed

from app.models.rss import RssFeedModel, RssFeedEntriesModel


async def fetch_rss_feed(url: str, limit: int) -> list[RssFeedModel] | None:
    async with AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            return None

        rss_feed = parse_feed(
            response.text,
        )

        final_entries = rss_feed.entries

        if len(final_entries) > limit:
            final_entries = final_entries[:limit]

        result_entries = [RssFeedModel.from_entry(entry) for entry in final_entries]

        return result_entries


async def fetch_rss_feeds(
    urls: list[str], limit: int = 10
) -> list[RssFeedEntriesModel]:
    rss_feeds: list[RssFeedEntriesModel] = []
    for url in urls:
        rss_feed = await fetch_rss_feed(url, limit)

        if rss_feed is not None:
            rss_feeds.append(RssFeedEntriesModel(entries=rss_feed))

    return rss_feeds
