class BaseModel {
    //作用是都可以传数据
    //data是对象类型 message是字符串类型
    constructor(data,message) {
        //如果判定data是string的话
        if(typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }

        if (data){
            this.data = data 
        }
        if(message){
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data,message) {
        super(data, message)//执行父类的构造函数
        this.errno = 0//状态 客户端可以通过errno判断成功还是失败
    }
}

class ErrorModel extends BaseModel {
    constructor(data,message) {
        super(data,message)//执行父类的构造函数
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}