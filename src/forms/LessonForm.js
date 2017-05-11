import React, {Component, PropTypes} from "react";
import {Button, Checkbox, Dropdown, Grid, Header, Icon, Label, List} from "semantic-ui-react";
import TreeItemSelector from "../components/TreeItemSelector";
import FileNamesWidget from "../components/FileNamesWidget";
import {findPath, today} from "../shared/utils";
import {ARTIFACT_TYPES, CONTENT_TYPES_MAPPINGS, LANGUAGES, LECTURERS} from "../shared/consts";

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
            this.setStateAndName({sources});
        }

        if (nextProps.availableTags.length > 0 &&
            nextProps.metadata.tags &&
            this.props.availableTags !== nextProps.availableTags) {
            const tags = nextProps.metadata.tags.map(x => findPath(nextProps.availableTags, x));
            this.setStateAndName({tags});
        }
    }

    getInitialState(props) {
        // This should be created a new every time or deep copied...
        const defaultState = {
            language: "heb",
            lecturer: LECTURERS[0].value,
            has_translation: true,
            capture_date: today(),
            require_test: false,
            part: 1,
            artifact_type: ARTIFACT_TYPES[0].value,
            manual_name: null,
            sources: [],
            tags: [],
            error: null,
        };

        let state = Object.assign({}, defaultState, props.metadata);
        state.manual_name = state.manual_name || null;
        Object.assign(state, this.suggestName(state));
        state.sources = props.availableSources.length > 0 ?
            state.sources.map(x => findPath(props.availableSources, x)) : [];
        state.tags = props.availableTags.length > 0 ?
            state.tags.map(x => findPath(props.availableTags, x)) : [];

        return state;
    }

    setStateAndName(diff) {
        this.setState({...diff, ...this.suggestName(diff)});
    }

    onSubmit(e) {
        if (!this.validate()) {
            return;
        }

        const data = {...this.state};
        data.sources = data.sources.map(x => x[x.length - 1].uid);
        data.tags = data.tags.map(x => x[x.length - 1].uid);
        data.final_name = data.manual_name || data.auto_name;
        data.collection_type = CONTENT_TYPES_MAPPINGS[data.content_type].collection_type;
        delete data["error"];

        this.setState(this.getInitialState(this.props), () => this.props.onSubmit(e, data));
    }

    onCancel(e) {
        this.setState(this.getInitialState(this.props), () => this.props.onCancel(e));
    }

    onLanguageChange(language) {
        this.setStateAndName({language});
    }

    onLecturerChange(lecturer) {
        this.setStateAndName({lecturer});
    }

    onTranslationChange(has_translation) {
        this.setStateAndName({has_translation});
    }

    onRequireTestChange(require_test) {
        this.setState({require_test});
    }

    onPartChange(part) {
        this.setStateAndName({
            part,
            error: (part === 0) ? null : this.state.error
        });
    }

    onArtifactTypeChange(artifact_type) {
        this.setStateAndName({artifact_type});
    }

    onManualEdit(manual_name) {
        this.setState({manual_name})
    }

    addSource(selection) {
        let {sources} = this.state;

        // Prevent duplicates
        for (let i = 0; i < sources.length; i++) {
            if (sources[i].length === selection.length && sources[i].every((x, j) => selection[j] === x)) {
                return;
            }
        }

        sources.push(selection);
        this.setStateAndName({sources, error: null});
    }

    removeSource(idx) {
        const sources = this.state.sources;
        sources.splice(idx, 1);
        this.setStateAndName({sources});
    }

    addTag(selection) {
        let {tags} = this.state;

        // Prevent duplicates
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].length === selection.length && tags[i].every((x, j) => selection[j] === x)) {
                return;
            }
        }

        tags.push(selection);
        this.setStateAndName({tags, error: null});
    }

    removeTag(idx) {
        const tags = this.state.tags;
        tags.splice(idx, 1);
        this.setStateAndName({tags, ...this.suggestName({tags})});
    }

    suggestName(diff) {
        const {
            content_type, language, lecturer, has_translation, sources, tags, capture_date, number, part,
            artifact_type
        } = Object.assign({}, this.state, diff || {});

        // pattern is the deepest node in the source chain with a pattern
        let pattern = "";
        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            for (let j = source.length - 1; j >= 0; j--) {
                const s = source[j];
                if (!!s.pattern) {
                    pattern = s.pattern;
                    break;
                }
            }
            if (pattern !== "") {
                break;
            }
        }

        // if no source take pattern from tags, same logic as above
        if (pattern === "") {
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                for (let j = tag.length - 1; j >= 0; j--) {
                    const t = tag[j];
                    if (!!t.pattern) {
                        pattern = t.pattern;
                        break;
                    }
                }
                if (pattern !== "") {
                    break;
                }
            }
        }

        // override lesson preparation value
        if (pattern === "" && part === 0) {
            pattern = "achana";
        }
        pattern = pattern.toLowerCase().trim();

        const name = (has_translation ? "mlt" : language) +
            "_o_" +
            lecturer +
            "_" +
            capture_date +
            "_" +
            CONTENT_TYPES_MAPPINGS[artifact_type === ARTIFACT_TYPES[0].value ? content_type : artifact_type].pattern +
            (pattern ? "_" + pattern : "") +
            "_n" +
            (number || 1) +
            "_" +
            "p" + part;

        return {
            pattern,
            auto_name: name.toLowerCase().trim(),
        };
    }

    validate() {
        if (this.isValidClassification()) {
            return true;
        }

        this.setState({error: "נא לבחור חומרי לימוד או תגיות"});
        return false;
    }

    isValidClassification() {
        const {sources, tags, part} = this.state;
        return sources.length !== 0 ||
            tags.length !== 0 ||
            part === 0;
    }

    renderSelectedSources() {
        const sources = this.state.sources;

        if (sources.length === 0) {
            return <List className="bb-selected-sources-list">
                <List.Item>
                    <Header as="h5" color="grey">אין חומרי לימוד</Header>
                </List.Item>
            </List>;
        }

        return <List className="bb-selected-sources-list">
            {sources.map((x, i) => {
                let title = x.map(y => y.name).join(", ");
                return <List.Item key={i}>
                    <Label basic color="blue" size="large">
                        {title}
                        <Icon name="delete" onClick={() => this.removeSource(i)}/>
                    </Label>
                </List.Item>
            })}
        </List>;
    }

    renderSelectedTags() {
        const tags = this.state.tags;

        if (tags.length === 0) {
            return <List className="bb-selected-sources-list">
                <List.Item>
                    <Header as="h5" color="grey">אין תגיות</Header>
                </List.Item>
            </List>;
        }

        return <div className="bb-selected-sources-list">
            {tags.map((x, i) => {
                return <Label basic key={i} color="pink" size="large">
                    {x[x.length - 1].label}
                    <Icon name="delete" onClick={() => this.removeTag(i)}/>
                </Label>
            })}
        </div>;
    }

    render() {
        const parts = [{text: "הכנה", value: 0}]
            .concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({text: "חלק " + i, value: i})));

        const {
            language,
            lecturer,
            has_translation,
            require_test,
            part,
            artifact_type,
            auto_name,
            manual_name,
            error
        } = this.state;
        const {availableSources, availableTags} = this.props;

        return <Grid stackable container>
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
                                <Header as="h5">חומר לימוד</Header>
                                <TreeItemSelector tree={availableSources} onSelect={x => this.addSource(x)}/>
                                {this.renderSelectedSources()}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">תגיות</Header>
                                <TreeItemSelector tree={availableTags}
                                                  fieldLabel={x => x.label}
                                                  onSelect={x => this.addTag(x)}/>
                                {this.renderSelectedTags()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">חלק</Header>
                                <Dropdown selection
                                          options={parts}
                                          value={part}
                                          onChange={(e, data) => this.onPartChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h5">סוג</Header>
                                <Dropdown selection
                                          options={ARTIFACT_TYPES}
                                          value={artifact_type}
                                          onChange={(e, data) => this.onArtifactTypeChange(data.value)}/>
                            </Grid.Column>
                        </Grid.Row>
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
                        <Grid.Row>
                            <Grid.Column>
                                <Checkbox label="צריך בדיקה"
                                          checked={require_test}
                                          onChange={(e, data) => this.onRequireTestChange(data.checked)}/>
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
                    {error ? <Label basic color="red" size="large">{error}</Label> : null}
                    <Button onClick={(e) => this.onCancel(e)}>בטל</Button>
                    <Button primary
                            onClick={(e) => this.onSubmit(e)}>שמור</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    };
}

export default LessonForm;