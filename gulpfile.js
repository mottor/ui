'use strict';

const gulp = require('gulp');
const _if = require('gulp-if');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require("browser-sync").create();
// const autoprefixer = require("autoprefixer");
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require("cssnano");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
// const fs = require('fs');
const util = require('gulp-util');
const csso = require('gulp-csso');

const dirRoot = process.cwd();
const prod = util.env.prod;

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
config.dirHtml = config.dirSrc + '/html';
config.dirThemes = config.dirSrc + '/themes';

//---------------------------

function clean() {
    return del(config.dirTmp + '*');
}

function compileHtml() {
    return gulp.src(config.dirHtml + '/*')
        .pipe(gulp.dest(config.dirBuild));
}

function watchHtml() {
    gulp.watch(config.dirHtml + '/*', compileHtml);
}

function compileScript(done) {
    done();
}

function watchScript() {

}

function compileStyle() {
    return gulp
        .src(config.dirThemes + '/**/theme.scss')
        .pipe(plumber())
        // .pipe(_if(!prod, sourcemaps.init()))
        .pipe(sass({
            outputStyle: prod ? 'compressed' : 'expanded',
            sourceComments: !prod
        }).on('error', sass.logError))
        .pipe(rename({basename: config.basename}))
        .pipe(autoprefixer({browsers: 'last 3 versions'}))
        .pipe(_if(prod, csso()))
        // .pipe(postcss([autoprefixer({browsers: 'last 3 versions'}), cssnano()]))
        // .pipe(_if(!prod, sourcemaps.write()))
        .pipe(gulp.dest(config.dirBuild + '/css'))
        .pipe(browserSync.stream())
        ;
}

function watchStyle() {
    gulp.watch(config.dirSrc + "/**/*.scss", compileStyle);
}

function browserReload() {
    browserSync.reload();
}

function startServer() {
    browserSync.init({
        server: {
            baseDir: config.dirBuild
        }
    });
    watchStyle();
    watchHtml();
    gulp.watch(config.dirBuild + "**/*.html").on('change', browserReload);
}

const build = gulp.series(clean, gulp.parallel(compileHtml, compileScript, compileStyle));
const watch = gulp.series(build, gulp.parallel(watchStyle));
const serve = gulp.series(build, startServer);

exports.build = build;
exports.watch = watch;
exports.serve = serve;
