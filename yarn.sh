#!/bin/bash

docker run -it --rm --name yarn -v $(pwd):/usr/src/apps -e NODE_ENV=${NODE_ENV} cigzigwon/yarn:fermium-alpine yarn "$@"
