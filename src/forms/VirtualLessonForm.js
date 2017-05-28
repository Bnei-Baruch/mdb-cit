import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Grid, Header, Input} from "semantic-ui-react";
import FileNamesWidget from "../components/FileNamesWidget";
import {isActive, today} from "../shared/utils";
import {CONTENT_TYPES_MAPPINGS, CT_VIRTUAL_LESSON, LANGUAGES, LECTURERS, MDB_LANGUAGES} from "../shared/consts";

class VirtualLessonForm extends Component {

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

            // which collection should be selected after filter ?
            let vl = this.state.vl;
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
            const active_vls = this.getActiveVirtualLessons(nextProps.collections);

            // lookup show in filtered list
            if (!!cuid) {
                const idx = active_vls.findIndex(x => x.uid === cuid);
                vl = idx > -1 ? idx : 0;
            }

            // adjust show's default language
            if (active_vls.length > vl) {
                const defaultLang = active_vls[vl].properties.default_language;
                if (!!defaultLang) {
                    language = MDB_LANGUAGES[defaultLang];
                }
            }

            this.setState({
                active_vls, vl, language,
                auto_name: this.suggestName({active_vls, vl, language})
            });
        }
    }

    getInitialState(props) {
        // This should be created a new every time or deep copied...
        const defaultState = {
            language: LANGUAGES[0].value,
            lecturer: LECTURERS[0].value,
            has_translation: true,
            capture_date: today(),
            vl: 0,
            topic: "",
            manual_name: null,
            active_vls: [],
        };
        const state = Object.assign({}, defaultState, props.metadata);
        state.manual_name = state.manual_name || null;

        // filter collections and lookup specified show
        state.active_vls = this.getActiveVirtualLessons(props.collections);
        if (!!props.metadata.collection_uid) {
            const idx = state.active_vls.findIndex(x => x.uid === props.metadata.collection_uid);
            state.vl = idx > -1 ? idx : 0;
        }

        // adjust show's default language
        if (state.active_vls.length > state.vl) {
            const defaultLang = state.active_vls[state.vl].properties.default_language;
            if (!!defaultLang) {
                state.language = MDB_LANGUAGES[defaultLang];
            }
        }

        state.auto_name = this.suggestName(state);
        return state;
    }

    onSubmit(e) {
        let data = {...this.state};
        data.collection_uid = data.active_vls[data.vl].uid;
        data.pattern = data.active_vls[data.vl].properties.pattern;
        data.final_name = data.manual_name || data.auto_name;
        data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;
        delete data["topic"];
        delete data["vl"];
        delete data["active_vls"];

        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
    }

    onVLChange(vl) {
        const collection = this.state.active_vls[vl];
        let language = this.state.language;
        if (!!collection.properties.default_language) {
            language = MDB_LANGUAGES[collection.properties.default_language];
        }
        this.setState({vl, language, auto_name: this.suggestName({vl, language})});
    }

    onTopicChange(topic) {
        const clean = topic.trim().toLowerCase().replace(/[^0-9a-z]+/g, "-");
        this.setState({topic: clean, auto_name: this.suggestName({topic: clean})});
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

    onManualEdit(manual_name) {
        this.setState({manual_name});
    }

    suggestName(diff) {
        const {content_type, vl, topic, language, lecturer, has_translation, active_vls, capture_date} =
            Object.assign({}, this.state, diff || {});
        const collection = active_vls[vl];

        const name = (has_translation ? "mlt" : language) +
            "_o_" +
            lecturer +
            "_" +
            capture_date +
            "_" +
            CONTENT_TYPES_MAPPINGS[content_type].pattern +
            (collection && collection.properties.pattern !== null ? "_" + collection.properties.pattern : "") +
            (topic ? "_" + topic : "");

        return name.toLowerCase().trim();
    }

    getVirtualLessons(collections) {
        return collections.get(CT_VIRTUAL_LESSON) || [];
    }

    getActiveVirtualLessons(collections) {
        return this.getVirtualLessons(collections)
            .filter(x => isActive(x))
            .concat([{name: "אחר", uid: null, properties: {default_language: "he", pattern: null}}]);
    }

    render() {
        const {vl, topic, language, lecturer, has_translation, auto_name, manual_name, active_vls} = this.state;

        return <Grid stackable container>
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Header as="h2" color="blue">פרטי השיעור הוירטואלי</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3} className="bb-interesting">
                <Grid.Column width={10}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">אוסף</Header>
                                <Dropdown selection fluid
                                          options={active_vls.map((x, i) => ({text: x.name, value: i}))}
                                          value={vl}
                                          onChange={(e, data) => this.onVLChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">נושא</Header>
                                <Input fluid
                                       defaultValue={topic}
                                       onChange={(e, data) => this.onTopicChange(data.value)}/>
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
                                <Dropdown selection fluid
                                          options={LANGUAGES}
                                          value={language}
                                          onChange={(e, data) => this.onLanguageChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">מרצה</Header>
                                <Dropdown selection fluid
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
                    <Button onClick={(e) => this.onCancel(e)}>בטל</Button>
                    <Button primary onClick={(e) => this.onSubmit(e)}>שמור</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    };
}

export default VirtualLessonForm;