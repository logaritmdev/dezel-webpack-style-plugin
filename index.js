const path = require('path')
var RawSource = require('webpack-sources').RawSource

let instance = null
const PLUGIN_NAME = 'Dezel Style Plugin'

class DezelStylePlugin {

	static loader() {
		return { test: /\.(styles|styles\.ios|styles\.android)$/, use: require.resolve('./loader') }
	}

	static instance(options) {
		return instance
	}

	constructor(options) {
		this.sources = {}
		instance = this
	}

	setSource(path, data) {
		this.sources[path] = data
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

					switch (path.extname(module.resource)) {

						case '.styles':
							files.ios += content + '\n'
							files.android += content + '\n'
							break

						case '.ios':
							files.ios += content + '\n'
							break

						case '.android':
							files.android += content + '\n'
							break
					}
				}
			})

			compilation.assets['app.styles.ios'] = new RawSource(files.ios)
			compilation.assets['app.styles.android'] = new RawSource(files.android)

		})
	}
}

module.exports = DezelStylePlugin