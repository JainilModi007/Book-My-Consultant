import React from "react";


const Context = React.createContext({
	notification: {
		isRequested: false,
		request: () => {},
		setDetails: (title, message) => {},
		severity: "",
		message: "",
	},
    auth: {
        isLoggedIn: false,
        login: (email, password) => {},
        logout: () => {},
		validateResponse: () => {}
    }
});

export default Context;
