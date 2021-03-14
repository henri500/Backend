const bcrypt = require('bcrypt')
const users = require('../models/users')
const BasicStrategy = require('passport-http').BasicStrategy

const checkPass =  async function (user,password){
    /**
     * @param {object} user 
     * @param {string} password 
     * @return {boolean} boolean if password matches
     */
    const isMatch =bcrypt.compareSync(password,user.passwordHash)
    return isMatch
}

const checkUserAndPass = async  (username,password,done)=>{
    /**
     * @param {string} username 
     * @param {string} password
     * @returns {object} error or the user, depending on outcome
     */
    let result 
    try {
        result = await users.findByUsername(username);
    } catch (error) {
        console.error(`Error during authentication for user ${username}`)
        return done(error)
    }
    if (result.length){
        const user = result[0];
        //console.log(result[0])
        if (await checkPass(user, password)) {
            console.log(`Successfully authenticated user ${username}`)
            return done(null, user)
        } else {
            console.log(`Password incorrect for user ${username}`)
        }
    }else{
    }
    return done(null, false)
}
const strategy = new BasicStrategy(checkUserAndPass)
module.exports = strategy