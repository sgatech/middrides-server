const fcmConfig = require("../secret").FCM_CONFIG;
const request = require("request");

module.exports = class FCM {

    constructor() {
        this.options = {
            url: "https://fcm.googleapis.com/fcm/send",
            method: "POST",
            json: true, // this automatically adds "Content-Type": "application/json" to header
            headers: {
                "Authorization": "key=" + fcmConfig["api_key"]
            }
        };
    }

    /**
     * Sends a request to Google's GCM server to send notifications to devices.
     *
     * @param obj       data to be sent to the users' devices
     * @param to        channel to use (required)
     * @param callback  callback with params (error)
     */
    sendMessage(data, to, callback) {
        this.options.body = {
            to: "/topics/" + to || "/topics/global",
            data: data
        };
        
        console.log("Sending FCM request with body: " + this.options.body.to);
        request(this.options, function(error, response, body) {
            if (error) {
                return callback(error);
            }

            console.log("FCM request finished with response: " + body);
            callback(null);
        });
    }

    /**
     * Sends a notification to Google's GCM server to send notifications to devices.
     *
     * @param data      data to be sent to the users' devices
     * @param notice    notification to be sent to the users' devices
     * @param to        channel to use (required)
     * @param callback  callback with params (error)
     */
    sendNotification(data, notice, to, callback) {
        this.options.body = {
            to: to || "/topics/global",
            data: data,
            notification: notice
        }

        console.log("Sending FCM request with body: " + this.options.headers.Authorization);
        request(this.options, function(error, response, body) {
            if (error) {
                return callback(error);
            }

            console.log("FCM request finished with response: " + body);
            callback(null);
        })
    }

    // body example:
    // { multicast_id: 6984045616502393000,
    //   success: 1,
    //   failure: 0,
    //   canonical_ids: 0,
    //   results: [ { message_id: '0:1467402692743936%7f6d17daf9fd7ecd' } ] }
};