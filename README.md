# Mottor UI

Mottor UI-kit

## Caution!

Не надо делать @import шрифтов или других файлов.
[Подробнее тут](http://www.stevesouders.com/blog/2009/04/09/dont-use-import/)

Продакшн сборка будет вытаскивать файлы по @import директивам и вставлять их контент прямо в результат сборки. В плане гугл-шрифтов это может привести к плохим последствиям (если вдруг ссылки на шрифты поменяются). 
Так что используем `<link>` для подключения шрифтов.

## Gulp

Сборка

    UI_VERSION=v1.0 UI_THEME=example ./gulp serve
    
Сборка для продакшена

    UI_PROD=yes UI_VERSION=v1.0 UI_THEME=example ./gulp serve
    
Сборка складывается в ./build/css/{theme-name}/mui.css
    
Запуск для разработки с сервером и browserSync

    UI_PROD=no UI_VERSION=v1.0 UI_THEME=example ./gulp serve
    
Сборка для вставки в Мотор

    UI_PROD=yes UI_VERSION=v1.0.6 UI_THEME=example UI_BUILD_DIR=/Users/user/Sites/lpmotor1/web/mottor-ui ./gulp build
    UI_PROD=yes UI_VERSION=v1.0.6 UI_THEME=example UI_BUILD_DIR=/Users/sotty/projects/lpmotor1/web/mottor-ui ./gulp build
    UI_PROD=yes UI_VERSION=v1.0.6 UI_THEME=example UI_BUILD_DIR=/home/tony/projects/lpmotor1/web/mottor-ui ./gulp build
    
Список всех тасков:

* buildDocs
* watchDocs
* build
* watch
* serve

## Build with Tagging

    UI_PROD=no UI_VERSION=v1.0.9 UI_THEME=example ./gulp build
    git add docs/build/themes/*
    git commit -m "1.0.9"
    git tag -a 1.0.9
    git push -u origin master --tags

## Сборка на srv6

    UI_PROD=no UI_VERSION=v1.0.10 UI_THEME=example ./gulp buildDocs
    UI_PROD=no UI_CSS_NAME=mottor-ui-cera UI_VERSION=v1.0.10 UI_THEME=example ./gulp build
    UI_PROD=no UI_CSS_NAME=mottor-ui-avenir UI_VERSION=v1.0.10 UI_THEME=example ./gulp build