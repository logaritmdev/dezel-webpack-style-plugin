# Webpack Dezel

Dezel style (`.ds, .ds.ios, .ds.android`) loader and plugin.

## Usage

Follow the sample webpack config file below. The `ignore` option is optional,
but can be useful to exclude platform specific styles on from external
libraries. Each value in the `ignore` array must be a regular exception that
will be tested against the full path of the style file.

## Sample webpack.config.js

	const path = require('path')
	const DezelStylePlugin = require('webpack-dezel')

	module.exports = {

		// ...

		module: {

			rules: [

				// ...

				DezelStylePlugin.loader({
					ignore: [
						/\.ds\.ios$/,
						/\.ds\.android$/,
					]
				})
			]
		},

		plugins: [
			new DezelStylePlugin()
		]
	};


## Licence
MIT
