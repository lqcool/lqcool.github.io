/*添加的压缩博客静态资源的代码，通过gulp进行压缩*/
var gulp = require("gulp");
var minifycss = require("gulp-minify-css");
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');

/*压缩public目录css*/
gulp.task('minify-css',function(){
  return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
});
/*压缩public目录的html*/
gulp.task('minify-html',function(){
  return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
          removeComments:true,
          minifyJS:true,
          minifyCSS:true,
          minifyURLs:true
        }))
        .pipe(gulp.dest('./public'))
})

/*压缩 public/js 目录 js*/
gulp.task('minify-js', function() {
    return gulp.src('./public/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

/*执行gulp命令时候执行任务*/
gulp.task('default',['minify-html','minify-css','minify-jsnif'])

//生成博文是执行 hexo g && gulp 就会根据 gulpfile.js 中的配置，对 public 目录中的静态资源文件进行压缩。
