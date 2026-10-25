"""
Usage

uv run find_number_of_reminders.py \
    --path-to-role sample_input.txt \
    --path-role-json ../../packages/botc-character-sheet/src/data/roles.json \
    --output sample_output.txt
"""

import argparse
import json


def generate_argparse() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Generate number of reminders given a list of newline separated roles"
        )
    )
    parser.add_argument(
        "--path-to-role",
        required=True,
        help="Path to newline separated role file",
    )
    parser.add_argument(
        "--path-role-json",
        required=True,
        help="Path role.json file",
    )
    parser.add_argument("--output-file", required=False, help="path to output file")
    return parser


def generate_role_by_name_dict(path_to_role_json: str) -> dict:
    with open(path_to_role_json, "r") as file:
        data = json.load(file)
    result = {}
    for line in data:
        result[line["name"]] = line
    return result


def generate_reminder(role_by_name_dict: dict, input_file: str, output_file: str):
    result = []
    with open(input_file, "r") as file:
        lines = file.read().split("\n")
        for line in lines:
            if line:
                role = role_by_name_dict[line]
                if role:
                    reminder_list: list = role.get("reminders")
                    if "remindersGlobal" in role:
                        reminder_list.extend(role.get("remindersGlobal"))
                    new_line = f"{line}: {len(reminder_list)}, {reminder_list}"
                    result.append(new_line)
    if output_file:
        with open(output_file, "w") as outfile:
            for res in result:
                outfile.write(res + "\n")
    else:
        print(result)


if __name__ == "__main__":
    parser = generate_argparse()
    args = parser.parse_args()

    role_by_name = generate_role_by_name_dict(args.path_role_json)
    generate_reminder(role_by_name, args.path_to_role, args.output_file)
