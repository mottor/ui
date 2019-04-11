'use strict';

const gulp = require('gulp');
const _if = require('gulp-if');
const del = require('del');
const browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const util = require('gulp-util');
const csso = require('gulp-csso');
const cssimport = require('gulp-cssimport');
const include = require('gulp-include');
const sassVariables = require('gulp-sass-variables');
// const replace = require('gulp-replace');
// const sourcemaps = require('gulp-sourcemaps');
// const autoprefixer = require("autoprefixer");
// const cssnano = require("cssnano");
// const postcss = require("gulp-postcss");
// const fs = require('fs');

const dirRoot = process.cwd();
const prod = process.argv.indexOf('--prod') >= 0;

var config = {
    standalone: true,
    basename: 'mui'
};

//---------------------------

util.log('Root =', dirRoot);
util.log('Env', prod ? util.colors.red('Production') : util.colors.green('Dev'));

config.dirBuild = dirRoot + '/build';
config.dirTmp = dirRoot + '/tmp';
config.dirSrc = dirRoot + '/src';
config.dirUiKit = config.dirSrc + '/ui-kit';
config.dirHtml = config.dirSrc + '/html';
config.dirDocs = config.dirSrc + '/docs';
config.dirThemes = config.dirUiKit + '/themes';

//---------------------------

function clean() {
    return del(config.dirTmp + '*');
}

function compileDocsHtml() {
    return gulp.src([config.dirDocs + '/**/*.html', '!' + config.dirDocs + '/includes/**/*'])
        .pipe(include({includePaths: [config.dirDocs + '/includes']}).on('error', console.log))
        .pipe(gulp.dest(config.dirBuild));
}

function watchDocsHtml() {
    gulp.watch(config.dirDocs + '/**/*.html', compileDocsHtml);
}

function compileDocsStyle() {
    return gulp
        .src(config.dirDocs + '/scss/main.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: prod ? 'compressed' : 'expanded',
            sourceComments: !prod
        }).on('error', sass.logError))
        .pipe(rename('docs.css'))
        .pipe(autoprefixer({browsers: 'last 3 versions'}))
        .pipe(gulp.dest(config.dirBuild + '/css'))
        .pipe(browserSync.stream())
        ;
}

function watchDocsStyle() {
    gulp.watch(config.dirDocs + "/scss/**/*.scss", compileDocsStyle);
}

// -------------------------

function compileUiScript(done) {
    done();
}

function watchScript() {

}

function compileUiStyle() {
    return gulp
        .src(config.dirThemes + '/**/theme.scss')
        .pipe(plumber())
        // .pipe(_if(!prod, sourcemaps.init()))
        .pipe(sassVariables({
            $env: prod ? 'prod' : 'dev'
        }))
        .pipe(sass({
            outputStyle: prod ? 'compressed' : 'expanded',
            sourceComments: !prod
        }).on('error', sass.logError))
        .pipe(_if(prod, cssimport()))
        .pipe(rename({basename: config.basename}))
        .pipe(autoprefixer({browsers: 'last 3 versions'}))
        .pipe(_if(prod, csso()))
        // .pipe(postcss([autoprefixer({browsers: 'last 3 versions'}), cssnano()]))
        // .pipe(_if(!prod, sourcemaps.write()))
        .pipe(gulp.dest(config.dirBuild + '/css'))
        .pipe(browserSync.stream())
        ;
}

function watchUiStyle() {
    gulp.watch(config.dirUiKit + "/**/*.scss", compileUiStyle);
}

function browserReload() {
    browserSync.reload();
}

function watchForBrowserReload() {
    gulp.watch(config.dirBuild + "**/*.html").on('change', browserReload);
}

const buildDocs = gulp.series(clean, gulp.parallel(compileDocsHtml, compileDocsStyle));
const watchDocs = gulp.parallel(watchDocsHtml, watchDocsStyle);

exports.buildDocs = buildDocs;
exports.watchDocs = watchDocs;

const buildUi = gulp.series(clean, gulp.parallel(compileUiScript, compileUiStyle));
const watchUi = gulp.parallel(watchUiStyle);

exports.build = buildUi;
exports.watch = watchUi;

function startServer() {
    browserSync.init({
        server: {
            baseDir: config.dirBuild
        }
    });
    watchUi();
    watchDocs();
    watchForBrowserReload();
}
const serve = gulp.series(buildDocs, buildUi, startServer);
exports.serve = serve;
