import argparse
import json


ALLOWED_TEAMS = ("townsfolk", "outsider", "minion", "demon")
ALLOWED_TEAM_SET = set(ALLOWED_TEAMS)

TEAM_GROUPS = {
    "townsfolk": ("townsfolk", "outsider"),
    "outsider": ("outsider", "townsfolk"),
    "minion": ("minion", "demon"),
    "demon": ("demon", "minion"),
}


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

    # --------------------------------------------------------------
    # Read files
    # --------------------------------------------------------------

    with open(args.base, "r", encoding="utf-8") as f:
        base = json.load(f)

    with open(args.script, "r", encoding="utf-8") as f:
        script = json.load(f)

    with open(args.roles, "r", encoding="utf-8") as f:
        roles = json.load(f)

    # --------------------------------------------------------------
    # Build role lookup.
    #
    # roles.json is the source of truth for:
    #   - name
    #   - team
    #   - reminder count
    # --------------------------------------------------------------

    role_info = {
        role["id"]: {
            "name": role["name"],
            "team": role["team"],
            "numberOfReminders": len(role.get("reminders", [])),
        }
        for role in roles
        if (
            isinstance(role, dict)
            and "id" in role
            and "name" in role
            and role.get("team") in ALLOWED_TEAM_SET
        )
    }

    # --------------------------------------------------------------
    # Get allowed role IDs from the script.
    # --------------------------------------------------------------

    script_roles = {
        role
        for role in script
        if isinstance(role, str) and role in role_info
    }

    # --------------------------------------------------------------
    # Find roles that:
    #
    #   1. Are in the script
    #   2. Are an allowed team
    #   3. Are NOT in base
    #
    # Keep roles.json ordering.
    # --------------------------------------------------------------

    missing_roles = [
        role["id"]
        for role in roles
        if (
            isinstance(role, dict)
            and role["id"] in script_roles
            and role["id"] not in base
            and role.get("team") in ALLOWED_TEAM_SET
        )
    ]

    # --------------------------------------------------------------
    # Build available roles.
    #
    # These remain available for manual intervention.
    # --------------------------------------------------------------

    available = {
        team: []
        for team in ALLOWED_TEAMS
    }

    # Blank is a special Townsfolk/Outsider role.
    #
    # It has 3 reminder tokens and can replace any
    # Townsfolk/Outsider role with 0-3 reminders.
    available["townsfolk"].append({
        "name": "Blank",
        "numberOfReminders": 3,
    })

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
            available[team].append({
                "name": role["name"],
                "numberOfReminders": len(role.get("reminders", [])),
            })

    # --------------------------------------------------------------
    # Build possibleReplacements.
    #
    # Structure:
    #
    # "Noble": {
    #     "numberOfReminders": 2,
    #     "available": [
    #         "Innkeeper",
    #         "Lunatic",
    #         "Blank"
    #     ]
    # }
    #
    # possibleReplacements contains ALL possible available roles.
    # --------------------------------------------------------------

    can_replace = {}

    for role_id in missing_roles:
        missing_role = role_info[role_id]

        missing_team = missing_role["team"]
        missing_reminders = missing_role["numberOfReminders"]

        suggestions = []

        # Normal available roles, ordered by team preference.
        for preferred_team in TEAM_GROUPS[missing_team]:
            for available_role in available[preferred_team]:
                if available_role["name"] == "Blank":
                    continue

                if (
                    available_role["numberOfReminders"]
                    == missing_reminders
                ):
                    suggestions.append(available_role["name"])

        # Blank is a last resort.
        #
        # It does NOT need the same number of reminders.
        if (
            missing_team in {"townsfolk", "outsider"}
            and missing_reminders <= 3
        ):
            suggestions.append("Blank")

        # Remove duplicates while preserving order.
        suggestions = list(dict.fromkeys(suggestions))

        if not suggestions:
            suggestions = ["NEED A REPLACEMENT"]

        can_replace[missing_role["name"]] = {
            "numberOfReminders": missing_reminders,
            "available": suggestions,
        }

    # --------------------------------------------------------------
    # Build automatic replacements.
    #
    # Choose ONE available role for each missing role.
    #
    # An available role can only be used once.
    # --------------------------------------------------------------

    replacements = {}
    used_available = set()

    for role_id in missing_roles:
        missing_role = role_info[role_id]
        missing_name = missing_role["name"]

        suggestions = can_replace[missing_name]["available"]

        replacement = None

        # Go through suggestions in their priority order.
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

    # --------------------------------------------------------------
    # Write output.
    #
    # Order:
    #   1. replacements
    #   2. possibleReplacements
    #   3. available
    # --------------------------------------------------------------

    output = {
        "replacements": replacements,
        "possibleReplacements": can_replace,
        "available": available,
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Found {len(missing_roles)} missing roles.")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
