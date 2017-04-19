import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Grid, Header} from "semantic-ui-react";
import FileNamesWidget from "./FileNamesWidget";
import {today} from "./utils";
import {COLLECTION_TYPES, LANGUAGES, LECTURERS} from "./consts";

class GenericContentForm extends Component {

    static propTypes = {
        metadata: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        metadata: {}
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    getInitialState(props) {
        // This should be created a new every time or deep copied...
        const defaultState = {
            language: "heb",
            lecturer: "rav",
            has_translation: true,
            capture_date: today(),
            manual_name: false,
        };
        const state = Object.assign({}, defaultState, props.metadata);
        state.auto_name = this.suggestName(state);
        return state;
    }

    onSubmit(e) {
        let data = {...this.state};
        data.pattern = data.content_type.toLowerCase();
        data.final_name = data.manual_name || data.auto_name;
        data.collection_type = COLLECTION_TYPES[data.content_type];

        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
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

    onManualEdit(manual_name) {
        this.setState({manual_name})
    }

    suggestName(diff) {
        const { language, lecturer, has_translation, capture_date, content_type, number} =
            Object.assign({}, this.state, diff || {});

        const name = (has_translation ? "mlt" : language) +
            "_o_" +
            lecturer +
            "_" +
            capture_date +
            "_" +
            content_type +
            "_n" +
            (number || 1);

        return name.toLowerCase().trim();
    }

    render() {
        const {language, lecturer, has_translation, auto_name, manual_name} = this.state;

        return <Grid stackable container divided="vertically">
            <Grid.Row columns={1}>
                <Grid.Column>
                    <Header as="h2">פרטי התוכן</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={4}>
                <Grid.Column width={4}>
                    <Header as="h5">שפה</Header>
                    <Dropdown selection fluid
                              options={LANGUAGES}
                              value={language}
                              onChange={(e, data) => this.onLanguageChange(data.value)}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Header as="h5">מרצה</Header>
                    <Dropdown selection fluid
                              options={LECTURERS}
                              value={lecturer}
                              onChange={(e, data) => this.onLecturerChange(data.value)}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Checkbox label="מתורגם"
                              checked={has_translation}
                              onChange={(e, data) => this.onTranslationChange(data.checked)}/>
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

export default GenericContentForm;