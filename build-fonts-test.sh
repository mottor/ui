#!/bin/bash

PROD='no'
VERSION='v1.0.10'
THEME='example'

sudo -u app UI_PROD=no UI_VERSION=$VERSION UI_THEME=example ./gulp buildDocs

sudo -u app UI_PROD=$PROD UI_VERSION=$VERSION UI_THEME=$THEME ./gulp build
sudo -u app UI_PROD=$PROD UI_CSS_NAME=mottor-ui-cera UI_FONT_FAMILY='Cera Pro' UI_VERSION=$VERSION UI_THEME=$THEME ./gulp build
sudo -u app UI_PROD=$PROD UI_CSS_NAME=mottor-ui-avenir UI_FONT_FAMILY='Avenir Next Cyr' UI_VERSION=$VERSION UI_THEME=$THEME ./gulp build
