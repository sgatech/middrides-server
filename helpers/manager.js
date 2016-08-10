const CONSTANTS = require("../config/constants");

/**
 * Handle general server internal error
 * 
 * res {
 *      error
 * }
 */
function handleError(err, res) {
    console.log(err.message);
    res.status(500).json({
        error: "Internal Server Error"
    });
}

    // /**
    //  * @param: doc
    //  * turns bson format into json
    //  */
    // function getUserFromBson(doc) {
    //     var user = {};
    //     user['_id'] = doc._id;
    //     user['username'] = doc.username;
    //     user['password'] = doc.password;
    //     return user;
    // }

module.exports = {
    handleError
}