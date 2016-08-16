const ROUTES = {
    INDEX: "/",
    SHUTDOWN: "/shutdown",
    TURNON: "/turnon",
    LOGIN: "/login",
    REGISTER: "/register",
    CHANGE_PASSWORD: "/changepwd",
    SYNC_LOCATIONS: "/location",        // user pull
    UPDATE_LOCATIONS: "/update",        // pubsafe push
    MAKE_REQUEST: "/request",
    CANCEL_REQUEST: "/cancel",
    SEND: "/send",                      // send verification email
    ARRIVE: "/arrive"                   // arrive notification
};

const COLLECTION = {
    STATUS: "status",
    USER: "user",
    STOP: "stop"
};

const CONSTANTS = {
    ROUTES: ROUTES,
    COLLECTION: COLLECTION
};

module.exports = CONSTANTS;