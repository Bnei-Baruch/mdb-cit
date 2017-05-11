import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Grid, Header, Input, Label} from "semantic-ui-react";
import FileNamesWidget from "../components/FileNamesWidget";
import {isActive, today} from "../shared/utils";
import {EVENT_CONTENT_TYPES, EVENT_PART_TYPES, LANGUAGES, LECTURERS} from "../shared/consts";

class EventPartForm extends Component {

    static propTypes = {
        metadata: PropTypes.object,
        collections: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
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

        let state = Object.assign({}, defaultState, props.metadata);
        state.manual_name = state.manual_name || null;
        state.active_events = this.getActiveEvents(props.collections);
        if (!!props.metadata.collection_uid) {
            const idx = state.active_events.findIndex(x => x.uid === props.metadata.collection_uid);
            state.event = idx > -1 ? idx : 0;
        }
        state = {...state, ...this.suggestName(state)};

        return state;
    }

    onSubmit(e) {
        if (!!this.state.error) {
            return;
        }

        let data = {...this.state};
        let event = data.active_events[data.event];
        data.content_type = EVENT_PART_TYPES[data.part_type].content_type;
        data.collection_uid = event.uid;
        data.collection_type = event.type;
        data.final_name = data.manual_name || data.auto_name;
        delete data["event"];
        delete data["active_events"];
        delete data["error"];

        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
    }

    onEventChange(event) {
        this.setState({event, ...this.suggestName({event})});
    }

    onPartTypeChange(part_type) {
        this.setState({part_type, ...this.suggestName({part_type})});
    }

    onNumberChange(value) {
        let number = Number.parseInt(value, 10);
        if (Number.isNaN(number)) {
            this.setState({
                error: "שדה מספר לא יכול להכיל אותיות",
                number: 1,
                ...this.suggestName({number})
            });
        } else {
            this.setState({number, error: null, ...this.suggestName({number})});
        }
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
            part_type,
            language,
            lecturer,
            has_translation,
            capture_date,
            number,
            active_events
        } = Object.assign({}, this.state, diff || {});

        let pattern = "",
            eventType = "";
        if (active_events.length !== 0) {
            const e = active_events[event];
            pattern = e.properties.pattern;
            eventType = e.type;
        }
        // let pattern = active_events.length !== 0 ? active_events[event].properties.pattern : "";

        const name = (has_translation ? "mlt" : language) +
            "_o_" +
            lecturer +
            "_" +
            capture_date +
            "_" +
            eventType +
            "_" +
            EVENT_PART_TYPES[part_type].pattern +
            "_" +
            pattern +
            "_n" +
            (number || 1)
        ;

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
                part_type,
                number,
                language,
                lecturer,
                has_translation,
                auto_name,
                manual_name,
                active_events,
                error
            } = this.state,
            eventOptions = active_events.map((x, i) => ({text: x.name, value: i}));

        return <Grid stackable container>
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
                                          options={EVENT_PART_TYPES.map((x, i) => ({text: x.text, value: i}))}
                                          value={part_type}
                                          onChange={(e, data) => this.onPartTypeChange(data.value)}/>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Header as="h5">מספר</Header>
                                <Input fluid
                                       defaultValue={number}
                                       onChange={(e, data) => this.onNumberChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={3}>
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
                    <Button content="אפס בחירה"
                            color="orange"
                            icon="trash outline"
                            floated="left"
                            onClick={(e) => this.props.onClear(e)}/>
                    {error ? <Label basic color="red" size="large">{error}</Label> : null}
                    <Button onClick={(e) => this.onCancel(e)}>בטל</Button>
                    <Button primary onClick={(e) => this.onSubmit(e)}>שמור</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    };
}

export default EventPartForm;