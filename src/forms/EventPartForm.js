import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Grid, Header, Input} from "semantic-ui-react";
import FileNamesWidget from "../components/FileNamesWidget";
import {isActive, today} from "../shared/utils";
import {
    CT_EVENT_PART,
    CT_FRIENDS_GATHERING,
    CT_LESSON_PART,
    CT_MEAL,
    EVENT_CONTENT_TYPES,
    LANGUAGES,
    LECTURERS
} from "../shared/consts";

class EventPartForm extends Component {

    static propTypes = {
        metadata: PropTypes.object,
        collections: PropTypes.object,
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
            const active_events = this.getActiveEvents(nextProps.collections);

            // lookup event in filtered list
            if (!!cuid) {
                const idx = active_events.findIndex(x => x.uid === cuid);
                event = idx > -1 ? idx : 0;
            }

            this.setState({active_events, event, ...this.suggestName({active_events, event})});
        }
    }

    getInitialState(props) {
        // This should be created a new every time or deep copied...
        const defaultState = {
            event: 0,
            content_type: CT_LESSON_PART,
            number: "1",
            description: "",
            language: LANGUAGES[0].value,
            lecturer: LECTURERS[0].value,
            has_translation: true,
            capture_date: today(),
            manual_name: false,
            active_events: [],
        };

        let state = Object.assign({}, defaultState, props.metadata);
        state.active_events = this.getActiveEvents(props.collections);
        if (!!props.metadata.collection_uid) {
            const idx = state.active_events.findIndex(x => x.uid === props.metadata.collection_uid);
            state.event = idx > -1 ? idx : 0;
        }
        state = {...state, ...this.suggestName(state)};

        return state;
    }

    onSubmit(e) {
        let data = {...this.state};
        let event = data.active_events[data.event];
        data.collection_uid = event.uid;
        data.collection_type = event.type;
        data.final_name = data.manual_name || data.auto_name;
        delete data["event"];
        delete data["active_events"];

        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
    }

    onEventChange(event) {
        this.setState({event, ...this.suggestName({event})});
    }

    onContentTypeChange(content_type) {
        this.setState({content_type, ...this.suggestName({content_type})});
    }

    onNumberChange(number) {
        this.setState({number, ...this.suggestName({number})});
    }

    onDescriptionChange(description) {
        this.setState({description, ...this.suggestName({description})});
    }

    onLanguageChange(language) {
        this.setState({language, ...this.suggestName({language})});
    }

    onLecturerChange(lecturer) {
        this.setState({lecturer, ...this.suggestName({lecturer})});
    }

    onTranslationChange(has_translation) {
        this.setState({has_translation, ...this.suggestName({has_translation})});
    }

    onManualEdit(manual_name) {
        this.setState({manual_name});
    }

    suggestName(diff) {
        const {
            event,
            content_type,
            language,
            lecturer,
            has_translation,
            capture_date,
            number,
            active_events
        } = Object.assign({}, this.state, diff || {});

        let pattern = active_events.length !== 0 ? active_events[event].properties.pattern : "";

        const name = (has_translation ? "mlt" : language) +
            "_o_" +
            lecturer +
            "_" +
            capture_date +
            "_" +
            pattern +
            "_" +
            content_type +
            "_n" +
            (number || 1);

        return {
            pattern,
            auto_name: name.toLowerCase().trim(),
        };
    }

    getActiveEvents(collections) {
        let active = [];
        EVENT_CONTENT_TYPES.forEach(x => active = active.concat((collections.get(x) || []).filter(y => isActive(y))));
        return active;
    }

    render() {
        const {
                event,
                content_type,
                number,
                description,
                language,
                lecturer,
                has_translation,
                auto_name,
                manual_name,
                active_events
            } = this.state,
            eventOptions = active_events.map((x, i) => ({text: x.name, value: i}));

        const ptOptions = [
            {text: "שיעור", value: CT_LESSON_PART},
            {text: "ישיבת חברים", value: CT_FRIENDS_GATHERING},
            {text: "סעודה", value: CT_MEAL},
            {text: "כללי", value: CT_EVENT_PART},
        ];

        return <Grid stackable container divided="vertically">
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Header as="h2">פרטי האירוע</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
                <Grid.Column width={9}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">אירועים</Header>
                                <Dropdown selection fluid
                                          placeholder={eventOptions.length === 0 ? "אין אירועים פתוחים" : "בחר אירוע"}
                                          options={eventOptions}
                                          value={event}
                                          disabled={eventOptions.length === 0}
                                          onChange={(e, data) => this.onEventChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column width={10}>
                                <Header as="h5">משבצת תוכן</Header>
                                <Dropdown selection fluid
                                          options={ptOptions}
                                          value={content_type}
                                          onChange={(e, data) => this.onContentTypeChange(data.value)}/>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Header as="h5">מספר</Header>
                                <Input fluid
                                       value={number}
                                       onChange={(e, data) => this.onNumberChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">תיאור</Header>
                                <Input fluid
                                       value={description}
                                       onChange={(e, data) => this.onDescriptionChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={1}>
                </Grid.Column>
                <Grid.Column width={5}>
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

export default EventPartForm;