import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Grid, Header, Input } from 'semantic-ui-react';

import { CONTENT_TYPES_MAPPINGS, EMPTY_OBJECT, LANGUAGES, LECTURERS, MDB_LANGUAGES } from '../shared/consts';
import { isActive, today } from '../shared/utils';
import { Metadata } from '../shared/shapes';
import FileNamesWidget from '../components/FileNamesWidget';

const getCollections = (collections, type) =>
  collections.get(CONTENT_TYPES_MAPPINGS[type].collection_type) || [];

const getActiveCollections = (collections, type) =>
  getCollections(collections, type)
    .filter(isActive)
    .concat([{ name: 'אחר', uid: null, properties: { default_language: 'he', pattern: null } }]);

class VirtualLessonForm extends Component {

  static propTypes = {
    metadata: Metadata,
    collections: PropTypes.instanceOf(Map),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  static defaultProps = {
    metadata: EMPTY_OBJECT,
    collections: new Map(),
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
      require_test: false,
      vl: 0,
      topic: '',
      manual_name: null,
      active_vls: [],
    };
    const state        = Object.assign({}, defaultState, props.metadata);
    state.manual_name  = state.manual_name || null;

    // filter collections and lookup specified show
    state.active_vls = getActiveCollections(props.collections, props.metadata.content_type);
    if (props.metadata.collection_uid) {
      const idx = state.active_vls.findIndex(x => x.uid === props.metadata.collection_uid);
      state.vl  = idx > -1 ? idx : 0;
    }

    // adjust show's default language
    if (state.active_vls.length > state.vl) {
      const defaultLang = state.active_vls[state.vl].properties.default_language;
      if (defaultLang) {
        state.language = MDB_LANGUAGES[defaultLang];
      }
    }

    state.auto_name = this.suggestName(state);
    return state;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.collections !== nextProps.collections) {
      // which collection should be selected after filter ?
      let vl       = this.state.vl;
      let language = this.state.language;
      let cuid;
      if (this.state.active_vls.length > 0) {
        // current selection
        cuid = this.state.active_vls[vl].collection_uid;
      } else {
        // next props
        cuid = nextProps.metadata.collection_uid;
      }

      // filter shows
      const activeVLs = getActiveCollections(nextProps.collections, nextProps.metadata.content_type);

      // lookup show in filtered list
      if (cuid) {
        const idx = activeVLs.findIndex(x => x.uid === cuid);
        vl        = idx > -1 ? idx : 0;
      }

      // adjust show's default language
      if (activeVLs.length > vl) {
        const defaultLang = activeVLs[vl].properties.default_language;
        if (defaultLang) {
          language = MDB_LANGUAGES[defaultLang];
        }
      }

      this.setState({
        active_vls: activeVLs,
        vl,
        language,
        auto_name: this.suggestName({ active_vls: activeVLs, vl, language })
      });
    }
  }

  onSubmit = (e) => {
    const data           = { ...this.state };
    data.collection_uid  = data.active_vls[data.vl].uid;
    data.pattern         = data.active_vls[data.vl].properties.pattern;
    data.final_name      = data.manual_name || data.auto_name;
    data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;
    delete data.topic;
    delete data.vl;
    delete data.active_vls;

    this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
  };

  onCancel = (e) => {
    this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
  };

  onVLChange = (e, data) => {
    const vl         = data.value;
    const collection = this.state.active_vls[vl];
    let language     = this.state.language;
    if (collection.properties.default_language) {
      language = MDB_LANGUAGES[collection.properties.default_language];
    }
    this.setState({ vl, language, auto_name: this.suggestName({ vl, language }) });
  };

  onTopicChange = (e, data) => {
    const clean = data.value.trim().toLowerCase().replace(/[^0-9a-z]+/g, '-');
    this.setState({ topic: clean, auto_name: this.suggestName({ topic: clean }) });
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

  onRequireTestChange = (e, data) => {
    this.setState({ require_test: data.checked });
  };

  onManualEdit = (e, data) => {
    this.setState({ manual_name: data.value });
  };

  suggestName(diff) {
    const {
            content_type: contentType,
            vl,
            topic,
            language,
            lecturer,
            has_translation: hasTranslation,
            active_vls: activeVLs,
            capture_date: captureDate,
          } = Object.assign({}, this.state, diff || {});

    const collection = activeVLs[vl];

    // eslint-disable-next-line prefer-template
    const name = (hasTranslation ? 'mlt' : language) +
      '_o_' +
      lecturer +
      '_' +
      captureDate +
      '_' +
      CONTENT_TYPES_MAPPINGS[contentType].pattern +
      (collection && collection.properties.pattern !== null ? `_${collection.properties.pattern}` : '') +
      (topic ? `_${topic}` : '');

    return name.toLowerCase().trim();
  }

  render() {
    const {
            vl,
            topic,
            language,
            lecturer,
            has_translation: hasTranslation,
            require_test: requireTest,
            auto_name: autoName,
            manual_name: manualName,
            active_vls: activeVLs,
          } = this.state;

    return (
      <Grid stackable container>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h2" color="blue">פרטי השיעור</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3} className="bb-interesting">
          <Grid.Column width={10}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">אוסף</Header>
                  <Dropdown
                    selection
                    fluid
                    options={activeVLs.map((x, i) => ({ text: x.name, value: i }))}
                    value={vl}
                    onChange={this.onVLChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">נושא</Header>
                  <Input
                    fluid
                    defaultValue={topic}
                    onChange={this.onTopicChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={2} />
          <Grid.Column width={4}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">שפה</Header>
                  <Dropdown
                    selection
                    fluid
                    options={LANGUAGES}
                    value={language}
                    onChange={this.onLanguageChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">מרצה</Header>
                  <Dropdown
                    selection
                    fluid
                    options={LECTURERS}
                    value={lecturer}
                    onChange={this.onLecturerChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Checkbox
                    label="מתורגם"
                    checked={hasTranslation}
                    onChange={this.onTranslationChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Checkbox
                    label="צריך בדיקה"
                    checked={requireTest}
                    onChange={this.onRequireTestChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
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

export default VirtualLessonForm;
