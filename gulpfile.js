var gulp = require('gulp');
var gulpif = require('gulp-if');
var args = require('yargs').argv;

var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var del = require('del');

var src = 'src/';
var dist = 'dist/';

var tsconfig = typescript.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    return gulp.src(src + 'app/**/*.ts')
        .pipe(gulpif(!args.production, sourcemaps.init()))
        .pipe(typescript(tsconfig))
        .pipe(gulpif(!args.production, sourcemaps.write()))
        .pipe(gulp.dest(dist + 'app'));
});

gulp.task('build-copy', function () {
    gulp.src([src + 'app/**/*.html', src + 'app/**/*.htm', src + 'app/**/*.css'])
        .pipe(gulp.dest(dist + 'app'));

    gulp.src([src + 'index.html'])
        .pipe(gulp.dest(dist));

    return gulp.src([src + 'systemjs.config.js'])
        .pipe(gulp.dest(dist));
});

gulp.task('clean', function() {
    return del([dist + '**/*.html', dist + '**/*.htm', dist + '**/*.css', dist + 'app/**', dist + 'vendor/**']);
});

gulp.task('vendor', function() {

    return gulp.src(['node_modules/@angular/**',
    'node_modules/es6-shim/**',
    'node_modules/reflect-metadata/**',
    'node_modules/rxjs/**',
    'node_modules/systemjs/**',
    'node_modules/ng2-bootstrap/**',
    'node_modules/moment/**',
    'node_modules/zone.js/**'],  {base: './node_modules/'})
        .pipe(gulp.dest(dist + 'vendor/'));
});

gulp.task('watch', function() {
   gulp.watch(src + '**/*.ts', ['build-ts']);
   gulp.watch(src + '**/*.{html,htm,css}', ['build-copy']);
});

gulp.task('build', ['build-ts', 'build-copy']);
gulp.task('default', ['build', 'watch']);