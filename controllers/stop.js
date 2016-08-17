const CONSTANTS = require("../config/constants");
const SECRETS = require("../secret");
const bodyParser = require('body-parser');
const manager = require("../helpers/manager");
const FCM = require("../helpers/fcm");
const fcm = new FCM();

module.exports = function(app, db) {

    /**
     * Check last updated time
     * if earlier than latest server update
     * user will pull again
     * 
     * Method: GET
     * 
     * query {
     *      lastUpdated
     * }
     * 
     * res {
     *      error
     *      [list of locations]
     * }
     */
    app.get(CONSTANTS.ROUTES.SYNC_STOPS, function(req, res, next) {
        db.collection(CONSTANTS.COLLECTION.STATUS).findOne({
            name: "lastUpdated"
        }, function(err, doc) {
            if (err) manager.handleError(err, res);
            else {
                if (req.query.lastUpdated > doc['updatedTime'])
                    res.status(200).json({ hasUpdates: false });
                else {
                    let stops = [];
                    let cursor = db.collection(CONSTANTS.COLLECTION.STOP).find();
                    cursor.each(function(err, item) {
                        if (item != null) {
                            stops.push({
                                name: item['name'],
                                stopId: item['_id']
                            });
                        } else {
                            res.status(200).json({
                                hasUpdates: true,
                                stops: stops
                            })
                        }
                    });
                }
            }
        });
    });

    /**
     * For pubsafe to update locations
     * 
     * Method: POST
     * 
     * body {
     *      password
     *      stop1
     *      stop2
     *      ...
     *      stopX
     * }
     * 
     * res {
     *      error
     *      inserted
     * }
     */
    app.post(CONSTANTS.ROUTES.UPDATE_STOPS, bodyParser.urlencoded({ extended: true }), function(req, res, next) {
        if (req.body.password !== SECRETS.password) {
            res.status(401).json({ error: "Password incorrect" });
            return;
        }

        var stops = [];
        delete req.body['password'];
        for (let key in req.body) {
            stops.push({
                name: req.body[key],
                waiting: []
            });
        }
        db.collection(CONSTANTS.COLLECTION.STOP).deleteMany({}, function(err, result) {
            if (err) manager.handleError(err, res);
            else {
                db.collection(CONSTANTS.COLLECTION.STOP).insertMany(stops, function(err, result) {
                    if (err) manager.handleError(err, res);
                    else {
                        // update lastUpdated time in database
                        db.collection(CONSTANTS.COLLECTION.STATUS).updateOne({
                            name: "lastUpdated"
                        }, {
                            $set: { "updatedTime": new Date().getTime() }
                        }, {
                            upsert: true
                        }, function(err, result) {
                            if (err) manager.handleError(err, res);
                            else {
                                res.status(200).json({
                                    error: "",
                                    inserted: result.insertedCount
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * Make request
     * 
     * Method: POST
     * 
     * body {
     *      email
     *      password
     *      stopId
     * }
     * 
     * res {
     *      error
     * }
     */
    app.post(CONSTANTS.ROUTES.MAKE_REQUEST, bodyParser.urlencoded({ extended: true }), function(req, res, next) {
        manager.findUserByEmail(db, req.body.email, function(err, user) {
            if (err) manager.handleError(err, res);
            else {
                if (user.password !== req.body.password) {
                    res.status(401).json({ error: "Authentication error" });
                    return;
                }
                db.collection(CONSTANTS.COLLECTION.STOP).updateOne({
                    _id: manager.getObjectId(req.body.stopId)
                }, {
                    $push: { waiting:
                        {
                            email: req.body.email,
                            time: new Date().getTime()
                        }
                    }
                }, function(err, result) {
                    if (err) { manager.handleError(err, res); return; }
                    res.status(200).json({ error: "" });
                });
            }
        });
    });

    /**
     * Cancel request
     * 
     * Method: DELETE
     * 
     * body {
     *      email
     *      password
     *      stopId
     * }
     * 
     * res {
     *      error
     * }
     */
    app.delete(CONSTANTS.ROUTES.CANCEL_REQUEST, function(req, res, next) {
        manager.findUserByEmail(db, req.query.email, function(err, user) {
            if (err) manager.handleError(err, res);
            else {
                if (user.password !== req.query.password) {
                    res.status(401).json({ error: "Authentication error" });
                    return;
                }
                db.collection(CONSTANTS.COLLECTION.STOP).updateOne({
                    _id: manager.getObjectId(req.query.stopId)
                }, {
                    $pull: { waiting: 
                        {
                            email: req.query.email 
                        }
                    }
                }, function(err, result) {
                    if (err) { manager.handleError(err, res); return; }
                    res.status(200).json({ error: "" });
                });
            }
        });
    });

    /**
     * Send out fcm arrival notifications
     * 
     * Method: POST
     * 
     * body {
     *      stopId
     * }
     */
    app.post(CONSTANTS.ROUTES.ARRIVE, bodyParser.json(), function(req, res, next) {
        let stopId = req.body.stopId;
        manager.sendVanArrivingFCM(fcm, stopId, function(err) {
            if (err) manager.handleError(err, res);
            else res.end();
        });
    });

}