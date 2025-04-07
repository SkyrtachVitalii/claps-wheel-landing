// npm init -y
// npm install gulp gulp-clean-css gulp-terser gulp-htmlmin gulp-replace
// npx gulp bundle

const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const htmlmin = require("gulp-htmlmin");
const replace = require("gulp-replace");
const del = require("del"); // Імпортуємо del

const newImagePath = "/minio/claps/landings/test-your-luck/img/";

gulp.task("clean", function () {
  return del(["dist/**", "!dist"]); // Видаляє всі файли та підпапки в dist, але залишає саму папку
});

gulp.task("css", function () {
  return gulp
    .src("css/style.css")
    .pipe(cleanCSS())
    .pipe(replace(/\/\*[\s\S]*?\*\//g, ''))
    .pipe(gulp.dest("dist"));
});

gulp.task("js", function () {
  return gulp
    .src("src/js/alternativeSCRIPTJS.js")
    .pipe(terser())
    .pipe(gulp.dest("dist"));
});

gulp.task("bundle", gulp.series("css", "js", function (done) {
    let cssPath = path.join(__dirname, "dist", "style.css");
    let jsPath = path.join(__dirname, "dist", "alternativeSCRIPTJS.js");
  
    if (!fs.existsSync(cssPath) || !fs.existsSync(jsPath)) {
      console.error("Файл(и) CSS або JS не знайдені у dist. Перевірте завдання 'css' та 'js'.");
      done();
      return;
    }
  
    let cssContent = fs.readFileSync(cssPath, "utf8");
    let jsContent = fs.readFileSync(jsPath, "utf8");

    cssContent = cssContent.replace(/url\(["']?\/src\/img\/(.*?)["']?\)/g, `url("${newImagePath}$1")`);
  
    return gulp
      .src("index.html")
      .pipe(replace(/<body>/, `<body><style>${cssContent}</style>`))  // Додаємо стиль перед вмістом body
      .pipe(replace(/<!DOCTYPE html>|<html.*?>|<\/html>|<body.*?>|<\/body>|<head>.*?<\/head>/gs, ""))  // Видаляємо весь тег head
      .pipe(replace(/<script\s+src=".*?alternativeSCRIPTJS\.js".*?><\/script>/, `<script>${jsContent}</script>`))
      .pipe(replace(/src=["']\/src\/img\/(.*?)["']/g, `src="${newImagePath}$1"`))
      .pipe(replace(/<source\s+srcset=["']\/src\/img\/(.*?)["']/g, `<source srcset="${newImagePath}$1"`))
      .pipe(replace(/<!--[\s\S]*?-->/g, ""))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("dist"));
  }));

gulp.task("default", gulp.series("clean", "bundle"));