import { LOG_IN, LOG_OUT } from "./types";

logIn = () => {
    return {
        type: LOG_IN,
        payload:{
            userInfo,
            isLoggedIn
        }
    };
}

logOut = () => {
    return {
        type: LOG_IN,
        payload:{
            userInfo,
            isLoggedIn
        }
    };
}
const actionCreators = {
    logIn,
    logOut
};

export {actionCreators};

