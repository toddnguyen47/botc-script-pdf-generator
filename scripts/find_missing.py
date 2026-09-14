```python
import argparse
import json


ALLOWED_TEAMS = ("townsfolk", "outsider", "minion", "demon")
ALLOWED_TEAM_SET = set(ALLOWED_TEAMS)


def main():
    parser = argparse.ArgumentParser(
        description="Generate replacements and available roles."
    )

    parser.add_argument(
        "--script",
        required=True,
        help="Path to the script JSON file",
    )
    parser.add_argument(
        "--base",
        required=True,
        help="Path to the base JSON file",
    )
    parser.add_argument(
        "--roles",
        required=True,
        help="Path to the roles JSON file",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Path to the output JSON file",
    )

    args = parser.parse_args()

    # Read base
    with open(args.base, "r", encoding="utf-8") as f:
        base = json.load(f)

    # Read script
    with open(args.script, "r", encoding="utf-8") as f:
        script = json.load(f)

    # Read roles
    with open(args.roles, "r", encoding="utf-8") as f:
        roles = json.load(f)

    # Build role lookup.
    # roles.json is the source of truth for role metadata and ordering.
    # Only allowed teams are included.
    role_info = {
        role["id"]: {
            "name": role["name"],
            "team": role["team"],
        }
        for role in roles
        if (
            isinstance(role, dict)
            and "id" in role
            and "name" in role
            and role.get("team") in ALLOWED_TEAM_SET
        )
    }

    # Build reminder-count lookup.
    # Only allowed-team roles are included.
    reminder_counts = {
        role["id"]: len(role.get("reminders", []))
        for role in roles
        if (
            isinstance(role
```
