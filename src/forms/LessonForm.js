import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Grid, Header, Icon, Label, List } from 'semantic-ui-react';

import {
  ARTIFACT_TYPES,
  CONTENT_TYPES_MAPPINGS,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  LANGUAGES,
  LECTURERS,
  LESSON_PARTS_OPTIONS
} from '../shared/consts';
import { findPath, today } from '../shared/utils';
import { Metadata, SourcesTree, TagsTree } from '../shared/shapes';
import SourceSelector from '../components/SourceSelector';
import TagSelector from '../components/TagSelector';
import FileNamesWidget from '../components/FileNamesWidget';
import CassetteDayPicker from '../components/CassetteDayPicker';

class LessonForm extends Component {

  static propTypes = {
    metadata: Metadata,
    availableSources: SourcesTree,
    availableTags: TagsTree,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  static defaultProps = {
    metadata: EMPTY_OBJECT,
    availableSources: EMPTY_ARRAY,
    availableTags: EMPTY_ARRAY,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    // This should be created a new every time or deep copied...
    const defaultState = {
      language: 'heb',
      lecturer: LECTURERS[0].value,
      has_translation: true,
      capture_date: today(),
      film_date: today(),
      require_test: false,
      part: 1,
      artifact_type: ARTIFACT_TYPES[0].value,
      manual_name: null,
      sources: [],
      tags: [],
      major: {},
      error: null,
    };

    const state       = Object.assign({}, defaultState, props.metadata);
    state.manual_name = state.manual_name || null;
    Object.assign(state, this.suggestName(state));

    if (Array.isArray(state.sources)) {
      state.sources = props.availableSources.length > 0 ?
        state.sources.map(x => findPath(props.availableSources, x)) :
        [];
    } else {
      state.sources = [];
    }

    if (Array.isArray(state.tags)) {
      state.tags = props.availableTags.length > 0 ?
        state.tags.map(x => findPath(props.availableTags, x)) :
        [];
    } else {
      state.tags = [];
    }

    return state;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.availableSources.length > 0 &&
      nextProps.metadata.sources &&
      this.props.availableSources !== nextProps.availableSources) {
      const sources = nextProps.metadata.sources.map(x => findPath(nextProps.availableSources, x));
      this.setStateAndName({ sources });
    }

    if (nextProps.availableTags.length > 0 &&
      nextProps.metadata.tags &&
      this.props.availableTags !== nextProps.availableTags) {
      const tags = nextProps.metadata.tags.map(x => findPath(nextProps.availableTags, x));
      this.setStateAndName({ tags });
    }
  }

  onSubmit = (e) => {
    if (!this.validate()) {
      return;
    }

    const data           = { ...this.state };
    data.sources         = data.sources.map(x => x[x.length - 1].uid);
    data.tags            = data.tags.map(x => x[x.length - 1].uid);
    data.final_name      = data.manual_name || data.auto_name;
    data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;
    delete data.error;
    if (!this.props.metadata.label_id) {
      delete data.film_date;
    }

    this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
  };

  onCancel = (e) => {
    this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
  };

  onLanguageChange = (e, data) => {
    this.setStateAndName({ language: data.value });
  };

  onLecturerChange = (e, data) => {
    this.setStateAndName({ lecturer: data.value });
  };

  onTranslationChange = (e, data) => {
    this.setStateAndName({ has_translation: data.checked });
  };

  onRequireTestChange = (e, data) => {
    this.setState({ require_test: data.checked });
  };

  onPartChange = (e, data) => {
    const part = data.value;
    this.setStateAndName({
      part,
      error: (part === 0) ? null : this.state.error
    });
  };

  onArtifactTypeChange = (e, data) => {
    this.setStateAndName({ artifact_type: data.value });
  };

  onFilmDateChange = (date) => {
    this.setStateAndName({ film_date: date });
  };

  onManualEdit = (e, data) => {
    this.setState({ manual_name: data.value });
  };

  onSourceClick(idx) {
    const major = this.updateMajor('SET', 'source', idx);
    this.setStateAndName({ major });
  }

  onTagClick(idx) {
    const major = this.updateMajor('SET', 'tag', idx);
    this.setStateAndName({ major });
  }

  setStateAndName(diff) {
    this.setState({ ...diff, ...this.suggestName(diff) });
  }

  addSource = (selection) => {
    const sources = this.state.sources;

    // Prevent duplicates
    for (let i = 0; i < sources.length; i++) {
      if (sources[i].length === selection.length &&
        sources[i].every((x, j) => selection[j] === x)) {
        return;
      }
    }

    sources.push(selection);
    const major = this.updateMajor('ADD', 'source', sources.length - 1);
    this.setStateAndName({ sources, major, error: null });
  };

  removeSource(e, idx) {
    e.stopPropagation(); // don't bubble up to onSourceClick

    const sources = this.state.sources;
    const major   = this.updateMajor('REMOVE', 'source', idx);

    sources.splice(idx, 1);
    this.setStateAndName({ sources, major });
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
    this.setStateAndName({ tags, major, error: null });
  };

