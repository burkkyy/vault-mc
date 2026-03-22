#!/bin/sh

# Run initializers in environment then start the application
if [ "$NODE_ENV" != "production" ]; then
  npm run initializers
	npm run start 
else
  node ./dist/initializers/index.js
	node ./dist/server.js
fi
