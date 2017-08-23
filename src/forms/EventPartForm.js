import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Grid, Header, Input, Label } from 'semantic-ui-react';

import { EMPTY_OBJECT, EVENT_CONTENT_TYPES, EVENT_PART_TYPES, LANGUAGES, LECTURERS } from '../shared/consts';
import { isActive, today } from '../shared/utils';
import { Metadata } from '../shared/shapes';
import FileNamesWidget from '../components/FileNamesWidget';

const getActiveEvents = collections =>
  EVENT_CONTENT_TYPES.reduce((acc, val) =>
      acc.concat((collections.get(val) || []).filter(isActive))
    , []);

class EventPartForm extends Component {

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
      event: 0,
      part_type: 0,
      number: 1,
      language: LANGUAGES[0].value,
      lecturer: LECTURERS[0].value,
      has_translation: true,
      capture_date: today(),
      manual_name: null,
      active_events: [],
      error: null,
    };

    let state           = Object.assign({}, defaultState, props.metadata);
    state.manual_name   = state.manual_name || null;
    state.active_events = getActiveEvents(props.collections);
    if (props.metadata.collection_uid) {
      const idx   = state.active_events.findIndex(x => x.uid === props.metadata.collection_uid);
      state.event = idx > -1 ? idx : 0;
    }
    state = { ...state, ...this.suggestName(state) };

    return state;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.collections !== nextProps.collections) {
      // which event should be selected after filter ?
      let event = this.state.event;
      let cuid;
      if (this.state.active_events.length > 0) {
        // current selection
        cuid = this.state.active_events[event].collection_uid;
      } else {
        // next props
        cuid = nextProps.metadata.collection_uid;
      }

      // filter events
      const activeEvents = getActiveEvents(nextProps.collections);

      // lookup event in filtered list
      if (cuid) {
        const idx = activeEvents.findIndex(x => x.uid === cuid);
        event     = idx > -1 ? idx : 0;
      }

      this.setState({
        active_events: activeEvents,
        event,
        ...this.suggestName({ active_events: activeEvents, event }),
      });
    }
  }

  onSubmit = (e) => {
    if (this.state.error) {
      return;
    }

    const data           = { ...this.state };
    const event          = data.active_events[data.event];
    data.content_type    = EVENT_PART_TYPES[data.part_type].content_type;
    data.collection_uid  = event.uid;
    data.collection_type = event.type;
    data.final_name      = data.manual_name || data.auto_name;
    delete data.event;
    delete data.active_events;
    delete data.error;

    this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
  };

  onCancel = (e) => {
    this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
  };

  onEventChange = (e, data) => {
    this.setState({
      event: data.value,
      ...this.suggestName({ event: data.value }),
    });
  };

  onPartTypeChange = (e, data) => {
    this.setState({
      part_type: data.value,
      ...this.suggestName({ part_type: data.value }),
    });
  };

  onNumberChange = (e, data) => {
    const number = Number.parseInt(data.value, 10);
    if (Number.isNaN(number)) {
      this.setState({
        error: 'שדה מספר לא יכול להכיל אותיות',
        number: 1,
        ...this.suggestName({ number })
      });
    } else if (number < 0) {
      this.setState({
        error: 'שדה מספר חייב להיות גדול מאפס',
        number: 1,
        ...this.suggestName({ number })
      });
    } else {
      this.setState({ number, error: null, ...this.suggestName({ number }) });
    }
  };

  onLanguageChange = (e, data) => {
    this.setState({
      language: data.value,
      ...this.suggestName({ language: data.value }),
    });
  };

  onLecturerChange = (e, data) => {
    this.setState({
      lecturer: data.value,
      ...this.suggestName({ lecturer: data.value }),
    });
  };

  onTranslationChange = (e, data) => {
    this.setState({
      has_translation: data.checked,
      ...this.suggestName({ has_translation: data.checked }),
    });
  };

  onManualEdit = (e, data) => {
    this.setState({ manual_name: data.value });
  };

  suggestName(diff) {
    const {
            event,
            part_type: partType,
            language,
            lecturer,
            has_translation: hasTranslation,
            capture_date: captureDate,
            number,
            active_events: activeEvents,
          } = Object.assign({}, this.state, diff || {});

    let pattern   = '';
    let eventType = '';
    if (activeEvents.length !== 0) {
      const e   = activeEvents[event];
      pattern   = e.properties.pattern;
      eventType = e.type.replace(/_/g, '-');
    }
    // let pattern = active_events.length !== 0 ? active_events[event].properties.pattern : "";

    // eslint-disable-next-line prefer-template
    const name = (hasTranslation ? 'mlt' : language) +
      '_o_' +
      lecturer +
      '_' +
      captureDate +
      '_' +
      eventType +
      '_' +
      EVENT_PART_TYPES[partType].pattern +
      (pattern ? `_${pattern}` : '') +
      '_n' +
      (Number.isNaN(number) ? 1 : number)
    ;

    return {
      pattern,
      auto_name: name.toLowerCase().trim(),
    };
  }

  render() {
    const {
            event,
            part_type: partType,
            number,
            language,
            lecturer,
            has_translation: hasTranslation,
            auto_name: autoName,
            manual_name: manualName,
            active_events: activeEvents,
            error
          }            = this.state;
    const eventOptions = activeEvents.map((x, i) => ({ text: x.name, value: i }));

    return (
      <Grid stackable container>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h2" color="blue">פרטי האירוע</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3} className="bb-interesting">
          <Grid.Column width={9}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">אירועים</Header>
                  <Dropdown
                    selection
                    fluid
                    placeholder={eventOptions.length === 0 ? 'אין אירועים פתוחים' : 'בחר אירוע'}
                    options={eventOptions}
                    value={event}
                    disabled={eventOptions.length === 0}
                    onChange={this.onEventChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column width={10}>
                  <Header as="h5">משבצת תוכן</Header>
                  <Dropdown
                    selection
                    fluid
                    options={EVENT_PART_TYPES.map((x, i) => ({ text: x.text, value: i }))}
                    value={partType}
                    onChange={this.onPartTypeChange}
                  />
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header as="h5">מספר</Header>
                  <Input
                    fluid
                    defaultValue={number}
                    onChange={this.onNumberChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={3} />
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
            {error ? <Label basic color="red" size="large">{error}</Label> : null}
            <Button onClick={this.onCancel}>בטל</Button>
            <Button primary onClick={this.onSubmit}>שמור</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default EventPartForm;
