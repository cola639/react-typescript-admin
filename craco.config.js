const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const CracoAlias = require('craco-alias')

process.env.BROWSER = 'none'

module.exports = {
    webpack: {
        plugins: [
            ...(process.env.NODE_ENV === 'development'
                ? [new BundleAnalyzerPlugin({openAnalyzer: false})]
                : [new BundleAnalyzerPlugin({openAnalyzer: true})]),
        ],

        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 40000,
                maxAsyncRequests: 5, // 最大异步请求数
                maxInitialRequests: 4, // 页面初始化最大异步请求数
                automaticNameDelimiter: '~', // 解决命名冲突
                // name: true值将会自动根据切割之前的代码块和缓存组键值(key)自动分配命名,否则就需要传入一个String或者function.
                name: true,
                cacheGroups: {
                    baseCommon: {
                        name: 'baseCommon',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router|redux-saga|dva|react-router-dom|draft-js\/lib|core-js|moment|@antv\/data-set\/build|)[\\/]/,
                        priority: -10,
                    },
                    UI: {
                        name: 'UI',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](@ant-design|antd|immutable\/dist|rc-calendar\/es|braft-finder\/dist|lodash|rc-tree\/es)[\\/]/,
                        priority: -11,
                    },
                    someUsed: {
                        name: 'someUsed',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](bizcharts\/umd|echarts|react-color\/lib|zrender\/lib|braft-editor\/dist|rc-table|react-amap\/lib|rc-menu\/es|rc-select\/es|rc-trigger\/es)[\\/]/,
                        priority: -12,
                    },
                },
            },
        },
    },
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'tsconfig',
                // baseUrl SHOULD be specified
                // plugin does not take it from tsconfig
                baseUrl: './src/',
                /* tsConfigPath should point to the file where "baseUrl" and "paths"  are specified*/
                tsConfigPath: './tsconfig.paths.json',
            },
        },
    ],
    babel: {
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
                'babel-plugin-styled-components',
                {
                    ssr: false,
                    displayName: process.env.REACT_APP_NODE_ENV !== 'production',
                    pure: true,
                },
            ],
        ],
    },
    devServer: {
        // proxy: {
        //     '/api': {
        //         target: 'http://XXXXXXXX:8888',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': '',
        //         },
        //     },
        // },
    },
}
