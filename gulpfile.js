var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var minifyCss     = require('gulp-minify-css');
var concatCss     = require('gulp-concat-css');
var notify        = require("gulp-notify");
var autoprefixer  = require('gulp-autoprefixer');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');
var size          = require('gulp-size');
var uncss         = require('gulp-uncss');
var sourcemaps    = require('gulp-sourcemaps');

// Rafraichissement du browser
var reload      = browserSync.reload;

// Task browser-sync pour configurer au lancement browser sync
gulp.task('browser-sync', function() {
    browserSync({
        port: 3000,
        server: {
            baseDir: "./", //base directory
            index: "index.html" //fichier a lancer par defaut
        }
    });
});

// Au lancement de la tache défault, on lance la tache browser-sync
gulp.task('default', ['browser-sync', 'sass', 'js'], function(){
  // gulp.watch('./css/*.css', ['css']);
  gulp.watch(['./sass/*.scss', './sass/partials/*.scss'], ['sass']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch(["*.html", "partials/*.html"]).on('change', browserSync.reload); //reload on HTML
});

//For js
gulp.task('js', function() {
  // Order By initi, filters, controllers...
  return gulp.src('./js/*.js')
    .pipe(size())
    .pipe(concat('app.min.js'))
    .pipe(uglify()) //minify js
    .pipe(gulp.dest('dist/js'))
    .pipe(notify("Préparation JS Ok"))
    .pipe(reload({stream:true, once: true}));
});

// gulp.task('css', function(){
//
//   return gulp.src('./css/*.css') // Je recupere mon fichier css
//   .pipe(autoprefixer({
//     browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
//     cascade: false
//   })) // J'auto-prefice mes class css
//   .pipe(concatCss("main.min.css"))// Je concatene tous mes fichiers css
//   .pipe(minifyCss()) // Je minify le css
//   .pipe(gulp.dest('dist/css/')) // JE l'enregistre dans le dossier dist/css/
//   .pipe(notify("Préparation CSS Ok"))
//   .pipe(browserSync.stream({once: true}));  // Je relance mon navigateur quand la tache css est finie
//
// });

gulp.task('sass', function(){
  return gulp.src('./sass/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('bundle-sass.css'))
  .pipe(autoprefixer({
    browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
    cascade: false
  }))
  // .pipe(uncss({ html: ['index.html'], ignore: ['.cards-container', '.grid-item'] }))
  .pipe(minifyCss())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/css/'))
  // .pipe(notify("Préparation SASS Ok"))
  .pipe(browserSync.stream({once: true}));

});
