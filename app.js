const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
//session 数据
const SESSION_DATA= {}
//获取cookies的过期时间
const getCookieExpires = () =>{
    const d = new Date()
    d.setTime(d.getTime() +(24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is',d.toGMTString())
    return d.toGMTString()//一种时间格式
}


//处理异步的postData
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        //并没有用到reject，没有并不代表错误，忽略为空
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        //如果不是JSON格式忽略
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk =>
            postData += chunk.toString()
        )
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })

    })
    return promise
}


//承接www中的createServer 回调
//系统的基本设置 
//设置返回类型 
//获取path
//解析query 
//处理路由
const serverHandle = (req, res) => {
    //设置返回格式 JSON 业界规范
    res.setHeader('Content-type', 'application/json')
    //获取path
    const url = req.url
    req.path = url.split('?')[0]
    // 解析  query
    req.query = querystring.parse(url.split('?')[1])
    


    //解析cookies
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if(!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    console.log('req.cookie is',req.cookie)

     //解析session
     let needSetCookie = false //默认判断需要验证
     let userId = req.cookie.userid
     if(userId){
         if(!SESSION_DATA[userId]) {//如果SESSION_DATA没有这个userid就初始化一个对象
             SESSION_DATA[userId] = {}
         }
         } else{
            needSetCookie = true
             userId= `${Date.now()}_${Math.random()}`
             SESSION_DATA[userId] = {}
         }
         req.session = SESSION_DATA[userId]

         

    //处理postData
    getPostData(req).then(postData => {
        //req.body之前是没有值的
        req.body = postData


        // 处理 blog 路由
        const blogResult = handleBlogRouter(req, res)//执行这个函数，传入req和res。然后内部返回一个对象传给blogData
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {//设置cookie userid
                    res.setHeader('set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        // //处理 user 路由
        // //执行这个函数，传入req和res。然后内部返回一个对象传给userData
        // const userData = handleUserRouter(req, res)
        // //如果有user有值
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }
        
        const userResult = handleUserRouter(req,res)
        if(userResult){
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }



        //未命中路由 ，返回 404
        //text/plain是纯文本，因为之前设置格式是json，需要覆盖设置
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 not Found\n")
        res.end()

    })


}

module.exports = serverHandle
//process.env.NODE_ENV
