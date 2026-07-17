#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

PROJECT_ROOT="/mnt/GG/model-1/TPT/apps"
DB_DIR="$PROJECT_ROOT/.local/postgres"
REAL_DB_DIR="/home/lintang/.maritime_planner_postgres"
DB_NAME="maritime_planner"
PORT=5432
HOST="127.0.0.1"

case "$1" in
  init)
    echo "Initializing PostgreSQL database cluster..."
    mkdir -p "$REAL_DB_DIR"
    
    if [ -L "$DB_DIR" ]; then
      echo "Symlink $DB_DIR already exists."
    elif [ -d "$DB_DIR" ]; then
      echo "Directory $DB_DIR already exists. Checking if it is empty..."
      if [ "$(ls -A "$DB_DIR")" ]; then
        echo "Error: $DB_DIR is not empty. Please clean up first."
        exit 1
      fi
      rm -rf "$DB_DIR"
      ln -s "$REAL_DB_DIR" "$DB_DIR"
    else
      echo "Creating symlink $DB_DIR -> $REAL_DB_DIR"
      mkdir -p "$(dirname "$DB_DIR")"
      ln -s "$REAL_DB_DIR" "$DB_DIR"
    fi
    
    # Initialize the cluster if not already initialized
    if [ ! -f "$REAL_DB_DIR/PG_VERSION" ]; then
      initdb -D "$DB_DIR" --auth-local=trust --auth-host=trust
    else
      echo "Database cluster already initialized."
    fi
    
    # Start temporary server to create database
    echo "Starting temporary PostgreSQL server to create database..."
    pg_ctl -D "$DB_DIR" -l "$DB_DIR/server.log" -o "-h $HOST -p $PORT -k $DB_DIR" start
    sleep 2
    
    echo "Creating database: $DB_NAME..."
    createdb -h $HOST -p $PORT $DB_NAME || echo "Database might already exist"
    
    echo "Creating user/role: postgres..."
    createuser -s -h $HOST -p $PORT postgres || echo "Role postgres might already exist"
    
    echo "Stopping temporary PostgreSQL server..."
    pg_ctl -D "$DB_DIR" stop
    echo "PostgreSQL database initialized successfully."
    ;;
    
  start)
    echo "Starting PostgreSQL server..."
    if [ ! -d "$DB_DIR" ]; then
      echo "Error: Database directory $DB_DIR does not exist. Run '$0 init' first."
      exit 1
    fi
    pg_ctl -D "$DB_DIR" -l "$DB_DIR/server.log" -o "-h $HOST -p $PORT -k $DB_DIR" start
    echo "PostgreSQL started successfully on $HOST:$PORT."
    ;;
    
  stop)
    echo "Stopping PostgreSQL server..."
    pg_ctl -D "$DB_DIR" stop
    echo "PostgreSQL stopped."
    ;;
    
  status)
    pg_ctl -D "$DB_DIR" status || true
    ;;

  *)
    echo "Usage: $0 {init|start|stop|status}"
    exit 1
    ;;
esac
