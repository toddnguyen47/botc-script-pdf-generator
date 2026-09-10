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

    # Get allowed role IDs from the script.
    # Roles belonging to other teams are ignored completely.
    script_roles = {
        role
        for role in script
        if isinstance(role, str) and role in role_info
    }

    # Find allowed roles that are in the script but not in base3.
    # Iterate through roles.json so output follows its ordering.
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

    # Build replacements in roles.json order.
    replacements = {
        role_info[role]["name"]: ""
        for role in missing_roles
    }

    # Build available roles.
    # These must:
    #   1. Be in base3
    #   2. Be an allowed team
    #   3. Not already be in the script
    #   4. Follow roles.json ordering
    available = {
        team: []
        for team in ALLOWED_TEAMS
    }

    # Hard-coded blank replacement.
    available["townsfolk"].append("Blank")

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
            available[team].append(role["name"])

    output = {
        "replacements": replacements,
        "available": available,
    }

    # Write output.
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Found {len(missing_roles)} missing roles.")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()


# ============================================================

# The below does not include available roles to be used as replacements

# import argparse
# import json


# ALLOWED_TEAMS = {"townsfolk", "outsider", "minion", "demon"}


# def main():
#     parser = argparse.ArgumentParser(
#         description="Generate a replacements.json file for roles missing from the base file."
#     )

#     parser.add_argument(
#         "--script",
#         required=True,
#         help="Path to the script JSON file",
#     )
#     parser.add_argument(
#         "--base",
#         required=True,
#         help="Path to the base JSON file",
#     )
#     parser.add_argument(
#         "--roles",
#         required=True,
#         help="Path to the roles JSON file",
#     )
#     parser.add_argument(
#         "--output",
#         required=True,
#         help="Path to the output replacements JSON file",
#     )

#     args = parser.parse_args()

#     # Read base
#     with open(args.base, "r", encoding="utf-8") as f:
#         base = json.load(f)

#     # Read script
#     with open(args.script, "r", encoding="utf-8") as f:
#         script = json.load(f)

#     # Read roles
#     with open(args.roles, "r", encoding="utf-8") as f:
#         roles = json.load(f)

#     # Build ID -> character name lookup.
#     # Only roles belonging to an allowed team are included.
#     role_names = {
#         role["id"]: role["name"]
#         for role in roles
#         if (
#             isinstance(role, dict)
#             and "id" in role
#             and "name" in role
#             and role.get("team") in ALLOWED_TEAMS
#         )
#     }

#     # Get role IDs from the script, ignoring _meta and
#     # any roles whose team is not in ALLOWED_TEAMS.
#     script_roles = [
#         role
#         for role in script
#         if isinstance(role, str) and role in role_names
#     ]

#     # Find roles that aren't in the base file.
#     missing_roles = [
#         role
#         for role in script_roles
#         if role not in base
#     ]

#     # Use character names as replacement keys.
#     output = {
#         "replacements": {
#             role_names[role]: ""
#             for role in missing_roles
#         }
#     }

#     with open(args.output, "w", encoding="utf-8") as f:
#         json.dump(output, f, indent=2, ensure_ascii=False)
#         f.write("\n")

#     print(f"Found {len(missing_roles)} missing roles.")
#     print(f"Wrote {args.output}")


# if __name__ == "__main__":
#     main()
