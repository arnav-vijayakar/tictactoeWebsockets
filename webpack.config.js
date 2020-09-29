const path = require("path");

const settings = {
    publicPath: path.join(__dirname, "public"),
    srcPath: path.join(__dirname, "src")
};

module.exports = (env, options) => {
    return {
        entry: './src/index.js',
        output: {
            path: path.join(__dirname, 'public'),
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: path.join(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: {
                      loader: "babel-loader"
                    }
                },
                {
                    test: /\.js?$/,
                    include: path.join(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: {
                      loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ]
        }
    };
};
