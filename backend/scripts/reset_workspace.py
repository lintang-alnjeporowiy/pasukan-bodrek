#!/usr/bin/env python3
import sys
import os

# Ensure backend folder is in PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import text
from src.infrastructure.database.session import SessionLocal

PLANNING_TABLES = [
    "scenario_vessel_candidates",
    "cargo_flows",
    "cargo_conversion_rules",
    "routes",
    "bathymetry_points",
    "bathymetry_profiles",
    "study_ports",
    "external_ports",
    "scenario_parameter_overrides",
    "project_parameters",
    "scenarios",
    "tenants",
    "projects"
]

def reset_workspace(force: bool = False):
    print("========================================")
    print("Developer Workspace Reset")
    print("========================================")
    print("This will remove ALL projects, scenarios and calculation results.")
    print("Master data will NOT be deleted.")
    print("Continue?")
    print()

    if not force:
        confirmation = input("Type: RESET\n> ").strip()
        if confirmation != "RESET":
            print("\nReset Aborted.")
            sys.exit(0)

    db = SessionLocal()
    try:
        table_list = ", ".join(PLANNING_TABLES)
        print(f"\nCleaning user-created planning data tables...")
        db.execute(text(f"TRUNCATE TABLE {table_list} RESTART IDENTITY CASCADE;"))
        db.commit()
        
        print("\nWorkspace Reset Complete")
        print("\nDeleted")
        print("- Projects")
        print("- Scenarios")
        print("- Cargo Flows")
        print("- Routes")
        print("- Results")
        print("- Cache")
        print("\nPreserved")
        print("- Ship Master")
        print("- Equipment Master")
        print("- Cargo Types")
        print("- Ship Types")
        print("- Units")
        print("- Development Modes")
        print("- Reference Data")
        print("\nThe frontend should now behave like a fresh installation with an empty workspace.")

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Reset failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    force_flag = "--force" in sys.argv or "-y" in sys.argv
    reset_workspace(force=force_flag)
