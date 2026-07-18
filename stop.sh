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

# Helper function to find and kill processes on a port, and their parent shells
kill_port_processes() {
  local port=$1
  local pids=""
  
  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -t -i :$port 2>/dev/null || true)
  fi
  
  if [ -z "$pids" ] && command -v ss >/dev/null 2>&1; then
    pids=$(ss -tlnp "sport = :$port" 2>/dev/null | grep -o -E "pid=[0-9]+" | cut -d= -f2 | sort -u || true)
  fi
  
  if [ -n "$pids" ]; then
    echo "Found processes on port $port: $pids"
    for pid in $pids; do
      # Fetch parent PID before killing
      local ppid=$(ps -o ppid= -p $pid 2>/dev/null | tr -d ' ')
      
      # Kill process
      kill -9 $pid 2>/dev/null || true
      
      # Kill parent wrapper if it's uvicorn, python, node, npm, next, or nix
      if [ -n "$ppid" ] && [ "$ppid" -ne 1 ]; then
        local p_comm=$(ps -o comm= -p $ppid 2>/dev/null || true)
        local p_args=$(ps -o args= -p $ppid 2>/dev/null || true)
        if echo "$p_comm $p_args" | grep -q -E "uvicorn|python|node|npm|next|nix"; then
          echo "Killing wrapper parent process $ppid ($p_comm)"
          kill -9 $ppid 2>/dev/null || true
        fi
      fi
    done
  fi
}

# 1. Kill backend on port 8000
kill_port_processes 8000

# 2. Kill frontend on port 3000
kill_port_processes 3000

# 3. Clean up any remaining matching processes
echo "Cleaning up remaining uvicorn/Next.js background processes..."
UVICORN_REMAINING=$(pgrep -f "uvicorn" || true)
if [ -n "$UVICORN_REMAINING" ]; then
  kill -9 $UVICORN_REMAINING 2>/dev/null || true
fi

NEXT_REMAINING=$(pgrep -f "next-server\|next-dev\|next dev" || true)
if [ -n "$NEXT_REMAINING" ]; then
  kill -9 $NEXT_REMAINING 2>/dev/null || true
fi

echo -e "${GREEN}All cleanup operations complete.${NC}"
