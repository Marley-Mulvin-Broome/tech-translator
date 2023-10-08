from uuid import uuid4
from time import time
from re import sub as regex_sub


def generate_random_file_name(extension: str = "") -> str:
    if extension == "":
        return str(uuid4())
    return str(f"{uuid4()}.{extension}")


def get_current_timestamp() -> int:
    return int(time())


def strip_html_tags(text):
    return regex_sub("<[^<]+?>", "", text)
