#!/bin/bash
# SulitCart PH - double-click starter for Mac
# If double-click refuses to run it: right-click -> Open, or run: bash start-demo.command
cd "$(dirname "$0")"
echo "Starting SulitCart PH... browser opens in a few seconds."
echo "KEEP THIS WINDOW OPEN while presenting. Closing it stops the site."
(sleep 3 && open http://localhost:5173) &
npm run dev
