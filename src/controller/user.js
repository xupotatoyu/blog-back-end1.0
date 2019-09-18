const { exec } = require('../db/mysql')


const login = (username, password) => {
    const sql = `select username, realname from users 
    where username='${username}' and password='${password}'`

    // select语句返回的是个数组
    return exec(sql).then(rows => {
        console.log('账号密码 is：',rows)
        return rows[0] || {}
    })
}

module.exports = {
    login
}