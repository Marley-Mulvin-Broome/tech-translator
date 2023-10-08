from tests.utility import get_rss_request

from app.models.rss import RssFetchRequest

FEED_PARSER_EXAMPLE_20 = (
    "https://feedparser.readthedocs.io/en/latest/examples/rss20.xml"
)


def test_get_rss_limit_0(test_client, user_uid):
    response = get_rss_request(
        test_client,
        user_uid,
        RssFetchRequest(
            urls=[FEED_PARSER_EXAMPLE_20],
            limit=0,
        ),
    )

    assert response.status_code == 400


def test_get_rss_limit_negative(test_client, user_uid):
    response = get_rss_request(
        test_client,
        user_uid,
        RssFetchRequest(
            urls=[FEED_PARSER_EXAMPLE_20],
            limit=-1,
        ),
    )

    assert response.status_code == 400


def test_get_rss(test_client, user_uid):
    response = get_rss_request(
        test_client,
        user_uid,
        RssFetchRequest(
            urls=[FEED_PARSER_EXAMPLE_20],
            limit=10,
        ),
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert len(response.json()[0]["entries"]) == 1
