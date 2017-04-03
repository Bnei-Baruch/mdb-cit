import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Header, Input, Table} from "semantic-ui-react";
import {today} from "./utils";
import {LANGUAGES, LECTURERS} from "./consts";

class LessonForm extends Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            program: "haim_hadashim",
            language: "HEB",
            lecturer: "rav",
            has_translation: true,
            episode: 0,
            auto_name: "heb_o_rav_" + today() + "_program",
            manual_name: false
        };
    }

    onSubmit() {
        // TODO: validations should go here
        this.props.onSubmit(this.state);
    }

    onProgramChange(program) {
        this.setState({program, auto_name: this.suggestName({program})})
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
        const {program, episode, language, lecturer, has_translation} = Object.assign({}, this.state, diff || {});
        const name = language + "_" + (has_translation ? "o_" : "") + lecturer + "_" + today() +
            "_program_" + program + "_n" + episode;
        return name.toLowerCase().trim();
    }

    render() {
        const programs = [
            {text: "חיים חדשים", value: "haim_hadashim"},
        ];

        const {program, language, lecturer, has_translation, episode, auto_name, manual_name} = this.state;

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
                    <Table.Cell>
                        <Dropdown selection
                                  options={programs}
                                  value={program}
                                  onChange={(e, data) => this.onProgramChange(data.value)}/>
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>תכנית</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Dropdown selection
                                  options={LANGUAGES}
                                  value={language}
                                  onChange={(e, data) => this.onLanguageChange(data.value)}/>
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>שפה</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Dropdown selection
                                  options={LECTURERS}
                                  value={lecturer}
                                  onChange={(e, data) => this.onLecturerChange(data.value)}/>
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>מרצה</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Checkbox label="מתורגם"
                                  checked={has_translation}
                                  onChange={(e, data) => this.onTranslationChange(data.checked)}/>
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>תרגום</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Input fluid
                               defaultValue={episode}
                               onChange={(e, data) => this.onEpisodeChange(data.value)} />
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>מס' פרק</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        {auto_name}
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>שם אוטומטי</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Input fluid
                               onChange={(e, data) => this.onManualEdit(data.value)} />
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>שם ידני</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        {manual_name || auto_name}
                    </Table.Cell>
                    <Table.Cell textAlign='left'><strong>שם סופי</strong></Table.Cell>
                </Table.Row>
            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell textAlign='right'>
                        <Button onClick={() => this.props.onCancel()}>בטל</Button>
                        <Button primary onClick={() => this.onSubmit()}>שמור</Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Footer>
        </Table>;
    };
}

export default LessonForm;