const db = require('../helpers/database');

// getting all centers
exports.getAllCenters =async function getAll(params) {
    const query = "SELECT * FROM centers;"
    const response=await db.run_query(query)
    return response
}
exports.getCenter =async function getCenter(id) {
    const query = "SELECT * FROM centers WHERE ID=?;"
    const response=await db.run_query(query,id)
    return response
}
exports.getCenterByNameAndAddress =async function getCenterByNameAndAddress(data) {
    const query = "SELECT * FROM centers WHERE centerName=? AND centerAddress=?;"
    const values = [data.centerName,data.centerAddress]
    const response=await db.run_query(query,values)
    return response
}
exports.addCenter =async function addCenter(data) {
    const query = "INSERT INTO centers SET ?;"
    const response=await db.run_query(query,data)
    return response
}

exports.deleteCenter =async function deleteCenter(id) {
    const query = "DELETE FROM centers WHERE ID=?;"
    const response=await db.run_query(query,id)
    return response
}
exports.updateCenter =async function updateCenter(data) {
    const query = "UPDATE centers SET ? WHERE ID = ?;"
    const values = [data,data.ID]
    const response=await db.run_query(query,values)
    return response
}



