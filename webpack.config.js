const path = require("path");

const settings = {
    publicPath: path.join(__dirname, "public"),
    srcPath: path.join(__dirname, "src")
};

module.exports = (env, options) => {
    return {
        entry: {
            home: './src/main/index.js',
            tictactoe: './src/tictactoe/index.js'
        },
        output: {
            path: path.join(__dirname, 'public'),
            filename: '[name].js'
        },
        devServer: {
            proxy: {
              '/': 'http://localhost:3000'
            }
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
