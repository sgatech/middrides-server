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

/**
 * Find user in database
 */
function findUser(db, email, callback) {
    db.collection(CONSTANTS.COLLECTION.USER).findOne({
        email: email
    }, function(err, doc) {
        if (err) {
            console.log(err.message);
            callback(err, null);
            return;
        }
        if (!doc) {
            callback(null, null);
            return;
        }
        
        callback(null, getUserFromBson(doc));
    })
}

/**
 * Create user in database
 */
function createUser(db, email, password, callback) {
    db.collection(CONSTANTS.COLLECTION.USER).insertOne({
        email: email,
        password: password,
        verified: false
    }, function(err, result) {
        if (err) callback(err, null);       // back to router for handling
        else {
            findUser(db, email, function(err, user) {
                if (err) callback(err, null);
                else callback(err, getUserFromBson(user));
            });
        }
    });
}

/**
 * Turns bson user into json
 */
function getUserFromBson(doc) {
    var user = {};
    user['email'] = doc.email;
    user['verified'] = doc.verified;
    return user;
}

module.exports = {
    handleError,
    findUser,
    createUser
}