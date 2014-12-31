#!/bin/bash
node enyo/tools/deploy.js -o deploy/org.webosports.app.testr
read -p "Paused  Press [Enter] key to restart and End..."
adb push deploy/org.webosports.app.testr /usr/palm/applications/org.webosports.app.testr
read -p "Paused  Press [Enter] key to restart and End..."

adb shell luna-send -n 1 luna://com.palm.applicationManager/rescan {}
read -p "Paused  Press [Enter] key to restart and End..."
 adb shell systemctl restart luna-next
