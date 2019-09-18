const env = process.env.NODE_ENV //环境参数 环境变量

//数据库配置
//dev 开发环境，该环境下的配置项只影响开发人员本地代码配置，在项目初期代码本地编写时调试使用
//prd production ,正式的生产环境，程序最终发布后所需要的参数配置

let MYSQL_CONF
let REDIS_CONF

if(env === 'dev') {
    //mysql配置值
    MYSQL_CONF = {
        host:'localhost',
        user:'root',
        password:'94942132b',
        port:'3306',
        database:'myblog'
    }

    //redis
    REDIS_CONF = {
        port:6379,
        host:'127.0.0.1'
    }
}

if(env === 'production') {
    //mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '94942132b',
        port: '3306',
        database: 'myblog'
    }

    //redis
    REDIS_CONF = {
        port:6379,
        host:'127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}