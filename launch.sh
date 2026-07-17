#!/usr/bin/env bash

# Exit on script error
set -e

# Port definition
DB_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Color definition
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0;0m'

# Utility function to check port status
is_port_in_use() {
  local port=$1
  (echo > /dev/tcp/127.0.0.1/$port) >/dev/null 2>&1
  return $?
}

# Prefix logs helper
prefix_logs() {
  local prefix=$1
  local color=$2
  while read -r line; do
    echo -e "${color}[${prefix}]${NC} $line"
  done
}

echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN} Maritime Planning Launcher               ${NC}"
echo -e "${CYAN}==========================================${NC}"

# 1. Port Checking
echo "Checking ports..."
if is_port_in_use $DB_PORT; then
  if ./scripts/db_control.sh status >/dev/null 2>&1; then
    echo -e "${YELLOW}[database] Port $DB_PORT is already in use, but local db_control.sh reports it is running. Reusing database.${NC}"
  else
    echo -e "${RED}[error] Port $DB_PORT (Database) is already in use by another process.${NC}"
    exit 1
  fi
fi

if is_port_in_use $BACKEND_PORT; then
  echo -e "${RED}[error] Port $BACKEND_PORT (Backend) is already in use. Please free this port.${NC}"
  exit 1
fi

if is_port_in_use $FRONTEND_PORT; then
  echo -e "${RED}[error] Port $FRONTEND_PORT (Frontend) is already in use. Please free this port.${NC}"
  exit 1
fi

# Variables to store child PIDs
BACKEND_PID=""
FRONTEND_PID=""
DB_STARTED_BY_US=false

# Cleanup handler on Ctrl+C
cleanup() {
  echo -e "\n${YELLOW}Stopping all services...${NC}"
  
  if [ -n "$FRONTEND_PID" ]; then
    echo "Stopping Frontend (PID $FRONTEND_PID)..."
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [ -n "$BACKEND_PID" ]; then
    echo "Stopping Backend (PID $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [ "$DB_STARTED_BY_US" = true ]; then
    echo "Stopping Database..."
    ./scripts/db_control.sh stop || true
  fi

  echo -e "${GREEN}All services stopped cleanly.${NC}"
  exit 0
}

# Setup traps for SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# 2. Start Database
if ! is_port_in_use $DB_PORT; then
  echo "Starting PostgreSQL..."
  ./scripts/db_control.sh start | prefix_logs "database" "$YELLOW"
  DB_STARTED_BY_US=true
fi

# 3. Start Backend
echo "Starting Backend API (FastAPI)..."
cd backend
.venv/bin/uvicorn src.main:app --port $BACKEND_PORT --host 127.0.0.1 2>&1 | prefix_logs "backend" "$GREEN" &
BACKEND_PID=$!
cd ..

# 4. Wait for Backend Health Check
echo "Waiting for Backend to become ready..."
BACKEND_READY=false
for i in {1..30}; do
  if curl -s http://127.0.0.1:$BACKEND_PORT/health | grep -q '"status":"ok"'; then
    BACKEND_READY=true
    break
  fi
  sleep 0.5
done

if [ "$BACKEND_READY" = false ]; then
  echo -e "${RED}[error] Backend failed to start or respond to health check in time.${NC}"
  cleanup
fi

# 5. Start Frontend
echo "Starting Frontend (Next.js)..."
cd frontend
npm run dev -- --port $FRONTEND_PORT 2>&1 | prefix_logs "frontend" "$CYAN" &
FRONTEND_PID=$!
cd ..

# 6. Pretty Console Dashboard
sleep 1.5 # Wait for Next.js to start listing
clear
echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN} Maritime Planning Development Environment${NC}"
echo -e "${CYAN}==========================================${NC}"
echo ""
echo -e "Database : ${GREEN}Running${NC}"
echo -e "Backend  : ${GREEN}Running${NC} (PID: $BACKEND_PID)"
echo -e "Frontend : ${GREEN}Running${NC} (PID: $FRONTEND_PID)"
echo ""
echo -e "Backend URL  : ${GREEN}http://localhost:$BACKEND_PORT${NC}"
echo -e "Frontend URL : ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop all services.${NC}"
echo -e "${CYAN}==========================================${NC}"
echo ""

# Keep script running and wait for background jobs
wait
