# Mottor UI

Mottor UI-kit

## Сборка для вставки в Мотор

1. Создать свой файл ./bin/.env (на базе ./bin/.env.dist)
2. Если node_modules еще не установлены, запустить

        ./bin/npm-install
    
3. Сборка (на основе .env)
    
        ./bin/run npm run build

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
    
## Список всех тасков:

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

    sudo -u app UI_PROD=no UI_VERSION=v1.0.10 UI_THEME=example ./gulp buildDocs
    sudo -u app UI_PROD=no UI_VERSION=v1.0.10 UI_THEME=example ./gulp build
    sudo -u app UI_PROD=no UI_CSS_NAME=mottor-ui-cera UI_FONT_FAMILY1='Cera Pro' UI_VERSION=v1.0.10 UI_THEME=example ./gulp build
    sudo -u app UI_PROD=no UI_CSS_NAME=mottor-ui-avenir UI_FONT_FAMILY1='Avenir Next Cyr' UI_VERSION=v1.0.10 UI_THEME=example ./gulp build

## Материалы

[Advanced SCSS hacks](https://gist.github.com/jareware/4738651)