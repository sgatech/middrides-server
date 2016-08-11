const CONSTANTS = require("../config/constants");
const SECRETS = require("../secret");
const bodyParser = require('body-parser');
const manager = require("../helpers/manager");

module.exports = function(app, db) {

    /**
     * Queries database and
     * return server running status
     * 
     * Method: GET
     * 
     * res {
     *      error
     *      status
     * }
     */
    app.get(CONSTANTS.ROUTES.INDEX, function(req, res, next) {
        db.collection(CONSTANTS.COLLECTIONS.STATUS).findOne({
            name: "status"
        }, function(err, doc) {
            if (err) { manager.handleError(err, res); return; };

            if (!doc) {
                db.collection(CONSTANTS.COLLECTIONS.STATUS).insertOne({
                    name: "status",
                    running: true
                }, function(err, result) {
                    if (err) { manager.handleError(err, res); return; }
                    else {
                        res.status(200).json({
                            error: "",
                            status: true
                        });
                    }
                });
            } else {
                res.status(200).json({
                    error: "",
                    status: doc['running']
                });
            }
        });
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    
    /**
     * Shuts down server
     * 
     * Method: POST
     * 
     * res {
     *      error
     *      status
     * }
     */
    app.post(CONSTANTS.ROUTES.SHUTDOWN, function(req, res, next) {
        if (req.body.password !== SECRETS.password) {
            res.status(401).json({
                error: "Password incorrect"
            });
            return;
        }

        db.collection(CONSTANTS.COLLECTIONS.STATUS).updateOne({
            name: "status",
        }, {
            $set: { running: false }
        }, function(err, result) {
            if (err) { manager.handleError(err, res); return; };
            
            res.status(200).json({
                error: "",
                status: false
            });
        });
    });

    /**
     * Turn on server
     * 
     * Method: POST
     * 
     * res {
     *      error
     *      status
     * }
     */
    app.post(CONSTANTS.ROUTES.TURNON, function(req, res, next) {
        if (req.body.password !== SECRETS.password) {
            res.status(401).json({
                error: "Password incorrect"
            });
            return;
        }

        db.collection(CONSTANTS.COLLECTIONS.STATUS).updateOne({
            name: "status",
        }, {
            $set: { running: true }
        }, function(err, result) {
            if (err) { manager.handleError(err, res); return; };
            
            res.status(200).json({
                error: "",
                status: true
            });
        });
    });
}