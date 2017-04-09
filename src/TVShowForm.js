import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Header, Input, Segment, Table} from "semantic-ui-react";
import {today} from "./utils";
import {LANGUAGES, LECTURERS, MDB_LANGUAGES} from "./consts";

class TVShowForm extends Component {

    static propTypes = {
        tvshows: PropTypes.array,
        metadata: PropTypes.object,
        onActivateShow: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tvshows: [],
        metadata: {}
    };

    static initialState = {
        language: "HEB",
        lecturer: "rav",
        has_translation: true,
        tv_show: 0,
        episode: 0,
        manual_name: false,
        active_tvshows: [],
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    getInitialState(props) {
        const state = Object.assign({}, TVShowForm.initialState, props.metadata);
        state.auto_name = this.suggestName(state);
        return state;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.tvshows !== nextProps.tvshows) {

            // which show should be selected after filter ?
            let tv_show = this.state.tv_show;
            let cuid;
            if (this.state.active_tvshows.length > 0) {
                // current selection
                cuid = this.state.active_tvshows[tv_show].collection_uid;
            } else {
                // next props
                cuid = nextProps.metadata.collection_uid;
            }

            // filter shows
            const active_tvshows = this.getActiveShows(nextProps.tvshows);

            // lookup show in filtered list
            if (!!cuid) {
                const idx = active_tvshows.findIndex(x => x.uid === cuid);
                tv_show = idx > -1 ? idx : 0;
            }

            this.setState({active_tvshows, tv_show, auto_name: this.suggestName({active_tvshows, tv_show})});
        }
    }

    onSubmit(e) {
        let data = {...this.state};
        data.collection_uid = data.active_tvshows[data.tv_show].uid;
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
        this.setState({tv_show, language, auto_name: this.suggestName({tv_show, language})})
    }

    onLanguageChange(language) {
        this.setState({language, auto_name: this.suggestName({language})})
    }

    onLecturerChange(lecturer) {
        this.setState({lecturer, auto_name: this.suggestName({lecturer})})
    }

    onTranslationChange(has_translation) {
        this.setState({has_translation, auto_name: this.suggestName({has_translation})})
    }

    onEpisodeChange(episode) {
        this.setState({episode, auto_name: this.suggestName({episode})})
    }

    onManualEdit(manual_name) {
        this.setState({manual_name})
    }

    suggestName(diff) {
        const {
            tv_show,
            episode,
            language,
            lecturer,
            has_translation,
            active_tvshows,
            film_date
        } = Object.assign({}, this.state, diff || {});
        const show = active_tvshows[tv_show];
        const name = language + "_" + (has_translation ? "o_" : "") + lecturer + "_" + (film_date || today()) + "_"
            + (show ? show.properties.pattern : "") + "_n" + episode;

        return name.toLowerCase().trim();
    }

    getActiveShows(tvshows) {
        return tvshows.filter(x => this.isActive(x));
    }

    isActive(tvshow) {
        return !tvshow.properties.hasOwnProperty("active") || tvshow.properties.active;
    }

    renderManageDropdown() {
        let options = this.props.tvshows.map((x, i) => {
            const active = this.isActive(x),
                action = active ?
                    <Button circular icon="remove" floated="right" size="mini" color="red" title="Disable"
                            onClick={(e) => this.props.onActivateShow(e, x)}
                    /> :
                    <Button circular icon="checkmark" floated="right" size="mini" color="green" title="Enable"
                            onClick={(e) => this.props.onActivateShow(e, x)}/>;
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

        return <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={2}>
                        <Header as="h2">פרטי התוכנית</Header>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell width={4}>
                        <Segment>
                            <Header as="h5">שם התוכנית</Header>
                            <Dropdown selection
                                      options={active_tvshows.map((x, i) => ({text: x.name, value: i}))}
                                      value={tv_show}
                                      onChange={(e, data) => this.onTVShowChange(data.value)}/>
                        </Segment>
                    </Table.Cell>
                    <Table.Cell width={12}>
                        <Segment>
                            <Header as="h5">ניהול תוכניות</Header>
                            {this.renderManageDropdown()}
                        </Segment>
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell colSpan={2}>
                        <Segment.Group horizontal>
                            <Segment>
                                <Header as="h5">שפה</Header>
                                <Dropdown selection
                                          options={LANGUAGES}
                                          value={language}
                                          onChange={(e, data) => this.onLanguageChange(data.value)}/>
                            </Segment>
                            <Segment>
                                <Header as="h5">מרצה</Header>
                                <Dropdown selection
                                          options={LECTURERS}
                                          value={lecturer}
                                          onChange={(e, data) => this.onLecturerChange(data.value)}/>
                            </Segment>
                            <Segment>
                                <Header as="h5">פרק</Header>
                                <Input fluid
                                       defaultValue={episode}
                                       onChange={(e, data) => this.onEpisodeChange(data.value)}/>
                            </Segment>
                            <Segment>
                                <Checkbox label="מתורגם"
                                          checked={has_translation}
                                          onChange={(e, data) => this.onTranslationChange(data.checked)}/>
                            </Segment>
                        </Segment.Group>
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell colSpan={2}>
                        <Segment.Group>
                            <Segment>
                                <Header as="h5">שם אוטומטי</Header>
                                {auto_name}
                            </Segment>
                            <Segment>
                                <Header as="h5">שם ידני</Header>
                                <Input fluid
                                       focus={!!manual_name && manual_name !== auto_name}
                                       onChange={(e, data) => this.onManualEdit(data.value)}/>
                            </Segment>
                            <Segment>
                                <Header as="h5">שם סופי</Header>
                                {manual_name || auto_name}
                            </Segment>
                        </Segment.Group>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell textAlign="right">
                        <Button onClick={(e) => this.onCancel(e)}>בטל</Button>
                        <Button primary onClick={(e) => this.onSubmit(e)}>שמור</Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>;
    };
}

export default TVShowForm;