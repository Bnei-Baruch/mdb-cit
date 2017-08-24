import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Grid, Header, Icon, Input, Label, List } from 'semantic-ui-react';

import {
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  EVENT_CONTENT_TYPES,
  EVENT_PART_TYPES,
  LANGUAGES,
  LECTURERS
} from '../shared/consts';
import { findPath, isActive, today } from '../shared/utils';
import { Metadata, TagsTree } from '../shared/shapes';
import FileNamesWidget from '../components/FileNamesWidget';
import TagSelector from '../components/TagSelector';

const getActiveEvents = collections =>
  EVENT_CONTENT_TYPES.reduce((acc, val) =>
      acc.concat((collections.get(val) || []).filter(isActive))
    , []);

class EventPartForm extends Component {

  static propTypes = {
    metadata: Metadata,
    availableTags: TagsTree,
    collections: PropTypes.instanceOf(Map),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  static defaultProps = {
    metadata: EMPTY_OBJECT,
    availableTags: EMPTY_ARRAY,
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
      tags: [],
      major: {},
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
    state.tags = props.availableTags.length > 0 ?
      state.tags.map(x => findPath(props.availableTags, x)) : [];
    state      = { ...state, ...this.suggestName(state) };

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

    if (nextProps.availableTags.length > 0 &&
      nextProps.metadata.tags &&
      this.props.availableTags !== nextProps.availableTags) {
      const tags = nextProps.metadata.tags.map(x => findPath(nextProps.availableTags, x));
      this.setStateAndName({ tags });
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
    data.tags            = data.tags.map(x => x[x.length - 1].uid);
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

  onTagClick(idx) {
    const major = this.updateMajor('SET', 'tag', idx);
    this.setState({
      major,
      ...this.suggestName({ major }),
    });
  }

  addTag = (selection) => {
    const { tags } = this.state;

    // Prevent duplicates
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].length === selection.length && tags[i].every((x, j) => selection[j] === x)) {
        return;
      }
    }

    tags.push(selection);
    const major = this.updateMajor('ADD', 'tag', tags.length - 1);
    this.setState({
      tags,
      major,
      error: null,
      ...this.suggestName({ tags, major }),
    });
  };

  removeTag(e, idx) {
    e.stopPropagation(); // don't bubble up to onTagClick

    const tags  = this.state.tags;
    const major = this.updateMajor('REMOVE', 'tag', idx);

    tags.splice(idx, 1);
    this.setState({
      tags,
      major,
      ...this.suggestName({ tags, major }),
    });
  }

  // this method was copy pasted from LessonForm
  // so it was designed to work with both sources and tags.
  // here we have only tags.
  updateMajor(op, type, idx) {
    let major = this.state.major;

    switch (op) {
    case 'SET':
      major = { type, idx };
      break;
    case 'ADD':
      if (!major.type) {
        major = { type, idx };
      }
      break;
    case 'REMOVE':
      // If the currently selected major is removed,
      // pass the torch to the next best option.
      // Else keep the index in sync.
      if (major.type === type) {
        if (major.idx !== idx && idx < major.idx) {
          major.idx--;    // we've been shifted left...
        } else if (major.idx === idx) {
          const selection = this.state[`${type}s`];
          if (selection.length > 1) {
            // keep it in the family
            major = { type, idx: Math.max(0, idx - 1) };
          } else {
            // // try the other type
            // const type2 = type === 'source' ? 'tag' : 'source';
            // selection   = this.state[`${type2}s`];
            // if (selection.length > 0) {
            //   major = { type: type2, idx: 0 };
            // } else {
            // no replacement
            major = {};
            // }
          }
        }
      }
      break;
    default:
      break;
    }

    return major;
  }

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

  renderSelectedTags() {
    const { tags, major } = this.state;

    if (tags.length === 0) {
      return (
        <List className="bb-selected-tags-list">
          <List.Item>
            <Header as="h5" color="grey">אין תגיות</Header>
          </List.Item>
        </List>
      );
    }

    return (
      <div className="bb-selected-tags-list">
        {
          tags.map((x, i) => {
            const isMajor = major.type === 'tag' && major.idx === i;
            return (
              <Label
                color="pink"
                size="large"
                basic={!isMajor}
                key={x[x.length - 1].id}
                onClick={() => this.onTagClick(i)}
              >
                {x[x.length - 1].label}
                <Icon name="delete" onClick={e => this.removeTag(e, i)} />
              </Label>
            );
          })
        }
      </div>
    );
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

    const { availableTags } = this.props;

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
              <Grid.Row>
                <Grid.Column>
                  <Header size="medium">תגיות</Header>
                  <TagSelector tree={availableTags} onSelect={this.addTag} />
                  {this.renderSelectedTags()}
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
