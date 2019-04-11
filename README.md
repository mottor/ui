# Mottor UI

Mottor UI-kit

## Caution!

Не надо делать @import шрифтов или других файлов.
[Подробнее тут](http://www.stevesouders.com/blog/2009/04/09/dont-use-import/)

Продакшн сборка будет вытаскивать файлы по @import директивам и вставлять их контент прямо в результат сборки. В плане гугл-шрифтов это может привести к плохим последствиям (если вдруг ссылки на шрифты поменяются). 
Так что используем `<link>` для подключения шрифтов.

## Gulp

Сборка

    ./gulp build
    
Сборка для продакшена

    ./gulp build --prod
    
Сборка складывается в ./build/css/{theme-name}/mui.css
    
Запуск для разработки с сервером и browserSync

    ./gulp serve
    
Список всех тасков:

* buildDocs
* watchDocs
* build
* watch
* serve