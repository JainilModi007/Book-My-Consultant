import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Controller from "./screens/Controller";
import AppContextProvider from "./screens/context/AppContextProvider";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<AppContextProvider> <Controller /> </AppContextProvider>, document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();