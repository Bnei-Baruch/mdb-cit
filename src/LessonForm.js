import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Header, Icon, Input, Label, List, Segment, Table} from "semantic-ui-react";
import TreeItemSelector from "./TreeItemSelector";
import {findPath, today} from "./utils";
import {LANGUAGES, LECTURERS, COLLECTION_TYPES} from "./consts";

class LessonForm extends Component {

    static propTypes = {
        availableSources: PropTypes.array,
        availableTags: PropTypes.array,
        metadata: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        availableSources: [],
        availableTags: [],
        metadata: {}
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.availableSources.length > 0 &&
            nextProps.metadata.sources &&
            this.props.availableSources !== nextProps.availableSources) {
            const sources = nextProps.metadata.sources.map(x => findPath(nextProps.availableSources, x));
            this.setState({sources, ...this.suggestName({sources})});
        }

        if (nextProps.availableTags.length > 0 &&
            nextProps.metadata.tags &&
            this.props.availableTags !== nextProps.availableTags) {
            const tags = nextProps.metadata.tags.map(x => findPath(nextProps.availableTags, x));
            this.setState({tags, ...this.suggestName({tags})});
        }
    }

    getInitialState(props) {
        // This should be created a new every time or deep copied...
        const initialState = {
            language: "mlt",
            lecturer: "rav",
            has_translation: true,
            film_date: today(),
            require_test: false,
            part: 0,
            sources: [],
            tags: [],
            manual_name: false
        };

        let state = Object.assign({}, initialState, props.metadata);
        state = {...state, ...this.suggestName(state)};
        state.sources = props.availableSources.length > 0 ? state.sources.map(x => findPath(props.availableSources, x)) : [];
        state.tags = props.availableTags.length > 0 ? state.tags.map(x => findPath(props.availableTags, x)) : [];
        return state;
    }

    onSubmit(e) {
        const data = {...this.state};
        data.sources = data.sources.map(x => x[x.length - 1].uid);
        data.tags = data.tags.map(x => x[x.length - 1].uid);
        data.final_name = data.manual_name || data.auto_name;
        data.collection_type = COLLECTION_TYPES[data.content_type];
        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
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

    onRequireTestChange(require_test) {
        this.setState({require_test});
    }

    onPartChange(part) {
        this.setState({part});
    }

    addSource(selection) {
        let sources = this.state.sources;

        // Prevent duplicates
        for (let i = 0; i < sources.length; i++) {
            if (sources[i].every((x, j) => selection[j] === x)) {
                return;
            }
        }

        sources.push(selection);
        this.setState({sources, ...this.suggestName({sources})})
    }

    removeSource(idx) {
        const sources = this.state.sources;
        sources.splice(idx, 1);
        this.setState({sources, ...this.suggestName({sources})})
    }

    addTag(selection) {
        let tags = this.state.tags;

        // Prevent duplicates
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].every((x, j) => selection[j] === x)) {
                return;
            }
        }

        tags.push(selection);
        this.setState({tags, ...this.suggestName({tags})})
    }

    removeTag(idx) {
        const tags = this.state.tags;
        tags.splice(idx, 1);
        this.setState({tags, ...this.suggestName({tags})})
    }

    onManualEdit(manual_name) {
        this.setState({manual_name})
    }

    suggestName(diff) {
        const {language, lecturer, has_translation, sources, tags, film_date} = Object.assign({}, this.state, diff || {});
        const prefix = (has_translation ? "mlt" : language) + "_o_" + lecturer,
            suffix = film_date + "_lesson-n" + (this.props.metadata.number || 1);

        // pattern is the deepest node in the source chain with a pattern
        let content = "";
        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            for (let j = source.length - 1; j >= 0; j--) {
                const s = source[j];
                if (!!s.pattern) {
                    content = s.pattern;
                    break;
                }
            }
            if (content !== "") {
                break;
            }
        }

        // if not source take pattern from tags, same logic as above
        if (content === "") {
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                for (let j = tag.length - 1; j >= 0; j--) {
                    const t = tag[j];
                    if (!!t.pattern) {
                        content = t.pattern;
                        break;
                    }
                }
                if (content !== "") {
                    break;
                }
            }
        }

        // default value
        if (content === "") {
            content = "content";
        }

        return {
            auto_name: (prefix + "_" + content + "_" + suffix).toLowerCase().trim(),
            pattern: content,
        };
    }

    renderSelectedSources() {
        const sources = this.state.sources;

        return <List>
            {sources.map((x, i) => {
                let title = x.map(y => y.name).join(" | ");
                return <List.Item key={i}>
                    {title}
                    <Button size="mini"
                            floated="right"
                            color="grey"
                            onClick={() => this.removeSource(i)}>
                        הסר
                    </Button>
                </List.Item>
            })}
        </List>;
    }

    renderSelectedTags() {
        const tags = this.state.tags;

        return <div>
            {tags.map((x, i) => {
                return <Label key={i}>
                    {x[x.length - 1].label}
                    <Icon name="delete" onClick={() => this.removeTag(i)}/>
                </Label>
            })}
        </div>;
    }

    render() {
        const parts = [{text: "הכנה", value: 0}]
            .concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({text: "חלק " + i, value: i})))
            .concat([{text: "מלא", value: -1}]);

        const {language, lecturer, has_translation, require_test, part, auto_name, manual_name} = this.state;
        const {availableSources, availableTags} = this.props;

        return <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={2}>
                        <Header as="h2">פרטי השיעור</Header>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell colSpan={2}>
                        <Segment.Group>
                            <Segment>
                                <Header as="h5">חומר לימוד</Header>
                            </Segment>
                            <Segment>
                                <TreeItemSelector tree={availableSources} onSelect={x => this.addSource(x)}/>
                                {this.renderSelectedSources()}
                            </Segment>
                        </Segment.Group>
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell colSpan={2}>
                        <Segment.Group>
                            <Segment>
                                <Header as="h5">תגיות</Header>
                            </Segment>
                            <Segment>
                                <TreeItemSelector tree={availableTags} fieldLabel={x => x.label}
                                                  onSelect={x => this.addTag(x)}/>
                                {this.renderSelectedTags()}
                            </Segment>
                        </Segment.Group>
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
                                <Header as="h5">חלק</Header>
                                <Dropdown selection
                                          options={parts}
                                          value={part}
                                          onChange={(e, data) => this.onPartChange(data.value)}/>
                            </Segment>
                            <Segment>
                                <Checkbox label="מתורגם"
                                          checked={has_translation}
                                          onChange={(e, data) => this.onTranslationChange(data.checked)}/>
                                <br/>
                                <br/>
                                <Checkbox label="צריך בדיקה"
                                          checked={require_test}
                                          onChange={(e, data) => this.onRequireTestChange(data.checked)}/>
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

export default LessonForm;