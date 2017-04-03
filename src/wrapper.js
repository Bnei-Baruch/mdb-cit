import React from "react";
import ReactDOM from "react-dom";
import {Modal} from "semantic-ui-react";
import CIT from "./CIT";
import "../semantic/dist/semantic.rtl.min.css";

const showCIT = (metadata, element, isModal, callback) => {
    let el;
    if (isModal) {
        el = <Modal defaultOpen closeIcon='close'>
            <Modal.Content>
                <CIT metadata={metadata}/>
            </Modal.Content>
        </Modal>
    } else {
        el = <CIT metadata={metadata} onComplete={callback}/>;
    }
    ReactDOM.render(el, element);
};

module.exports = showCIT;
