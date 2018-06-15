var DezelStylePlugin = require('./index')

let changes = {}

module.exports = function (content) {

	this.cacheable()

	let path = this.resourcePath

	DezelStylePlugin.instance().setSource(path, content)

	let source = ''

	if (process.env.NODE_ENV == 'development') {
		source = `
			if (global.__webpack_reload_styles == null) {
				global.__webpack_reload_styles = true
				console.log('[HMR] Reloading styles..')
			}
		`
	}

	return source
};

module.exports.raw = true