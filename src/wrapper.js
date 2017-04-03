import React from "react";
import ReactDOM from "react-dom";
import CIT from "./CIT";

const showCIT = (metadata, element, callback) => {
    ReactDOM.render(<CIT metadata={metadata} onComplete={callback}/>,
        element);
};

module.exports = showCIT;
