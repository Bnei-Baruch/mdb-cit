import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Grid, Header } from 'semantic-ui-react';

import { CONTENT_TYPES_MAPPINGS, CT_FULL_LESSON, EMPTY_OBJECT, LANGUAGES, LECTURERS } from '../shared/consts';
import { today } from '../shared/utils';
import { Metadata } from '../shared/shapes';
import FileNamesWidget from '../components/FileNamesWidget';

class GenericContentForm extends Component {

  static propTypes = {
    metadata: Metadata,  // eslint-disable-line react/no-unused-prop-types
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  static defaultProps = {
    metadata: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    // This should be created a new every time or deep copied...
    const defaultState = {
      language: LANGUAGES[0].value,
      lecturer: LECTURERS[0].value,
      has_translation: true,
      capture_date: today(),
      manual_name: null,
    };
    const state        = Object.assign({}, defaultState, props.metadata);
    state.manual_name  = state.manual_name || null;
    state.auto_name    = this.suggestName(state);
    return state;
  }

  onSubmit = (e) => {
    const data           = { ...this.state };
    data.pattern         = data.content_type.toLowerCase();
    data.final_name      = data.manual_name || data.auto_name;
    data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;

    this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
  };

  onCancel = (e) => {
    this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
  };

  onLanguageChange = (e, data) => {
    this.setState({
      language: data.value,
      auto_name: this.suggestName({ language: data.value }),
    });
  };

  onLecturerChange = (e, data) => {
    this.setState({
      lecturer: data.value,
      auto_name: this.suggestName({ lecturer: data.value }),
    });
  };

  onTranslationChange = (e, data) => {
    this.setState({
      has_translation: data.checked,
      auto_name: this.suggestName({ has_translation: data.checked }),
    });
  };

  onManualEdit = (e, data) => {
    this.setState({ manual_name: data.value });
  };

  suggestName(diff) {
    const {
            language,
            lecturer,
            has_translation: hasTranslation,
            capture_date: captureDate,
            content_type: contentType,
            number
          } = Object.assign({}, this.state, diff || {});

    // eslint-disable-next-line prefer-template
    const name = (hasTranslation ? 'mlt' : language) +
      '_o_' +
      lecturer +
      '_' +
      captureDate +
      '_' +
      CONTENT_TYPES_MAPPINGS[contentType].pattern +
      '_n' +
      (number || 1) +
      (contentType === CT_FULL_LESSON ? '_full' : '');

    return name.toLowerCase().trim();
  }

  render() {
    const {
            language,
            lecturer,
            has_translation: hasTranslation,
            auto_name: autoName,
            manual_name: manualName
          } = this.state;

    return (
      <Grid stackable container>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h2" color="blue">פרטי התוכן</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3} className="bb-interesting">
          <Grid.Column width={4}>
            <Header as="h5">שפה</Header>
            <Dropdown
              selection
              fluid
              options={LANGUAGES}
              value={language}
              onChange={this.onLanguageChange}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Header as="h5">מרצה</Header>
            <Dropdown
              selection
              fluid
              options={LECTURERS}
              value={lecturer}
              onChange={this.onLecturerChange}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Checkbox
              label="מתורגם"
              checked={hasTranslation}
              onChange={this.onTranslationChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <FileNamesWidget
              auto_name={autoName}
              manual_name={manualName}
              onChange={this.onManualEdit}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1} textAlign="right">
          <Grid.Column>
            <Button
              content="אפס בחירה"
              color="orange"
              icon="trash outline"
              floated="left"
              onClick={this.props.onClear}
            />
            <Button onClick={this.onCancel}>בטל</Button>
            <Button primary onClick={this.onSubmit}>שמור</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default GenericContentForm;
