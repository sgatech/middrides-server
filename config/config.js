var path = require("path");

const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        root: rootPath,
        app: {
            name: "middrides-server"
        },
        port: 3000,
        db: 'mongodb://localhost:27017/middrides-dev',
        storage: rootPath + '/data/db-development'
    },

    test: {
        root: rootPath,
        app: {
            name: "middrides-server"
        },
        port: 3000,
        db: 'mongodb://localhost:27017/middrides-test',
        storage: rootPath + '/data/db-test'
    },

    production: {
        root: rootPath,
        app: {
            name: "middrides-server"
        },
        port: 3000,
        db: 'mongodb://localhost:27017/middrides-prod',
        storage: rootPath + '/data/db-production'
    }
}

module.exports = config[env]