const http= require('http')

const PORT = 8000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)//服务参数在app.js中

server.listen(PORT)

//进行拆封，将端口及创建server服务放在www.js中