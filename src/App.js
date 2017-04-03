import React, {Component} from "react";
import CIT from "./CIT";
import "./App.css";
import logo from "./KL_Tree_64.png";

class App extends Component {

    render() {
        // const metadata = {};
        const metadata = {
            content_type: "LESSON_PART",
            language: "MLT",
            lecturer: "rav",
            has_translation: true,
            part: 1,
        };

        return (
            <div className="app">
                <div className="app-header">
                    <img src={logo} alt="logo"/>
                    <h2>MDB Content Identification Tool</h2>
                </div>
                <br/>
                <div className="app-content">
                    <CIT metadata={metadata}/>
                </div>
            </div>
        );
    }
}

export default App;
