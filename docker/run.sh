#!/usr/bin/env bash
export CUR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

NAME="mottor-ui"
TAG="nginx"

docker rm -f $NAME

docker run -d \
    -p 50111:80 \
    --name $NAME \
    --net=lpm-network \
    --net-alias $NAME \
    -v "$CUR_DIR/../build/:/usr/share/nginx/html:ro" \
    $TAG
