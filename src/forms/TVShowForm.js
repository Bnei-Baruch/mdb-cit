import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Grid, Header, Input } from 'semantic-ui-react';

import {
  CONTENT_TYPES_MAPPINGS,
  CT_VIDEO_PROGRAM,
  EMPTY_OBJECT,
  LANGUAGES,
  LECTURERS,
  MDB_LANGUAGES
} from '../shared/consts';
import { isActive, today } from '../shared/utils';
import { Metadata } from '../shared/shapes';
import FileNamesWidget from '../components/FileNamesWidget';
import CassetteDayPicker from '../components/CassetteDayPicker';

const getTVShows     = collections => collections.get(CT_VIDEO_PROGRAM) || [];
const getActiveShows = (collections) => {
  const active = getTVShows(collections).filter(isActive);
  active.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return active;
};

class TVShowForm extends Component {

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
      film_date: today(),
      tv_show: 0,
      episode: '1',
      manual_name: null,
      active_tvshows: [],
    };
    const state        = Object.assign({}, defaultState, props.metadata);
    state.manual_name  = state.manual_name || null;

    // filter shows and lookup specified show
    state.active_tvshows = getActiveShows(props.collections);
    if (props.metadata.collection_uid) {
      const idx     = state.active_tvshows.findIndex(x => x.uid === props.metadata.collection_uid);
      state.tv_show = idx > -1 ? idx : 0;
    }

    // adjust show's default language
    if (state.active_tvshows.length > state.tv_show) {
      const defaultLang = state.active_tvshows[state.tv_show].properties.default_language;
      if (defaultLang) {
        state.language = MDB_LANGUAGES[defaultLang];
      }
    }

    state.auto_name = this.suggestName(state);
    return state;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.collections !== nextProps.collections) {
      // which show should be selected after filter ?
      let tvShow   = this.state.tv_show;
      let language = this.state.language;
      let cuid;
      if (this.state.active_tvshows.length > 0) {
        // current selection
        cuid = this.state.active_tvshows[tvShow].collection_uid;
      } else {
        // next props
        cuid = nextProps.metadata.collection_uid;
      }

      // filter shows
      const activeTVShows = getActiveShows(nextProps.collections);

      // lookup show in filtered list
      if (cuid) {
        const idx = activeTVShows.findIndex(x => x.uid === cuid);
        tvShow    = idx > -1 ? idx : 0;
      }

      // adjust show's default language
      if (activeTVShows.length > tvShow) {
        const defaultLang = activeTVShows[tvShow].properties.default_language;
        if (defaultLang) {
          language = MDB_LANGUAGES[defaultLang];
        }
      }

      this.setState({
        active_tvshows: activeTVShows,
        tv_show: tvShow,
        language,
        auto_name: this.suggestName({ active_tvshows: activeTVShows, tv_show: tvShow, language })
      });
    }
  }

  onSubmit = (e) => {
    const data           = { ...this.state };
    data.collection_uid  = data.active_tvshows[data.tv_show].uid;
    data.pattern         = data.active_tvshows[data.tv_show].properties.pattern;
    data.final_name      = data.manual_name || data.auto_name;
    data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;
    delete data.tv_show;
    delete data.active_tvshows;
    if (!this.props.metadata.label_id) {
      delete data.film_date;
    }

    this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
  };

  onCancel = (e) => {
    this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
  };

  onTVShowChange = (e, data) => {
    const tvShow = data.value;
    const show   = this.state.active_tvshows[tvShow];
    let language = this.state.language;
    if (show.properties.default_language) {
      language = MDB_LANGUAGES[show.properties.default_language];
    }
    this.setState({
      tv_show: tvShow,
      language,
      auto_name: this.suggestName({ tv_show: tvShow, language }),
    });
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

  onEpisodeChange = (e, data) => {
    const clean = data.value.trim().split(/\s+/).join('_');  // clean user input
    this.setState({
      episode: clean,
      auto_name: this.suggestName({ episode: clean }),
    });
  };

  onFilmDateChange = (date) => {
    this.setState({
      film_date: date,
      auto_name: this.suggestName({ film_date: date }),
    });
  };

  onManualEdit = (e, data) => {
    this.setState({ manual_name: data.value });
  };

  suggestName(diff) {
    const {
            content_type: contentType,
            tv_show: tvShow,
            episode,
            language,
            lecturer,
            has_translation: hasTranslation,
            active_tvshows: activeTVShows,
            capture_date: captureDate,
            film_date: filmDate,
          }    = Object.assign({}, this.state, diff || {});
    const show = activeTVShows[tvShow];

    // eslint-disable-next-line prefer-template
    const name = (hasTranslation ? 'mlt' : language) +
      '_o_' +
      lecturer +
      '_' +
      (this.props.metadata.label_id ? filmDate : captureDate) +
      '_' +
      CONTENT_TYPES_MAPPINGS[contentType].pattern +
      '_' +
      (show ? show.properties.pattern : '') +
      (episode !== '' ? (Number.isNaN(Number.parseInt(episode, 10)) ? '_' : '_n') + episode : '');

    return name.toLowerCase().trim();
  }

  render() {
    const { metadata } = this.props;
    const {
            tv_show: tvShow,
            language,
            lecturer,
            has_translation: hasTranslation,
            episode,
            auto_name: autoName,
            manual_name: manualName,
            active_tvshows: activeTVshows,
          } = this.state;

    return (
      <Grid stackable container>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h2" color="blue">פרטי התוכנית</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3} className="bb-interesting">
          <Grid.Column width={10}>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column width={12}>
                  <Header as="h5">שם התוכנית</Header>
                  <Dropdown
                    selection
                    fluid
                    options={activeTVshows.map((x, i) => ({ text: x.name, value: i }))}
                    value={tvShow}
                    onChange={this.onTVShowChange}
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Header as="h5">פרק</Header>
                  <Input
                    fluid
                    defaultValue={episode}
                    onChange={this.onEpisodeChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={2} />
          <Grid.Column width={4}>
            <Grid className="bb-less-interesting">
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
            <Button onClick={this.onCancel}>בטל</Button>
            <Button primary onClick={this.onSubmit}>שמור</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default TVShowForm;
