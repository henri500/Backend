const db = require('../helpers/database')



exports.getAll =async function getAll() {
    const query ='SELECT * FROM breeds;'
    const response = await db.run_query(query)
    return response
}
exports.getBreedByName =async function getBreedByName(breedName) {
    const query ='SELECT * FROM breeds WHERE breedName=?;'
    const response = await db.run_query(query,breedName)
    return response
}

exports.addBreed =async function addBreed(breedName) {
    const query ='INSERT INTO breeds SET ?;'
    const response = await db.run_query(query,breedName)
    return response
}


exports.deleteBreed =async function adeleteBreed(id) {
    const query ='DELETE FROM breeds WHERE ID=? ?;'
    const response = await db.run_query(query,id)
    return response
}

exports.updateBreed =async function updateBreed(data) {
    const query ='UPDATE breeds SET ? WHERE ID = ?;'
    const value=[data,data.id]
    const response = await db.run_query(query,values)
    return response
}