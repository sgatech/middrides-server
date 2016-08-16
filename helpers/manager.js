const CONSTANTS = require("../config/constants");
const SECRETS = require("../secret");

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
        if (err) { callback(err, null); }
        else if (!doc) { callback(null, null); }
        else callback(null, getUserFromBsonWithPassword(doc));
    });
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

/**
 * Turns bson user into json with password field
 */
function getUserFromBsonWithPassword(doc) {
    var user = {};
    user['email'] = doc.email;
    user['verified'] = doc.verified;
    user['password'] = doc.password;
    return user;
}

/**
 * Send verification email
 */
function sendVerificationEmail(user, res) {
    var email   = require("emailjs");
    var server  = email.server.connect({
        user:    SECRETS.email.user, 
        password:SECRETS.email.password, 
        host:    "ssmtp.middlebury.edu",
        tls:     true
    });

    // TODO: until we have a server, user['_id']
    var url = "http://tpeterw.github.io";

    var message = {
        from:    "No-reply<" + SECRETS.email.user + ">", 
        to:      user.email,
        subject: "MiddRides Email Verification",
        attachment: 
        [
            { data: "MiddRides: <br><a href=\"" + url + "\">Please click to verify your email</a>", alternative:true }
        ]
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) { 
        console.log(err || message);
        if (res)
            res.status(200).send(err || message);
    });
}

module.exports = {
    handleError,
    findUser,
    createUser,
    sendVerificationEmail
}