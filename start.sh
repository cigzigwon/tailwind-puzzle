#!/bin/bash

docker run -it --rm --name yarn -v $(pwd):/usr/src/apps -p 3000:3000 -e NODE_ENV=development cigzigwon/yarn:gallium-alpine yarn dev
