/*globals require */
//
// Project: Stormclient
// Copyright 2015 Partstorm
//


var startTime = +new Date(),
    nPath = require('path'),

    gulp = require('gulp'),
    gulpSync = require('gulp-sync')(gulp),
    gUtil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    jslint = require('gulp-jslint'),
    karma = require('gulp-karma'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),

    merge = require('merge-stream'),
    browserSync = require('browser-sync');

var path = {
        css: 'css',
        js: 'js'
    };

var buildDest = 'target/build',
    jsSrc = path.js + '/**/*.js',
    cssDest = path.css,
    lintSrc = ['gulpfile.js', jsSrc];

var config = require('./config/gulp');


// gulp task definitions
// =====================

gulp.task('lint', function () {
    return gulp.src(lintSrc)
        .pipe(jslint(config.jslint));
});

gulp.task('build-js', function () {
    return gulp.src(config.jsOrderedSrc)
        .pipe(concat('stormclient.js'))
        .pipe(gulp.dest(buildDest))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js'}))
        .pipe(gulp.dest(buildDest));
});

gulp.task('totalTime', function () {
    var c = gUtil.colors,
        totalTime = new Date(+new Date() - startTime).getTime() / 1000;
    gUtil.log('=== gulp total time: ' + c.green(totalTime) + ' secs ===');
    return gUtil.noop();
});


// public gulp API
// ===============

gulp.task('build', gulpSync.sync([
    // 'lint',
    'build-js',
    'totalTime'
]));

gulp.task('default', ['build']);