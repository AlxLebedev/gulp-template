// Определяем препроцессор для легкой его смены
const preprocessor = 'sass';
const additionalSyntax = 'scss';
const preprocessorSyntax = additionalSyntax ? additionalSyntax : preprocessor;

// Определили константы для работы с gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключим browser-sync. Для создания нового подключения вызовем метод create()
const browserSync = require('browser-sync').create();

// Подключаем concat для склеивания файлов и uglify для минимизации JS
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

// Подключаем пакеты для работы со стилями
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

// Подключаем пакеты для работы с картинками
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

const svgSprite = require('gulp-svg-sprite');

// Создадим функцию, которая будет инициализирует browser-sync
function browsersync() {
    browserSync.init({
        server: { baseDir: 'src/' },// определяем базовую директорию для сервера
        notify: false,// отключаем уведомления от сервера
        online: true,// подтверждаем, что работаем online (некоторые функции сервера требуют онлайн-подключения - можем менять true/false)
    })
}

function styles() {
    return src(
        `src/${preprocessorSyntax}/index.${preprocessorSyntax}`// Определяем какой файл стилей будет основным
    )
    .pipe(eval(preprocessor)())// выполняем функцию препроцессора, например sass() или scss() или less() - в зависимости от переменной
    .pipe(concat('index.min.css'))// concat не только склеивает - можем просто указать имя результирующего файла
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))// настроим префиксы
    .pipe(cleancss({
        level: { 1: { specialComments: 0 } },// настроим сжатие кода стилей
        // format: 'beautify'// можем выводить в читаемом формате
    }))
    .pipe(dest('src/css/'))// указываем куда положить скомпилированный файл стилей
    .pipe(browserSync.stream())// inject в браузер
}

function images() {
    return src('src/images/src/**/*')
    .pipe(newer('src/images/dest'))
    .pipe(imagemin())
    .pipe(dest('src/images/dest/'))
}

function svg() {
    return src('src/images/src/svg/**/*')
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(dest('src/images/dest/'))
}

function scripts() {
    return src([// перечисляем файлы JS (по порядку: снизу те, что используют данные из файлов выше)
        'src/js/helpers/themeToggler.js',
        'src/js/index.js'
    ])
    .pipe(concat('index.min.js'))// склеиваем в один файл
    .pipe(uglify())// минифицируем
    .pipe(dest('src/js/'))// указываем куда выгрузить результирующий файл
    .pipe(browserSync.stream())// inject в браузер
}

function startWatch() {
    watch(['src/js/**/*.js', '!src/js/**/*.min.js'], scripts);// следим за изменениями в JS файлах
    watch(`src/${preprocessorSyntax}/**/*.${preprocessorSyntax}`, styles)// следим за изменениями в файлах со стилями
    watch('src/**/*.html').on('change', browserSync.reload)// следим за изменениями в HTML файлах
    watch('src/images/src/**/*', images)
}

function build() {
    return src([
        'src/css/**/*.min.css',
        'src/js/**/*.min.js',
        'src/images/dest/**/*',
        'src/**/*.html',
    ], { base: 'src' })
    .pipe(dest('dist'))
}

function cleanImg() {
    return del('src/images/dest/**/*', {force: true})
}

function cleanDist() {
    return del('dist/**/*', {force: true})
}

function cleanDev() {
    return del([
        'src/images/dest/**/*',
        'src/js/*.min.js',
        'src/css/**/*'
    ], {force: true})
}

// Экспортируем функцию как готовый gulp-task (название функции указывается после знака =)
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.svg = svg;
exports.cleanImg = cleanImg;
exports.cleanDist = cleanDist;
exports.cleanDev = cleanDev;

exports.build = series(images, svg, styles, scripts, build);

exports.default = series(images, svg, parallel(styles, scripts, browsersync, startWatch));
