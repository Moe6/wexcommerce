#!/bin/sh
# Railway start script for frontend
PORT=${PORT:-8006}
exec next start -H 0.0.0.0 -p $PORT

