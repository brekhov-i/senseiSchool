const { src, dest, series, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify-es").default;
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const svgSprite = require("gulp-svg-sprite");
const fileInclude = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const revDel = require("gulp-rev-delete-original");
const htmlmin = require("gulp-htmlmin");
const gulpif = require("gulp-if");
const notify = require("gulp-notify");
const image = require("gulp-image");
const { readFileSync, writeFile, readdir, appendFile } = require("fs");
const concat = require("gulp-concat");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const rename = require("gulp-rename");

let isProd = false; // dev by default

const clean = () => {
  return del(["app/*"]);
};

//Работа со шрифтами
const fonts = () => {
  src("./src/assets/fonts/*.ttf").pipe(ttf2woff()).pipe(dest("./app/fonts"));
  return src("./src/assets/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(dest("./app/fonts"));
};

const checkWeight = (fontname) => {
  let weight = 400;
  switch (true) {
    case /Thin/.test(fontname):
      weight = 100;
      break;
    case /ExtraLight/.test(fontname):
      weight = 200;
      break;
    case /Light/.test(fontname):
      weight = 300;
      break;
    case /Regular/.test(fontname):
      weight = 400;
      break;
    case /Medium/.test(fontname):
      weight = 500;
      break;
    case /SemiBold/.test(fontname):
      weight = 600;
      break;
    case /Semi/.test(fontname):
      weight = 600;
      break;
    case /Heavy/.test(fontname):
      weight = 600;
      break;
    case /Bold/.test(fontname):
      weight = 700;
      break;
    case /ExtraBold/.test(fontname):
      weight = 800;
      break;
    case /Black/.test(fontname):
      weight = 900;
      break;
    default:
      weight = 400;
  }
  return weight;
};

const checkStyle = (fontStyletext) => {
  let style = "normal";
  switch (true) {
    case /Italic/.test(fontStyletext):
      style = "italic";
      break;
    default:
      style = "normal";
  }
  return style;
};

const cb = () => {};

let srcFonts = "./src/assets/scss/_fonts.scss";
let appFonts = "./app/fonts/";

const fontsStyle = (done) => {
  let file_content = readFileSync(srcFonts);

  writeFile(srcFonts, "", cb);
  readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split(".");
        fontname = fontname[0];
        let font = fontname.split("-")[0];
        let weight = checkWeight(fontname);
        let fontStyleText = fontname.split("_")[1];
        let fontStyle = checkStyle(fontStyleText);

        if (c_fontname != fontname) {
          appendFile(
            srcFonts,
            '@include font-face("' +
              font +
              '", "' +
              fontname +
              '", ' +
              weight +
              ", " +
              fontStyle +
              ");\r\n",
            cb
          );
        }
        c_fontname = fontname;
      }
    }
  });

  done();
};
//svg sprite
const svgSprites = () => {
  return src("./src/assets/img/svg/**.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg", //sprite file name
          },
        },
      })
    )
    .pipe(dest("./app/img"));
};

const styles = () => {
  return src("./src/assets/scss/**/*.scss")
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass().on("error", notify.onError()))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(!isProd, sourcemaps.write(".")))
    .pipe(dest("./app/css/"))
    .pipe(browserSync.stream());
};

const stylesBackend = () => {
  return src("./src/assets/scss/**/*.scss")
    .pipe(sass().on("error", notify.onError()))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(dest("./app/css/"));
};

const scripts = () => {
  return src("./src/assets/js/*.js")
    .pipe(
      webpackStream({
        mode: "development",
        entry: {
          index: "./src/assets/js/index.js"
        },
        output: {
          filename: "[name].js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
      })
    )
    .on("error", function (err) {
      console.error("WEBPACK ERROR", err);
      this.emit("end"); // Don't stop the rest of the task
    })
    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./app/js"))
    .pipe(browserSync.stream());
};

const scriptsBackend = () => {
  src("./src/assets/js/vendor/**.js")
    .pipe(concat("vendor.js"))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
    .pipe(dest("./app/js/"));
  return src([
    "./src/assets/js/functions/**.js",
    "./src/assets/js/components/**.js",
    "./src/assets/js/index.js",
  ]).pipe(dest("./app/js"));
};

const resources = () => {
  return src("./src/static/**").pipe(dest("./app"));
};

const images = () => {
  return src([
    "./src/assets/img/**.jpg",
    "./src/assets/img/**.png",
    "./src/assets/img/**.jpeg",
    "./src/assets/img/*.svg",
    "./src/assets/img/**/*.jpg",
    "./src/assets/img/**/*.png",
    "./src/assets/img/**/*.jpeg",
  ])
    .pipe(gulpif(isProd, image()))
    .pipe(dest("./app/img"));
};

const htmlInclude = () => {
  return src(["./src/*.html"])
    .pipe(
      fileInclude({
        prefix: "@",
        basepath: "@file",
      })
    )
    .pipe(dest("./app"))
    .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    watch: true,
    server: {
      baseDir: "./app",
    },
    port: 8080,
    ghostMode: false,
    tunnel: true,
    host: "192.168.0.101"
  });

  watch("./src/assets/scss/**/*.scss", styles);
  watch("./src/assets/js/**/*.js", scripts);
  watch("./src/html/**/*.html", htmlInclude);
  watch("./src/*.html", htmlInclude);
  watch("./src/static/**", resources);
  watch("./src/assets/img/*.{jpg,jpeg,png,svg}", images);
  watch("./src/assets/img/**/*.{jpg,jpeg,png}", images);
  watch("./src/assets/fonts/*.ttf", fonts);
  watch("./src/assets/fonts/*.ttf", fontsStyle);
  watch("./src/assets/img/svg/**.svg", svgSprites);
};

const cache = () => {
  return src("app/**/*.{css,js,svg,png,jpg,jpeg,woff2}", {
    base: "app",
  })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest("app"))
    .pipe(rev.manifest("rev.json"))
    .pipe(dest("app"));
};

const rewrite = () => {
  const manifest = readFileSync("app/rev.json");
  src("app/css/*.css")
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(dest("app/css"));
  return src("app/**/*.html")
    .pipe(
      revRewrite({
        manifest,
      })
    )
    .pipe(dest("app"));
};

const htmlMinify = () => {
  return src("app/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("app"));
};

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(
  clean,
  htmlInclude,
  scripts,
  fonts,
  fontsStyle,
  styles,
  resources,
  images,
  svgSprites,
  watchFiles
);

exports.build = series(
  toProd,
  clean,
  htmlInclude,
  scripts,
  fonts,
  fontsStyle,
  styles,
  resources,
  images,
  svgSprites,
  htmlMinify
);

exports.cache = series(cache, rewrite);

exports.backend = series(
  toProd,
  clean,
  htmlInclude,
  scriptsBackend,
  fonts,
  fontsStyle,
  stylesBackend,
  resources,
  images,
  svgSprites
);
