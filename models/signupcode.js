const db = require('../helpers/database');


exports.addCode = async function addCode(code) {
    const query = "INSERT  INTO codes SET ?;"
    const response = await db.run_query(query,code)
    return response
}

exports.deleteCode = async function deleteCode(code) {
    let query = "DELETE  FROM  codes  WHERE code=?;"
    let response = await db.run_query(query,code)
    return response
}


exports.getCodes= async function getCodes() {
    let query= "SELECT * FROM codes "
    let response= await db.run_query(query)
    return response
}
exports.getCode= async function getCode(code) {
    let query= "SELECT * FROM codes WHERE code=?;"
    let response= await db.run_query(query,code)
    if (response.length) {
        return response
    }
    return 0
}