const CONSTANTS = require("../config/constants");
const SECRETS = require("../secret");
const bodyParser = require('body-parser');
const manager = require("../helpers/manager");

module.exports = function(app, db) {

    app.use(bodyParser.urlencoded({ extended: true }));
    
    /**
     * Log into server
     * 
     * Method: POST
     * 
     * res {
     *      error
     *      status
     * }
     */
    app.post(CONSTANTS.ROUTES.LOGIN, function(req, res, next) {
        let email = req.body.email;
        let password = req.body.password;
        manager.findUser(db, email, function(err, user) {
            // internal error
            if (err) manager.handleError(err, res); 
            else {
                // user not found
                if (!user) {
                    console.log("User not found");
                    res.status(404).json({
                        error: "User not found"
                    });
                }
                // password incorrect
                else if (user.password !== password) {
                    res.status(401).json({
                        error: "Password incorrect",
                        user: ""
                    });
                // all good
                } else {
                    res.status(200).json({
                        error: "",
                        user: user
                    });
                }
            }
        });
    });

    /**
     * Register new user
     * 
     * Method: POST
     * 
     * res {
     *      error
     *      status
     * }
     */
    app.post(CONSTANTS.ROUTES.REGISTER, function(req, res, next) {
        let email = req.body.email;
        let password = req.body.password;
        manager.findUser(db, email, function(err, user) {
            // internal error
            if (err) manager.handleError(err, res);
            else {
                // user exists
                if (user) {
                    console.log("User exists");
                    res.status(403).json({
                        error: "User already exists"
                    });
                } else {
                    manager.createUser(db, email, password, function(err, user) {
                        if (err) manager.handleError(err, res);
                        else {
                            if (!user) {
                                res.status(500).json({
                                    error: "Unknown error"
                                });
                            } else {
                                res.status(200).json({
                                    error: "",
                                    user: user
                                });
                            }
                        }
                    });
                }
            }
        });
    });

}