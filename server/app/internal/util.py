from uuid import uuid4


def generate_random_file_name(extension: str = "") -> str:
    if extension == "":
        return str(uuid4())
    return str(f"{uuid4()}.{extension}")
