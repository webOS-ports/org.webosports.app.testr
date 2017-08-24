#!/bin/bash

# the folder this script is in (*/bootplate/tools)
TOOLS=$(cd `dirname $0` && pwd)

# application root
SRC="$TOOLS/.."
DEST="$SRC/deploy"

# enyo location
ENYO="$TOOLS/../enyo"

# deploy script location
DEPLOY="$ENYO/tools/deploy.js"

# check for node, but quietly
if command -v node >/dev/null 2>&1; then
	# use node to invoke deploy with imported parameters
    echo "node $DEPLOY -T -s $SRC -o $DEST $@"
    node "$DEPLOY" -T -s "$SRC" -o "$DEST" $@
else
	echo "No node found in path"
	exit 1
fi

# copy files and package as an IPK, or install on a connected LuneOS device
while [ "$1" != "" ]; do
    case $1 in
        -w | --webos )
            # package it up
            palm-package "$DEST"  && palm-install org.webosports.app.testr_*_all.ipk && palm-launch org.webosports.app.testr
            ;;
        -i | --install )
            # install
            adb push "$DEST" /usr/palm/applications/org.webosports.app.testr
            # adb shell systemctl restart luna-next
            
            # enable inspection of web views
            adb forward tcp:1122 tcp:1122
            ;;
    esac
    shift
done
