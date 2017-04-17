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
        db.collection(CONSTANTS.COLLECTION.STATUS).findOne({
            name: "status"
        }, function(err, doc) {
            if (err) { manager.handleError(err, res); }
            // else if (!doc) {
            //     db.collection(CONSTANTS.COLLECTION.STATUS).insertOne({
            //         name: "status",
            //         running: true
            //     }, function(err, result) {
            //         if (err) { manager.handleError(err, res); return; }
            //         else {
            //             res.status(200).json({
            //                 error: "",
            //                 status: true
            //             });
            //         }
            //     });
            // } 
            else {
                res.status(200).json({
                    error: "",
                    status: doc['running']
                });
            }
        });
    });
    
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
    app.post(CONSTANTS.ROUTES.SHUTDOWN, bodyParser.json(), function(req, res, next) {
        if (req.body.password !== SECRETS.password) {
            res.status(401).json({ error: "Password incorrect" });
            return;
        }

        db.collection(CONSTANTS.COLLECTION.STATUS).updateOne({
            name: "status"
        }, {
            $set: { running: false }
        }, {
            upsert: true
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
    app.post(CONSTANTS.ROUTES.TURNON, bodyParser.json(), function(req, res, next) {
        if (req.body.password !== SECRETS.password) {
            res.status(401).json({ error: "Password incorrect" });
            return;
        }

        db.collection(CONSTANTS.COLLECTION.STATUS).updateOne({
            name: "status"
        }, {
            $set: { running: true }
        }, {
            upsert: true
        }, function(err, result) {
            if (err) { manager.handleError(err, res); return; };
            
            res.status(200).json({
                error: "",
                status: true
            });
        });
    });
    
    /**
     * Login page for dispatcher
     */
    app.get(CONSTANTS.ROUTES.DISPATCHER, function(req, res, next) {
        res.status(200).render(CONSTANTS.VIEWS.LOGIN, {
            title: "MiddRides Dispatcher Login"
        });
    });

    /**
     * Homepage for dispatcher
     */
    app.get(CONSTANTS.ROUTES.PUBSAFE, function(req, res, next) {
        if (req.query.password !== SECRETS.password) {
            console.log("Wrong password");
            res.render(CONSTANTS.VIEWS.LOGIN, {
                title: "MiddRides Dispatcher Login",
                error: "Wrong Password"
            });
            return;
        }

        // first query for server running status
        db.collection(CONSTANTS.COLLECTION.STATUS).findOne({
            name: "status"
        }, function(err, doc) {
            if (err) manager.handleError(err, res)
            else {
                // then find all the stops
                let stops = [];
                let cursor = db.collection(CONSTANTS.COLLECTION.STOP).find();
                cursor.each(function(err, item) {
                    if (item) {
                        stops.push({
                            stopName: item.name,
                            numWaiting: item.waiting.length,
                            stopId: item._id
                        });
                    } else {
                        res.status(200).render(CONSTANTS.VIEWS.INDEX, {
                            title: "MiddRides Dispatcher Portal",
                            running: doc['running'],
                            stops: stops
                        });
                    }
                });
            }
        });
    });
}