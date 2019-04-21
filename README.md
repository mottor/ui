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

    UI_PROD=n UI_VERSION=v1.0.4 UI_THEME=example UI_BUILD_DIR=/Users/user/Sites/lpmotor1/web/css/mottor-ui ./gulp build
    
Список всех тасков:

* buildDocs
* watchDocs
* build
* watch
* serve