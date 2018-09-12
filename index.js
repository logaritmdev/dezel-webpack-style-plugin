const path = require('path')
var RawSource = require('webpack-sources').RawSource

const PLUGIN_NAME = 'Dezel Style Plugin'

let plugin = null
let ignore = []

class DezelStylePlugin {

	static loader(options = {}) {

		ignore = options.ignore || []

		return { test: /\.(ds|ds\.ios|ds\.android)$/, use: require.resolve('./loader') }
	}

	static instance(options) {
		return plugin
	}

	constructor(options) {
		this.sources = {}
		plugin = this
	}

	setSource(path, data) {
		if (this.ignore(path) == false) {
			this.sources[path] = data
		}
	}

	apply(compiler) {

		compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {

			let files = {
				ios: '',
				android: ''
			}

			compilation.chunks.forEach(chunk => {

				let modules = []

				chunk.modulesIterable.forEach(module => {

					let content = this.sources[module.resource]
					if (content == null) {
						return
					}

					modules.push(module)

				})

				modules.sort((a, b) => a.index - b.index)

				for (let module of modules) {

					let content = this.sources[module.resource]

					if (module.resource.match(/\.ds$/)) {
						files.ios += content + '\n'
						files.android += content + '\n'
						continue
					}

					if (module.resource.match(/\.ds.ios$/)) {
						files.ios += content + '\n'
						continue
					}

					if (module.resource.match(/\.ds.android$/)) {
						files.android += content + '\n'
						continue
					}
				}
			})

			compilation.assets['app.styles.ios'] = new RawSource(files.ios)
			compilation.assets['app.styles.android'] = new RawSource(files.android)

		})
	}

	ignore(file) {

		for (let regex of ignore) {
			if (regex instanceof RegExp) {
				if (regex.test(file)) {
					return true
				}
			}
		}

		return false
	}
}

module.exports = DezelStylePlugin