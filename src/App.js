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
    const metadata = {

      // auto_name: 'mlt_o_rav_2017-09-16_congress_lesson_georgia_n5_p1',
      capture_date: '2017-09-16',
      // label_id: '2839',
      // film_date: '2010-09-16',
      // collection_type: 'CONGRESS',
      // collection_uid: 'iycyvtch',
      content_type: 'MEAL',
      // content_type: 'LESSON_PART',
      // final_name: 'mlt_o_rav_2017-09-16_congress_lesson_georgia_n5_p1',
      // hag: 'Shabbat',
      // has_translation: true,
      // holiday: true,
      // language: 'rus',
      // lecturer: 'rav',
      // lid: 'c1505584051481',
      // major: { idx: 0, type: 'tag' },
      // manual_name: null,
      number: 5,
      // part: 1,
      // part_type: 0,
      // pattern: 'georgia',
      // require_test: false,
      // tags: ['B28Zq6aA'],
      // week_date: '2017-09-15',
      // artifact_type: 'LELO_MIKUD',
      // artifact_type: 'KITEI_MAKOR',
    };
    // const metadata = {
    //   // collection_type: "CONGRESS",
    //   // content_type: "FULL_LESSON",
    //   // content_type: 'LESSON_PART',
    //   // content_type: "VIRTUAL_LESSON",
    //   // content_type: "MEAL",
    //   content_type: 'UNKNOWN',
    //   // content_type: "VIDEO_PROGRAM_CHAPTER",
    //   language: 'heb',
    //   lecturer: 'rav',
    //   has_translation: true,
    //   // require_test: true,
    //   // capture_date: "2017-04-11",
    //   // collection_uid: "ukFliiGb",
    //   episode: '827',
    //   number: 2,
    //   part: 0,
    //   part_type: 0,
    //   // manual_name: "some manual name",
    //   sources: ['PW905OyJ', 'av4R4Ve6', 'jRNM0kiY'],
    //   // tags: null,
    //   // tags: ['SuqPuYoZ', 'XuTr8IEN'],
    //   // major: {
    //   //   type: 'tag',
    //   //   idx: 1
    //   // }
    // };

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
