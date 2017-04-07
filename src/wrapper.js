import React from "react";
import ReactDOM from "react-dom";
import ModalWrapper from "./ModalWrapper";
import CIT from "./CIT";

import "../semantic/dist/semantic.rtl.min.css";

const MdbCIT = (options) => {
    const {metadata, modal, element, onComplete, onCancel} = Object.assign({}, options);

    if (modal) {
        const unmountModal = () => ReactDOM.unmountComponentAtNode(element),
            onCompleteWrapper = (x) => {
                if (onComplete) {
                    onComplete(x);
                }
                unmountModal();
            },
            onCancelWrapper = (x) => {
                if (onCancel) {
                    onCancel(x);
                }
                unmountModal();
            };

        ReactDOM.render(<ModalWrapper metadata={metadata}
                                      onComplete={onCompleteWrapper}
                                      onCancel={onCancelWrapper}/>,
            element);
    } else {
        ReactDOM.render(<CIT metadata={metadata} onComplete={onComplete}/>, element);
    }
};

module.exports = MdbCIT;
