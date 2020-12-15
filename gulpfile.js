/// <binding BeforeBuild='default' Clean='default' ProjectOpened='default' />
// Include gulp
const gulp = require('gulp');

const rename = require('gulp-rename');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');

// Compile HBS Templates
gulp.task('templateCompilation', function() {
    return gulp.src(['Assets/templates/*.hbs'])
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'myMob.templates',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('templates.min.js'))
        .pipe(gulp.dest('./Assets/js/'));
});

// Compile Bootstrap SCSS
gulp.task('compileSass', function() {
    return gulp.src('Assets/sass/index.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(rename({ 
            basename: 'style',
            extname: '.css'
        }))
        .pipe(gulp.dest('./Assets/css/'));
});

// Watch Files For Changes
gulp.task('watcher:CSS', () => {
    return gulp.watch(['./Assets/sass/*.*'],
        {
            ignoreInitial: false
        },
        gulp.series('compileSass'))
});

gulp.task('watcher:HBS_Templates', () => {
    return gulp.watch('./Assets/templates/*.hbs',
        {
            ignoreInitial: false
        },
        gulp.series('templateCompilation'));
});