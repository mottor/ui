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
const fs = require('fs');
const exec = require('child_process').exec;
const sassVariables = require('gulp-sass-variables');
const svgSprite = require('gulp-svg-sprite');

// const replace = require('gulp-replace');
// const sourcemaps = require('gulp-sourcemaps');
// const cssnano = require("cssnano");
// const postcss = require("gulp-postcss");

const dirRoot = process.cwd();
const prod = ['y', 'yes', 'true', '1'].indexOf((process.env.UI_PROD || 'no').toLowerCase()) >= 0; //process.argv.indexOf('--prod') >= 0;
const theme = process.env.UI_THEME || null;
const version = process.env.UI_VERSION || 'v1.0';
const testVar = 't2';

var config = {
    standalone: true,
    basename: 'mottorUI'
};

//---------------------------

util.log('Root:', dirRoot);
util.log('Env:', prod ? util.colors.red('Prod') : util.colors.green('Dev'));

config.dirBuild = dirRoot + '/docs/build';
config.dirBuildHtml = dirRoot + '/docs/build';
config.dirTmp = dirRoot + '/tmp';
config.dirSrc = dirRoot + '/src';
config.dirKit = config.dirSrc + '/kit';
config.dirHtml = config.dirSrc + '/html';
config.dirDocs = config.dirSrc + '/html';
config.dirThemes = config.dirKit + '/themes';

if (null !== theme && fs.existsSync(config.dirThemes + '/' + theme)) {
    util.log('Theme:', util.colors.green(theme));
    util.log('Version:', util.colors.green(version));
    config.dirBuild += '/themes/' + theme + '/' + version;
    config.dirThemes += '/' + theme;
    config.exactTheme = true;
} else {
    config.dirBuild += '/full';
    config.exactTheme = false;
}

if (process.env.UI_BUILD_DIR) {
    config.dirBuild = process.env.UI_BUILD_DIR;
}

if (process.env.UI_CSS_NAME) {
    config.basename = process.env.UI_CSS_NAME;
}

var overrideFontFamily = '';
if (process.env.UI_FONT_FAMILY) {
    overrideFontFamily = process.env.UI_FONT_FAMILY;
    util.log('Override font family to:', overrideFontFamily);
}

var overrideFontSize = '';
if (process.env.UI_FONT_SIZE) {
    overrideFontSize = Number(process.env.UI_FONT_SIZE);
    util.log('Override font size to:', overrideFontSize);
}

util.log('Build dir:', config.dirBuild);
util.log('Theme dir:', config.dirThemes);
util.log('=============');
//---------------------------

function clean() {
    return del(config.dirTmp + '*');
}

function compileDocsHtml() {
    return gulp.src([config.dirDocs + '/**/*.html', '!' + config.dirDocs + '/includes/**/*'])
        .pipe(include({includePaths: [config.dirDocs + '/includes']}).on('error', console.log))
        .pipe(gulp.dest(config.dirBuildHtml));
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
        .pipe(gulp.dest(config.dirBuildHtml + '/css'))
        .pipe(browserSync.stream())
        ;
}

function watchDocsStyle() {
    gulp.watch(config.dirDocs + "/scss/**/*.scss", compileDocsStyle);
}

// -------------------------

function gitAdd(cb) {
    exec('git add ' + config.dirBuild, function (err, stdout, stderr) {
        // console.log(stdout);
        // console.log(stderr);
        cb(err);
    });
}

function compileUiScript(done) {
    done();
}

function watchScript() {

}

function compileUiStyle() {
    return gulp
        .src(config.dirThemes + (config.exactTheme ? '/' : '/**/') + 'theme.scss')
        .pipe(plumber())
        // .pipe(_if(!prod, sourcemaps.init()))
        .pipe(sassVariables({
            '$env': prod ? 'prod' : 'dev',
            '$test-var': testVar,
            '$override-font-size': overrideFontSize,
            '$override-font-family': overrideFontFamily
        }))
        .pipe(sass({
            outputStyle: prod ? 'compressed' : 'expanded',
            sourceComments: !prod
        }).on('error', sass.logError))
        .pipe(_if(prod, cssimport()))
        .pipe(rename({basename: config.basename + (prod ? '.min' : '')}))
        .pipe(autoprefixer({browsers: 'last 3 versions'}))
        .pipe(_if(prod, csso()))
        // .pipe(postcss([autoprefixer({browsers: 'last 3 versions'}), cssnano()]))
        // .pipe(_if(!prod, sourcemaps.write()))
        .pipe(gulp.dest(config.dirBuild + '/css')) // убрал + '/css', чтобы не складывалось в папку
        .pipe(gulp.dest(config.dirBuildHtml + '/css'))
        .pipe(browserSync.stream())
        ;
}

function compileFonts() {
    return gulp
        .src(config.dirSrc + '/fonts/**/*')
        .pipe(gulp.dest(config.dirBuild + '/fonts'))
        .pipe(gulp.dest(config.dirBuildHtml + '/fonts'))
        .pipe(browserSync.stream())
        ;
}

function watchUiStyle() {
    gulp.watch(config.dirKit + "/**/*.scss", compileUiStyle);
}

function compileSvg() {
    return gulp.src(config.dirKit + '/svg/' + '*.svg')
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"  //sprite file name
                    }
                },
            }
        ))
        .pipe(gulp.dest(config.dirBuild + '/svg'))
        .pipe(gulp.dest(config.dirBuildHtml + '/svg'));
}

function watchUiSvg() {
    gulp.watch(config.dirKit + "/svg/*.svg", compileSvg);
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

const buildUi = gulp.series(clean, gulp.parallel(compileUiScript, compileUiStyle, compileSvg, compileFonts)/*, gitAdd*/);
const watchUi = gulp.series(buildUi, gulp.parallel(watchUiStyle, watchUiSvg));

exports.build = buildUi;
exports.buildFonts = compileFonts;
exports.watch = watchUi;

function startServer() {
    browserSync.init({
        server: {
            baseDir: config.dirBuildHtml
        }
    });
    watchUi();
    watchDocs();
    watchForBrowserReload();
}
const serve = gulp.series(buildDocs, buildUi, startServer);
exports.serve = serve;
