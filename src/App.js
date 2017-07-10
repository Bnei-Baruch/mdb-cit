import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'semantic-ui-react';

import ModalWrapper from './ModalWrapper';
// import CIT from "./CIT";

const unmount = () => ReactDOM.unmountComponentAtNode(document.getElementById('root'));

class App extends Component {

  onComplete = (data) => {
    console.log(data);
    unmount();
  };

  render() {
    // const metadata = {};
    const metadata = {
      // collection_type: "CONGRESS",
      // content_type: "FULL_LESSON",
      content_type: 'LESSON_PART',
      // content_type: "VIRTUAL_LESSON",
      // content_type: "MEAL",
      // content_type: "UNKNOWN",
      // content_type: "VIDEO_PROGRAM_CHAPTER",
      language: 'heb',
      lecturer: 'rav',
      has_translation: true,
      // require_test: true,
      // capture_date: "2017-04-11",
      // collection_uid: "ukFliiGb",
      episode: '827',
      number: 2,
      part: 0,
      part_type: 0,
      // manual_name: "some manual name",
      sources: ['PW905OyJ', 'av4R4Ve6', 'jRNM0kiY'],
      tags: ['SuqPuYoZ', 'XuTr8IEN'],
      major: {
        type: 'tag',
        idx: 1
      }
    };

    return (
      <Container>
        <ModalWrapper
          metadata={metadata}
          onComplete={this.onComplete}
          onCancel={unmount}
        />
        {/* <CIT metadata={metadata} onComplete={(x) => this.onComplete(x)}/> */}
      </Container>
    );
  }
}

export default App;
