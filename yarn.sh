#!/bin/bash

docker run -it --rm --name yarn -v $(pwd):/usr/src/apps cigzigwon/yarn:fermium-alpine yarn "$@"
