import { LOG_IN, LOG_OUT } from "./types";

function logIn() {
    return {
        type: LOG_IN,
        payload:{
            userInfo,
            isLoggedIn
        }
    };
}

function logOut() {
    return {
        type: LOG_OUT
    };
}

const actionCreators = {
    logIn,
    logOut
};

export {actionCreators};

