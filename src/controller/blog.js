const { exec } = require('../db/mysql')

//获取博客列表数据
const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `//1=1是避免author和key不存在的可能，避免语法报错
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += `order by createtime desc; `

    //返回一个promise
    return exec(sql)

}

//获取博客详情数据
const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}' `
    return exec(sql).then(rows => {//返回一个对象 rows是一个数组
        return rows[0]
    })
}

//新建博客数据
const newBlog = (blogData = {}) => {//没有的话给空对象
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    const sql = `insert into blogs (title,content,createtime,author) 
  values ('${title}','${content}','${createtime}','${author}') `

    return exec(sql).then(insertdata => {
        console.log('inserdata is', insertdata)
        return {
            id: insertdata.insertId
        }
    })
}

//更新博客数据
const updateBlog = (id, blogData = {}) => {
    const title = blogData.title
    const content = blogData.content

    const sql = `update blogs set title='${title}',content='${content}' where id='${id}' `

    return exec(sql).then(updateData => {
        console.log('updataData is', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false

    })

}

//删除博客数据
const delBlog = (id,author) => {
    //id就是要删除博客的id
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    return exec(sql).then(delData => {
        console.log('delData is', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}


module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}