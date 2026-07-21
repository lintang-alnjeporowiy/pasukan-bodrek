#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

nix develop "${ROOT_DIR}" --command bash -c "cd '${ROOT_DIR}/backend' && PYTHONPATH=. .venv/bin/python scripts/reset_workspace.py $@"
