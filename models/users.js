const db = require('../helpers/database');
const bcrypt = require('bcrypt');

//list all the users in the database
exports.getAll = async function getAll(page,limit,order) {
    /**
     * @param {number} page The pagenumber
     * @param {number} limit Amount of resulys per poge
     * @param {string} order asc by default can be : asc or dsc 
     * @returns {object} data The data  return from the database query
     */
    const query = "SELECT ID,firstName,lastName,username,email,avatarURL, roleID,centerID  FROM users;";
    const data = await db.run_query(query);
    return data;
}

//get a single user by the id
exports.getUserID =async function getUserID(id) {
    /**
     * @param {number} id The ID column/ primary for database query
     * @returns {object} user . User object retrieved from database
     */
    const query = "SELECT  ID,firstName,lastName,username,email,avatarURL, roleID,centerID FROM users WHERE ID =?;"
    // const query = "SELECT * FROM users WHERE ID =?;"
    const user =  await db.run_query(query,id)
    return user

}
// get user by username (unique)
exports.findByUsername= async function findByUsername(username) {
    /**
     * @param {string} username The usename to serach for (unique)
     * @returns {object} response The user object found in database if any
     */
    const query ="SELECT * FROM users WHERE username=?"
    const response =db.run_query(query,username)
    return response
    
}
//create a new user in the database
exports.addUser =async function addUser(user) {
    /**
     * @param {object} user The user object to be added to the database
     * @returns {(number|object)} response  0 if user already exist. If not confirmation message object is returned
     */
    //checking if user exist already:
    const rep1 = "SELECT * FROM users WHERE username=? or email=?"
    const exist =await db.run_query(rep1,[user.username,user.email])
    if (exist.length) {
        return 0
    }
    const query = "INSERT INTO users SET ?;"
    // hashing password:
    const password =user.passwordHash
    const hash = bcrypt.hashSync(password,11)
    user.passwordHash=hash
    const response = await db.run_query(query,user)
    return response
}
// delete user by id
exports.deleteUser = async function deleteUser(ID){
    /**
     * @param {number} ID id of record to be deleted
     * @returns {object} confirmation message of operation
     */
    const query = "DELETE FROM users WHERE ID=?"
    const deleted = await db.run_query(query,ID)
    return deleted
}


exports.updateUser = async function updateUser(user) {
    /**
     * @param {object} user Object contaiining fields and vlaues to be populated in the database
     * @returns {object} confirmation message of operation
    */
    const password =user.passwordHash
    const hash = bcrypt.hashSync(password,11)
    user.passwordHash=hash
    const query = "UPDATE users SET ? WHERE ID = ?;";
    const values = [user,user.ID]
    const data = await db.run_query(query, values);
    return data  
}