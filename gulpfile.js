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
    cssDest = path.css;

var config = require('./config/gulp');


// gulp task definitions
// =====================

gulp.task('totalTime', function () {
    var c = gUtil.colors,
        totalTime = new Date(+new Date() - startTime).getTime() / 1000;
    gUtil.log('=== gulp total time: ' + c.green(totalTime) + ' secs ===');
    return gUtil.noop();
});

gulp.task('build', ['totalTime']);


// public gulp API
// ===============

gulp.task('default', [])