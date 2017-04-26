import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Container} from "semantic-ui-react";
import ModalWrapper from "./ModalWrapper";
// import CIT from "./CIT";

class App extends Component {

    onComplete(data) {
        console.log(data);
        this.onCancel();
    }

    onCancel() {
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
    }

    render() {
        // const metadata = {};
        const metadata = {
            // collection_type: "CONGRESS",
            // content_type: "LESSON_PART",
            // content_type: "MEAL",
            // content_type: "VIDEO_PROGRAM_CHAPTER",
            language: "heb",
            lecturer: "rav",
            has_translation: true,
            // require_test: true,
            // capture_date: "2017-04-11",
            collection_uid: "ukFliiGb",
            episode: "827",
            number: 2,
            // manual_name: "some manual name",
            // sources: ["oYUdhxLb", "DWEMapUM", "lSpiPiaX"],
            // tags: ["7vtV1gDJ", "K9q0p0nq"],
        };

        return <Container>
            <ModalWrapper metadata={metadata}
                                       onComplete={(x) => this.onComplete(x)}
                                       onCancel={(e) => this.onCancel()}/>
            {/*<CIT metadata={metadata} onComplete={(x) => this.onComplete(x)}/>*/}
        </Container>;
    }
}

export default App;
