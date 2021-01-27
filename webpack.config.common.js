const path = require("path");

module.exports = {
	entry: ["./public/scripts/index.js", "@babel/polyfill"],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname + '/public/dist'),
		publicPath: "/public"
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/, //(node_modules | routes | utilities | views | models | controllers | config | middlewares )
			use: {
				loader: "babel-loader",
				options: {
					presets: ['@babel/preset-env'],
					plugins: ["@babel/plugin-transform-runtime"]
				}
			}
		}, {
			test: /\.(jpe?g|png|gif|svg)$/i,
			use: {
				loader: 'file-loader', // Or `url-loader` or your other loader
			}
		},{
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader'
			}]
		}]
	},
}