  removeTag(e, idx) {
    e.stopPropagation(); // don't bubble up to onTagClick

    const tags  = this.state.tags;
    const major = this.updateMajor('REMOVE', 'tag', idx);

    tags.splice(idx, 1);
    this.setStateAndName({ tags, major });
  }

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
          let selection = this.state[`${type}s`];
          if (selection.length > 1) {
            // keep it in the family
            major = { type, idx: Math.max(0, idx - 1) };
          } else {
            // try the other type
            const type2 = type === 'source' ? 'tag' : 'source';
            selection   = this.state[`${type2}s`];
            if (selection.length > 0) {
              major = { type: type2, idx: 0 };
            } else {
              // no replacement
              major = {};
            }
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
            content_type: contentType,
            language,
            lecturer,
            has_translation: hasTranslation,
            sources,
            tags,
            capture_date: captureDate,
            film_date: filmDate,
            number,
            part,
            artifact_type: artifactType,
            major
          } = Object.assign({}, this.state, diff || {});

    let pattern = '';

    if (major.type) {
      const selection = major.type === 'source' ? sources : tags;
      const item      = selection[major.idx];
      if (Array.isArray(item)) {
        // pattern is the deepest node in the chain with a pattern
        for (let j = item.length - 1; j >= 0; j--) {
          const x = item[j];
          if (x.pattern) {
            pattern = x.pattern;
            break;
          }
        }
      }
    }

    // Note: We keep the 2 following paragraphs for cases where
    // major has no pattern in it's chain.
    // In such cases we take what we have if possible.

    // pattern is the deepest node in the chain with a pattern
    for (let i = 0; pattern === '' && i < tags.length; i++) {
      const tag = tags[i];
      for (let j = tag.length - 1; j >= 0; j--) {
        const t = tag[j];
        if (t.pattern) {
          pattern = t.pattern;
          break;
        }
      }
    }

    // if no tag was selected take pattern from sources, same logic as above
    for (let i = 0; pattern === '' && i < sources.length; i++) {
      const source = sources[i];
      for (let j = source.length - 1; j >= 0; j--) {
        const s = source[j];
        if (s.pattern) {
          pattern = s.pattern;
          break;
        }
      }
    }

    // override lesson preparation value
    if (pattern === '' && part === 0) {
      pattern = 'achana';
    }
    pattern = pattern.toLowerCase().trim();

    // eslint-disable-next-line prefer-template
    const name = (hasTranslation ? 'mlt' : language) +
      '_o_' +
      lecturer +
      '_' +
      (this.props.metadata.label_id ? filmDate : captureDate) +
      '_' +
      CONTENT_TYPES_MAPPINGS[artifactType === ARTIFACT_TYPES[0].value ? contentType : artifactType].pattern +
      (pattern ? `_${pattern}` : '') +
      '_n' +
      (number || 1) +
      '_' +
      'p' + part;

    return {
      pattern,
      auto_name: name.toLowerCase().trim(),
    };
  }

  validate() {
    if (this.isValidClassification()) {
      return true;
    }

    this.setState({ error: 'נא לבחור חומרי לימוד או תגיות' });
    return false;
  }

  isValidClassification() {
    const { sources, tags, part } = this.state;
    return sources.length !== 0 ||
      tags.length !== 0 ||
      part === 0;
  }

  renderSelectedSources() {
    const { sources, major } = this.state;

    if (sources.length === 0) {
      return (
        <List className="bb-selected-sources-list">
          <List.Item>
            <Header as="h5" color="grey">אין חומרי לימוד</Header>
          </List.Item>
        </List>
      );
    }

    return (
      <List className="bb-selected-sources-list">
        {
          sources.map((x, i) => {
            const title   = x.map(y => y.name).join(', ');
            const isMajor = major.type === 'source' && major.idx === i;

            return (
              <List.Item key={x[x.length - 1].id}>
                <Label
                  color="blue"
                  size="large"
                  basic={!isMajor}
                  onClick={() => this.onSourceClick(i)}
                >
                  {title}
                  <Icon name="delete" onClick={e => this.removeSource(e, i)} />
                </Label>
              </List.Item>
            );
          })
        }
      </List>
    );
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
            language,
            lecturer,
            has_translation: hasTranslation,
            require_test: requireTest,
            part,
            artifact_type: artifactType,
            auto_name: autoName,
            manual_name: manualName,
            error
          }                                   = this.state;
    const { metadata, availableSources, availableTags } = this.props;

    return (
      <Grid stackable container>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h2" color="blue">פרטי השיעור</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} className="bb-interesting">
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header size="medium">תגיות</Header>
                  <TagSelector tree={availableTags} onSelect={this.addTag} />
                  {this.renderSelectedTags()}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header size="medium">חומר לימוד</Header>
                  <SourceSelector tree={availableSources} onSelect={this.addSource} />
                  {this.renderSelectedSources()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={4}>
            <Grid className="bb-less-interesting">
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">חלק</Header>
                  <Dropdown
                    selection
                    fluid
                    options={LESSON_PARTS_OPTIONS}
                    value={part}
                    onChange={this.onPartChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h5">סוג</Header>
                  <Dropdown
                    selection
                    fluid
                    options={ARTIFACT_TYPES}
                    value={artifactType}
                    onChange={this.onArtifactTypeChange}
                  />
                </Grid.Column>
              </Grid.Row>
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
              {
                metadata.label_id ?
                  <Grid.Row>
                    <Grid.Column>
                      <Header as="h5">תאריך</Header>
                      <CassetteDayPicker onSelect={this.onFilmDateChange} defaultValue={metadata.film_date} />
                    </Grid.Column>
                  </Grid.Row> :
                  null
              }
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

export default LessonForm;
