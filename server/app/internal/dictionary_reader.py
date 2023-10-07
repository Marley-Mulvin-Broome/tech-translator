from os.path import exists as path_exists
from json import load as json_load


def read_dictionary(file_path):
    if not path_exists(file_path):
        raise FileNotFoundError("ファイルが存在しません")

    with open(file_path, "r", encoding="utf-8") as f:
        dict_data = json_load(f)

        return parse_dictionary(dict_data)


def parse_dictionary(dictionary):
    for key, value in dictionary.items():
        dictionary[key] = value.split("/")

    return dictionary
