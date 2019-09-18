const { login } = require('../controller/user')
const {SuccessModel, ErrorModel }= require('../model/resModel')

//获取cookies的过期时间
const getCookieExpires = () =>{
    const d = new Date()
    d.setTime(d.getTime() +(24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is',d.toGMTString())
    return d.toGMTString()//一种时间格式
}


const handleUserRouter = (req,res) => {
    const method =req.method //GET POST
    // const url =req.url
    // const path =url.split('?')[0]

    //登录
    if(method === 'POST' && req.path === '/api/user/login'){
        // const { username, password } = req.body//通过结构的方式取出username和password
        const { username, password } = req.body
        const result = login(username,password)
        return result.then(data => {
            if(data.username) {
                // //操作cookie//设置生效路径为根路由，所有路由都生效//httponly只允许后端修改
                // res.setHeader('set-Cookie',`username=${data.username};path=/;httpOnly;expires=${getCookieExpires()}`)
                
                //设置session
                req.session.username = data.username
                req.session.realname = data.realname
                //同步到 redis
                set(req.sessionId,req.session)
                
               console.log('req.session is ',req.session)
                return new SuccessModel("登录成功")
        }
        return new ErrorModel('登录失败')
    })
}

//登录验证的测试
if(method === 'GET' && req.path === '/api/user/login-test') {
    if(req.session.username) {
        return Promise.resolve(new SuccessModel(req.session))
    }
    return  Promise.resolve(new ErrorModel('尚未登录'))
}
   
}
module.exports = handleUserRouter