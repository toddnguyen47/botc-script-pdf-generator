"""
usage:
uv run find_missing.py \
    --base base3_with_travelers.json \
    --roles ../packages/botc-character-sheet/src/data/roles.json \
    --output botc-scripts/replacements.json \
    --script "botc-scripts/No Roles Barred_1_0_1.json"
"""

import argparse
import json
import re
from difflib import SequenceMatcher


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
    return len(role.get("reminders", [])) + len(role.get("remindersGlobal", []))


def get_first_three_words(description):
    """Normalize a description and return its first three words."""
    words = re.findall(r"\b[\w']+\b", description.casefold())
    return " ".join(words[:3])


def get_match_percentage(description_a, description_b):
    """Compare the first three words of two descriptions."""
    words_a = get_first_three_words(description_a)
    words_b = get_first_three_words(description_b)

    if not words_a or not words_b:
        return 0

    return round(SequenceMatcher(None, words_a, words_b).ratio() * 100)


def can_replace_role(missing_role, available_role):
    """Check whether a candidate meets the existing reminder rules."""
    missing_team = missing_role["team"]
    missing_reminders = missing_role["numberOfReminders"]
    available_reminders = available_role["numberOfReminders"]

    if missing_team == "demon":
        return available_reminders >= missing_reminders

    if missing_reminders <= 1:
        return available_reminders == missing_reminders

    return available_reminders >= missing_reminders


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Generate replacements, available roles, and possible "
            "replacements ranked by fuzzy description matching."
        )
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
    # roles.json is the source of truth for names, teams,
    # descriptions, and reminder counts.
    role_info = {
        role["id"]: {
            "name": role["name"],
            "team": role["team"],
            "description": role.get("ability", ""),
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

    # Get eligible role IDs from the script.
    script_roles = {
        role_id
        for role_id in script
        if (
            isinstance(role_id, str)
            and role_id in role_info
            and role_info[role_id]["team"] in ALLOWED_TEAMS_TO_REPLACE_SET
        )
    }

    # Find roles in the script that are missing from the base.
    # Preserve roles.json ordering.
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
    # Keep descriptions internally for fuzzy matching.
    available = {team: [] for team in ALLOWED_TEAMS_REPLACEMENTS_SET}

    for role in roles:
        if not isinstance(role, dict):
            continue

        role_id = role.get("id")
        team = role.get("team")

        if role_id in base and role_id in role_info and role_id not in script_roles:
            available[team].append(
                {
                    "name": role_info[role_id]["name"],
                    "description": role_info[role_id]["description"],
                    "numberOfReminders": role_info[role_id]["numberOfReminders"],
                }
            )

    # Build possible replacements, ranked by fuzzy match percentage.
    # Match percentages are used internally and omitted from the output.
    can_replace = {}

    for role_id in missing_roles:
        missing_role = role_info[role_id]
        missing_name = missing_role["name"]

        suggestions = []

        missing_team = missing_role["team"]

        # Matching team group first, Travelers last.
        preferred_teams = TEAM_GROUPS[missing_team]
        regular_teams = tuple(team for team in preferred_teams if team != "traveller")

        for preferred_team in regular_teams:
            for available_role in available[preferred_team]:
                if not can_replace_role(missing_role, available_role):
                    continue

                suggestions.append(
                    {
                        "name": available_role["name"],
                        "matchPercentage": get_match_percentage(
                            missing_role["description"],
                            available_role["description"],
                        ),
                        "isTraveller": False,
                    }
                )

        # Sort regular team candidates by fuzzy match.
        suggestions.sort(
            key=lambda suggestion: suggestion["matchPercentage"],
            reverse=True,
        )

        # Add Travelers afterward, also sorted by fuzzy match.
        traveller_suggestions = []

        for available_role in available["traveller"]:
            if not can_replace_role(missing_role, available_role):
                continue

            traveller_suggestions.append(
                {
                    "name": available_role["name"],
                    "matchPercentage": get_match_percentage(
                        missing_role["description"],
                        available_role["description"],
                    ),
                    "isTraveller": True,
                }
            )

        traveller_suggestions.sort(
            key=lambda suggestion: suggestion["matchPercentage"],
            reverse=True,
        )

        suggestions.extend(traveller_suggestions)

        can_replace[missing_name] = {
            "numberOfReminders": missing_role["numberOfReminders"],
            "available": [suggestion["name"] for suggestion in suggestions],
        }

    # Build automatic replacements.
    # Each available role can only be recommended once.
    replacements = {}
    used_available = set()

    for role_id in missing_roles:
        missing_name = role_info[role_id]["name"]
        suggestions = can_replace[missing_name]["available"]

        replacement = next(
            (
                suggestion
                for suggestion in suggestions
                if suggestion not in used_available
            ),
            None,
        )

        if replacement is None:
            replacements[missing_name] = "NEED A REPLACEMENT"
        else:
            replacements[missing_name] = replacement
            used_available.add(replacement)

    # Keep the output's available section concise.
    available_output = {
        team: [
            {
                "name": role["name"],
                "numberOfReminders": role["numberOfReminders"],
            }
            for role in team_roles
        ]
        for team, team_roles in available.items()
    }

    output = {
        "replacements": replacements,
        "possibleReplacements": can_replace,
        "available": available_output,
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)
        f.write("\n")

    print(f"Found {len(missing_roles)} missing roles.")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
