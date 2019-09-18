const redis = require('redis')
const {REDIS_CONF} = require('../conf/db')

//创建客户端
const redisClient = redis.createClient(REDIS_CONF)
redisClient.on('error', err => {
    console.log(err)
})

function set(key,val) {
    if(typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key,val,redis.print)
}

function get(key) {
    const promise = new Promise((resolve,reject) =>{
        redisClient.get(key,(err,val) => {
            if(err){
                reject(err)
                return
            }
            if(val == null){
                resolve(null)
                return
            }
            
            try{
               resolve(
                   JSON.parse(val)//如果是json就返回一个json对象
               ) 
            } catch (ex) {
                resolve(val) //如果不是json就返回
            }
        })
    })
    return promise
}


module.exports= {
    set,
    get
}