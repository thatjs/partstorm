//
// Project: Stormclient
// Copyright 2015 Partstorm
//


var nPath = require('path'),

    gulp = require('gulp'),
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