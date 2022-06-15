const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APIGW_URL: JSON.stringify(process.env.APIGW_URL),
        ADFS_URL: JSON.stringify(process.env.ADFS_URL),
        CLIENT_ID: JSON.stringify(process.env.CLIENT_ID)
      }
    })
  ]
}