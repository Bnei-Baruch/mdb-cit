import React, {Component} from "react";
import {Modal} from "semantic-ui-react";
import CIT from "./CIT";

class ModalWrapper extends Component {

    render() {
        return <Modal defaultOpen closeIcon='close'>
        <Modal.Content>
                <CIT {...this.props}/>
            </Modal.Content>
        </Modal>;
    }
}

export default ModalWrapper;