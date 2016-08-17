var bodyParser = require('body-parser');
var logger = require('morgan');
var glob = require('glob');
var favicon = require('serve-favicon');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var db, server;

module.exports = function (app, config) {
    app.use(logger('dev'));

    // connect to databse
    var url = config.db;
    MongoClient.connect(url, function(err, database) {
        if (err) {
            console.log(err.message);
            return;
        } else {
            db = database;
            const controllers = glob.sync(config.root + '/controllers/*.js');
            controllers.forEach(controller => {
                require(controller)(app, db);
                // import {default as func} from controller

                console.log(">> Deployed controller: " + controller + "\n");
                // This means "for each controller file, load that file using require, then
                // call the default function that's exported, with app as a parameter.
                // Those default functions just say 'hey app, use these routes.'"
            });
            
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            
            // external module for handling favourite icon
            app.use(favicon(__dirname + "/../public/img/favicon.ico"));
            
            // view engine
            app.set('views', config.root + '/public/views');
            app.set("view engine", "pug");
            
            // middleware for handling file downloads
            app.get("*", function(req, res, next) {
                if (fs.existsSync(config.root + req.url)) {
                    let file = config.root + req.url;
                    res.download(file);
                } else {
                    const err = new Error("Not Found");
                    res.status(404);
                    next(err);
                }
            });

            // middlewares for handling uncaught errors
            app.use((req, res, next) => {
                const err = new Error("Not Found");
                res.status(404);
                next(err);
            });

            app.use((err, req, res, next) => {
                console.log(err);
                res.status(err.status || 500);
                res.json({ error: error.message });
            });


            // listening on port 3000
            server = app.listen(3000, function () { 
                console.log("Server listening on port 3000...\n");
            });
        }
    });

    // when ^C is pressed
    process.on('SIGINT', function() {
        const readline = require('readline');
        readline.clearLine(process.stdout, 0);
        
        console.log("\nDisconnecting from database...");
        db.close();

        console.log("Killing server...");
        server.close();

        console.log("Bye!");
        process.exit(0);
    })
}
