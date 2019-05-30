#!/bin/bash
CUR_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

PROD='no'
VERSION='v1.0.10'
THEME='example'
DIR="${1:-}"

if [ "$DIR" == '' ]; then
    DIR="${CUR_DIR}/../lpmotor1/web/mottor-ui"
fi

echo "Build dir: $DIR"

UI_PROD=$PROD UI_VERSION=$VERSION UI_THEME=$THEME UI_BUILD_DIR=$DIR UI_FONT_SIZE=14 ./gulp build
UI_PROD=$PROD UI_VERSION=$VERSION UI_THEME=$THEME UI_BUILD_DIR=$DIR UI_CSS_NAME=mottorUI-cera UI_FONT_FAMILY='Cera Pro' ./gulp build
UI_PROD=$PROD UI_VERSION=$VERSION UI_THEME=$THEME UI_BUILD_DIR=$DIR UI_CSS_NAME=mottorUI-avenir UI_FONT_FAMILY='Avenir Next Cyr' ./gulp build
