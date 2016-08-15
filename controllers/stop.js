const CONSTANTS = require("../config/constants");
const SECRETS = require("../secret");
const bodyParser = require('body-parser');
const manager = require("../helpers/manager");

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
    app.get(CONSTANTS.ROUTES.SYNC_LOCATIONS, function(req, res, next) {
        db.collection(CONSTANTS.COLLECTION.STATUS).findOne({
            name: "lastUpdated"
        }, function(err, doc) {
            if (err) manager.handleError(err, res);
            else {
                if (req.query.lastUpdated > doc['updatedTime'])
                    res.status(200).json({ hasUpdates: false });
                else {
                    // TODO: find all the stops
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

    app.use(bodyParser.urlencoded({ extended: true }));

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
    app.post(CONSTANTS.ROUTES.UPDATE_LOCATIONS, function(req, res, next) {
        if (req.body.password !== SECRETS.password) {
            res.status(401).json({ error: "Password incorrect" });
            return;
        }

        var stops = [];
        delete req.body['password'];
        for (let key in req.body) {
            stops.push({
                name: req.body[key],
                waiting: 0
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

}