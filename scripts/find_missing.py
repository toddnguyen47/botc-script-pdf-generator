"""
usage:
uv run find_missing.py \
    --base base3_with_travelers.json \
    --roles ../packages/botc-character-sheet/src/data/roles.json \
    --output botc-scripts/replacements.json \
    --script botc-scripts/No\ Roles\ Barred_1_0_1.json
"""

import argparse
import json


ALLOWED_TEAMS_TO_REPLACE_SET = {
    "townsfolk",
    "outsider",
    "minion",
    "demon",
}

ALLOWED_TEAMS_REPLACEMENTS_SET = {
    "townsfolk",
    "outsider",
    "minion",
    "demon",
    "traveller",
}

TEAM_GROUPS = {
    "townsfolk": ("townsfolk", "outsider", "traveller"),
    "outsider": ("outsider", "townsfolk", "traveller"),
    "minion": ("minion", "demon", "traveller"),
    "demon": ("demon", "minion", "traveller"),
}


def get_number_of_reminders(role):
    return len(role.get("reminders", [])) + len(
        role.get("remindersGlobal", [])
    )


def main():
    parser = argparse.ArgumentParser(
        description="Generate replacements, available roles, and possible replacements."
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

    # Read files.
    with open(args.base, "r", encoding="utf-8") as f:
        base = json.load(f)

    with open(args.script, "r", encoding="utf-8") as f:
        script = json.load(f)

    with open(args.roles, "r", encoding="utf-8") as f:
        roles = json.load(f)

    # Build role lookup.
    # roles.json is the source of truth for name, team, and reminder count.
    role_info = {
        role["id"]: {
            "name": role["name"],
            "team": role["team"],
            "numberOfReminders": get_number_of_reminders(role),
        }
        for role in roles
        if (
            isinstance(role, dict)
            and "id" in role
            and "name" in role
            and role.get("team") in ALLOWED_TEAMS_REPLACEMENTS_SET
        )
    }

    # Get allowed role IDs from the script.
    script_roles = {
        role
        for role in script
        if (
            isinstance(role, str)
            and role in role_info
            and role_info[role]["team"] in ALLOWED_TEAMS_TO_REPLACE_SET
        )
    }

    # Find roles that are in the script, belong to an allowed team,
    # and are not in the base. Preserve roles.json ordering.
    missing_roles = [
        role["id"]
        for role in roles
        if (
            isinstance(role, dict)
            and role.get("id") in script_roles
            and role["id"] not in base
            and role.get("team") in ALLOWED_TEAMS_TO_REPLACE_SET
        )
    ]

    # Build available roles for manual intervention.
    available = {
        team: [] for team in ALLOWED_TEAMS_REPLACEMENTS_SET
    }

    for role in roles:
        if not isinstance(role, dict):
            continue

        role_id = role.get("id")
        team = role.get("team")

        if (
            role_id in base
            and role_id in role_info
            and role_id not in script_roles
        ):
            available[team].append(
                {
                    "name": role["name"],
                    "numberOfReminders": get_number_of_reminders(role),
                }
            )

    # Build possible replacements.
    can_replace = {}

    for role_id in missing_roles:
        missing_role = role_info[role_id]
        missing_team = missing_role["team"]
        missing_reminders = missing_role["numberOfReminders"]

        suggestions = []

        # Normal available roles, ordered by team preference.
        for preferred_team in TEAM_GROUPS[missing_team]:
            for available_role in available[preferred_team]:
                available_reminders = available_role["numberOfReminders"]

                if missing_team == "demon":
                    reminders_match = available_reminders >= missing_reminders
                else:
                    reminders_match = (
                        missing_reminders <= 1
                        and available_reminders == missing_reminders
                    ) or (
                        missing_reminders > 1
                        and available_reminders >= missing_reminders
                    )

                if reminders_match:
                    suggestions.append(available_role["name"])

        # Remove duplicates while preserving order.
        suggestions = list(dict.fromkeys(suggestions))

        if not suggestions:
            suggestions = ["NEED A REPLACEMENT"]

        can_replace[missing_role["name"]] = {
            "numberOfReminders": missing_reminders,
            "available": suggestions,
        }

    # Build automatic replacements.
    # Each available role can only be used once.
    replacements = {}
    used_available = set()

    for role_id in missing_roles:
        missing_role = role_info[role_id]
        missing_name = missing_role["name"]
        suggestions = can_replace[missing_name]["available"]

        replacement = None

        # Choose the first unused suggestion in priority order.
        for suggestion in suggestions:
            if suggestion == "NEED A REPLACEMENT":
                continue

            if suggestion not in used_available:
                replacement = suggestion
                break

        if replacement is None:
            replacements[missing_name] = "NEED A REPLACEMENT"
        else:
            replacements[missing_name] = replacement
            used_available.add(replacement)

    # Write output in the desired order.
    output = {
        "replacements": replacements,
        "possibleReplacements": can_replace,
        "available": available,
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)
        f.write("\n")

    print(f"Found {len(missing_roles)} missing roles.")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
