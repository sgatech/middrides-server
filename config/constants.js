const ROUTES = {
    INDEX: "/",
    SHUTDOWN: "/shutdown",
    TURNON: "/turnon",
    LOGIN: "/login",
    REGISTER: "/register",
    SYNC_USER: "/sync",
    CHANGE_PASSWORD: "/changepwd",
    SYNC_STOPS: "/stops",        // user pull
    UPDATE_STOPS: "/update",        // pubsafe push
    MAKE_REQUEST: "/request",
    CANCEL_REQUEST: "/cancel",
    SEND: "/send",                      // send verification email
    ARRIVE: "/arrive",                  // arrive notification
    VERIFY: "/verify",
    DISPATCHER: "/dispatcher"
};

const VIEWS = {
    INDEX: "index"
};

const COLLECTION = {
    STATUS: "status",
    USER: "user",
    STOP: "stop"
};

const CONSTANTS = {
    ROUTES: ROUTES,
    VIEWS: VIEWS,
    COLLECTION: COLLECTION
};

module.exports = CONSTANTS;