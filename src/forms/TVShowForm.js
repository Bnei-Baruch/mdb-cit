import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Grid, Header, Input} from "semantic-ui-react";
import FileNamesWidget from "../components/FileNamesWidget";
import {isActive, today} from "../shared/utils";
import {CONTENT_TYPES_MAPPINGS, CT_VIDEO_PROGRAM, LANGUAGES, LECTURERS, MDB_LANGUAGES} from "../shared/consts";

class TVShowForm extends Component {

    static propTypes = {
        metadata: PropTypes.object,
        collections: PropTypes.object,
        onActivateShow: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        metadata: {},
        collections: new Map(),
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.collections !== nextProps.collections) {

            // which show should be selected after filter ?
            let tv_show = this.state.tv_show;
            let language = this.state.language;
            let cuid;
            if (this.state.active_tvshows.length > 0) {
                // current selection
                cuid = this.state.active_tvshows[tv_show].collection_uid;
            } else {
                // next props
                cuid = nextProps.metadata.collection_uid;
            }

            // filter shows
            const active_tvshows = this.getActiveShows(nextProps.collections);

            // lookup show in filtered list
            if (!!cuid) {
                const idx = active_tvshows.findIndex(x => x.uid === cuid);
                tv_show = idx > -1 ? idx : 0;
            }

            // adjust show's default language
            if (active_tvshows.length > tv_show) {
                const defaultLang = active_tvshows[tv_show].properties.default_language;
                if (!!defaultLang) {
                    language = MDB_LANGUAGES[defaultLang];
                }
            }

            this.setState({active_tvshows, tv_show, language,
                auto_name: this.suggestName({active_tvshows, tv_show, language})});
        }
    }

    getInitialState(props) {
        // This should be created a new every time or deep copied...
        const defaultState = {
            language: LANGUAGES[0].value,
            lecturer: LECTURERS[0].value,
            has_translation: true,
            capture_date: today(),
            tv_show: 0,
            episode: "1",
            manual_name: null,
            active_tvshows: [],
        };
        const state = Object.assign({}, defaultState, props.metadata);
        state.manual_name = state.manual_name || null;

        // filter shows and lookup specified show
        state.active_tvshows = this.getActiveShows(props.collections);
        if (!!props.metadata.collection_uid) {
            const idx = state.active_tvshows.findIndex(x => x.uid === props.metadata.collection_uid);
            state.tv_show = idx > -1 ? idx : 0;
        }

        // adjust show's default language
        if (state.active_tvshows.length > state.tv_show) {
            const defaultLang = state.active_tvshows[state.tv_show].properties.default_language;
            if (!!defaultLang) {
                state.language = MDB_LANGUAGES[defaultLang];
            }
        }

        state.auto_name = this.suggestName(state);
        return state;
    }

    onSubmit(e) {
        let data = {...this.state};
        data.collection_uid = data.active_tvshows[data.tv_show].uid;
        data.pattern = data.active_tvshows[data.tv_show].properties.pattern;
        data.final_name = data.manual_name || data.auto_name;
        data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;
        delete data["tv_show"];
        delete data["active_tvshows"];

        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
    }

    onTVShowChange(tv_show) {
        const show = this.state.active_tvshows[tv_show];
        let language = this.state.language;
        if (!!show.properties.default_language) {
            language = MDB_LANGUAGES[show.properties.default_language];
        }
        this.setState({tv_show, language, auto_name: this.suggestName({tv_show, language})});
    }

    onLanguageChange(language) {
        this.setState({language, auto_name: this.suggestName({language})});
    }

    onLecturerChange(lecturer) {
        this.setState({lecturer, auto_name: this.suggestName({lecturer})});
    }

    onTranslationChange(has_translation) {
        this.setState({has_translation, auto_name: this.suggestName({has_translation})});
    }

    onEpisodeChange(episode) {
        episode = episode.trim().split(/\s+/).join("_");  // clean user input
        this.setState({episode, auto_name: this.suggestName({episode})});
    }

    onManualEdit(manual_name) {
        this.setState({manual_name});
    }

    suggestName(diff) {
        const {content_type, tv_show, episode, language, lecturer, has_translation, active_tvshows, capture_date} =
            Object.assign({}, this.state, diff || {});
        const show = active_tvshows[tv_show];

        const name = (has_translation ? "mlt" : language) +
            "_o_" +
            lecturer +
            "_" +
            capture_date +
            "_" +
            CONTENT_TYPES_MAPPINGS[content_type].pattern +
            "_" +
            (show ? show.properties.pattern : "") +
            (episode !== "" ? (Number.isNaN(Number.parseInt(episode, 10)) ? "_" : "_n") + episode : "");

        return name.toLowerCase().trim();
    }

    getTVShows(collections) {
        return collections.get(CT_VIDEO_PROGRAM) || [];
    }

    getActiveShows(collections) {
        return this.getTVShows(collections).filter(x => isActive(x));
    }

    renderManageDropdown() {
        const {collections, onActivateShow} = this.props;

        let options = this.getTVShows(collections).map((x, i) => {
            const active = isActive(x),
                action = active ?
                    <Button circular icon="remove" floated="right" size="mini" color="red" title="Disable"
                            onClick={(e) => onActivateShow(e, x)}/> :
                    <Button circular icon="checkmark" floated="right" size="mini" color="green" title="Enable"
                            onClick={(e) => onActivateShow(e, x)}/>;
            return {
                content: <div>
                    {action}
                    <strong>{x.name}</strong>
                    <br/>
                    <span className="description">{x.properties.pattern}</span>
                </div>,
                value: i,
            }
        });

        return <Dropdown selection fluid
                         placeholder="בחר תוכנית"
                         options={options}/>
    }

    render() {
        const {tv_show, language, lecturer, has_translation, episode, auto_name, manual_name, active_tvshows} = this.state;

        return <Grid stackable container >
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Header as="h2" color="blue">פרטי התוכנית</Header>
                    {/*<hr/>*/}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3} className="bb-interesting">
                <Grid.Column width={10}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={12}>
                                <Header as="h5">שם התוכנית</Header>
                                <Dropdown selection fluid
                                          options={active_tvshows.map((x, i) => ({text: x.name, value: i}))}
                                          value={tv_show}
                                          onChange={(e, data) => this.onTVShowChange(data.value)}/>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header as="h5">פרק</Header>
                                <Input fluid
                                       defaultValue={episode}
                                       onChange={(e, data) => this.onEpisodeChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">ניהול תוכניות</Header>
                                {this.renderManageDropdown()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={2}>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">שפה</Header>
                                <Dropdown selection
                                          options={LANGUAGES}
                                          value={language}
                                          onChange={(e, data) => this.onLanguageChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">מרצה</Header>
                                <Dropdown selection
                                          options={LECTURERS}
                                          value={lecturer}
                                          onChange={(e, data) => this.onLecturerChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Checkbox label="מתורגם"
                                          checked={has_translation}
                                          onChange={(e, data) => this.onTranslationChange(data.checked)}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <FileNamesWidget auto_name={auto_name}
                                     manual_name={manual_name}
                                     onChange={(e, data) => this.onManualEdit(data.value)}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1} textAlign="right">
                <Grid.Column>
                    <Button onClick={(e) => this.onCancel(e)}>בטל</Button>
                    <Button primary onClick={(e) => this.onSubmit(e)}>שמור</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    };
}

export default TVShowForm;