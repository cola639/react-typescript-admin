module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    webpack: {
        // 别名配置
        alias: {
            '@': pathResolve('src'),
        },
        plugins: [
            // webpack构建进度条
            new WebpackBar({
                profile: true,
            }),

            // v5
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment/,
            }),
            // 查看打包的进度
            new SimpleProgressWebpackPlugin(),
            // 时间转换工具采取day替换moment
            // new AntdDayjsWebpackPlugin(),
            ...whenDev(
                () => [
                    // webpack-dev-server 强化插件
                    new DashboardPlugin(),
                    new webpack.HotModuleReplacementPlugin(),
                ],
                [],
            ),
            /**
             * 编译产物分析
             *  - https://www.npmjs.com/package/webpack-bundle-analyzer
             * 新增打包产物分析插件
             */
            ...when(
                isBuildAnalyzer,
                () => [
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static', // html 文件方式输出编译分析
                        openAnalyzer: false,
                        reportFilename: path.resolve(__dirname, `analyzer/index.html`),
                    }),
                ],
                [],
            ),
            ...whenProd(
                () => [
                    new TerserPlugin({
                        parallel: threads, // 开启多进程
                        terserOptions: {
                            sourceMap: shouldUseSourceMap, // Must be set to true if using source-maps in production
                            ecma: undefined,
                            parse: {},
                            compress: {
                                warnings: false,
                                drop_console: true, // 生产环境下移除控制台所有的内容
                                drop_debugger: true, // 移除断点
                                pure_funcs: ['console.log'], // 生产环境下移除console
                            },
                        },
                    }),
                    // 打压缩包
                    new CompressionWebpackPlugin({
                        algorithm: 'gzip',
                        filename: '[path][base].gz',
                        exclude: /.map$/,
                        test: productionGzipExtensions,
                        threshold: 1024,
                        minRatio: 0.8,
                        deleteOriginalAssets: false,
                    }),
                ],
                [],
            ),
        ],
        //抽离公用模块
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        chunks: 'initial',
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                    },
                    vendor: {
                        test: /node_modules/,
                        chunks: 'initial',
                        name: 'vendor',
                        priority: 10,
                        enforce: true,
                    },
                },
            },
        },
        /**
         * 重写 webpack 任意配置
         *  - configure 能够重写 webpack 相关的所有配置，但是，仍然推荐你优先阅读 craco 提供的快捷配置，把解决不了的配置放到 configure 里解决；
         *  - 这里选择配置为函数，与直接定义 configure 对象方式互斥；
         */
        configure: (webpackConfig, {env, paths}) => {
            // paths.appPath='public'
            paths.appBuild = 'build' // 配合输出打包修改文件目录
            // webpackConfig中可以解构出你想要的参数比如mode、devtool、entry等等，更多信息请查看webpackConfig.json文件
            /**
             * 修改 output
             */
            webpackConfig.output = {
                ...webpackConfig.output,
                path: path.resolve(__dirname, 'build'), // 修改输出文件目录
                publicPath: '/',
            }
            /**
             * webpack split chunks
             */
            webpackConfig.optimization.splitChunks = {
                ...webpackConfig.optimization.splitChunks,
                ...{
                    chunks: 'all',
                    name: false,
                },
            }
            // 返回重写后的新配置
            return webpackConfig
        },
    },
    babel: {
        presets: [],
        plugins: [
            // AntDesign 按需加载
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                },
                'antd',
            ],
            [
                '@babel/plugin-proposal-decorators',
                {
                    legacy: true,
                },
            ], // 用来支持装饰器
        ],
        loaderOptions: (babelLoaderOptions, {env, paths}) => {
            return babelLoaderOptions
        },
    },
    /**
     * 新增 craco 提供的 plugin
     */
    plugins: [
        // 热更新
        ...whenDev(
            () => [
                {
                    plugin: FastRefreshCracoPlugin,
                },
                // {
                //   plugin: CracoVtkPlugin()
                // },
                {
                    plugin: new AntdDayjsWebpackPlugin(),
                },
            ],
            [],
        ),
        // 方案1、配置Antd主题less
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        math: 'always',
                        modifyVars: {'@primary-color': '#fcc828'},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    devServer: {
        port: 3000,
        proxy: {
            '/api': {
                target: `${REACT_APP_BASE_URL}/`,
                changeOrigin: true,
                secure: false,
            },
        },
    },
}
