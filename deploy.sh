#!/bin/bash

# For deploying on UQCloud
# Run as `sudo ./deploy.sh`

# install packages
npm install && (cd client && npm install) && (cd seed && npm install)

# build
npm run build-server && (cd client && npm run build)

# deploy
systemctl restart nodejs
