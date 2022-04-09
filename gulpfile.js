const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const sync = require('browser-sync').create()

const paths = {
	images: {
		src: 'src/img/**',
		dest: 'dist/img'
	},
	js: {
		src: 'src/app/**',
		dest: 'dist/app'
	},
	slick: {
		src: 'src/app/slick/**',
		dest: 'dist/app/slick'
	}
}

function html() {
	return src('src/**.html')
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest('dist'))

}

function img() {
	return src(paths.images.src)
		.pipe(dest(paths.images.dest))
}

function js() {
	return src(paths.js.src)
		.pipe(dest(paths.js.dest))
}



function scss() {
	return src('src/scss/**.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions']
		}))
		.pipe(csso())
		.pipe(concat('index.css'))
		.pipe(dest('dist'))
}

function clear() {
	return del('dist')
}

function serve() {
	sync.init({
		server: './dist'
	})
	watch('src/**.html', series(html)).on('change', sync.reload)
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
}




exports.build = series(clear, img, scss, html, js)
exports.serve = series(clear, img, scss, html, js, serve)
exports.clear = clear

