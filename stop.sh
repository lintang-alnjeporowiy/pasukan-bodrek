#!/usr/bin/env bash

# Color definition
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0;0m'

echo -e "${YELLOW}Stopping all Maritime Planning dev services...${NC}"

# Stop PostgreSQL
if [ -f "./scripts/db_control.sh" ]; then
  ./scripts/db_control.sh stop || true
fi

# Find and kill backend running on port 8000
BACKEND_PIDS=$(lsof -t -i :8000 2>/dev/null || true)
if [ -n "$BACKEND_PIDS" ]; then
  echo "Killing processes on port 8000: $BACKEND_PIDS"
  kill -9 $BACKEND_PIDS 2>/dev/null || true
fi

# Find and kill frontend running on port 3000
FRONTEND_PIDS=$(lsof -t -i :3000 2>/dev/null || true)
if [ -n "$FRONTEND_PIDS" ]; then
  echo "Killing processes on port 3000: $FRONTEND_PIDS"
  kill -9 $FRONTEND_PIDS 2>/dev/null || true
fi

echo -e "${GREEN}All cleanup operations complete.${NC}"
