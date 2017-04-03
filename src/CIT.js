import React, {Component, PropTypes} from "react";
import {Container} from "semantic-ui-react";
import {fetchSources, fetchTags} from "./Store";
import ContentTypeForm from "./ContentTypeForm";
import LessonForm from "./LessonForm";
import TVShowForm from "./TVShowForm";

import "../semantic/dist/semantic.rtl.min.css";

class CIT extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        onComplete: PropTypes.func,
    };

    static defaultProps = {
        metadata: {
            content_type: null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            metadata: props.metadata,
            store: {
                sources: [],
                tags: [],
                tvshows: [],
            },
        };
    }

    componentDidMount() {
        fetchSources((x) => this.setState({store: Object.assign({}, this.state.store, {sources: x})}));
        fetchTags((x) => this.setState({store: Object.assign({}, this.state.store, {tags: x})}));
    }

    onCTSelected(ct) {
        this.setState({metadata: {content_type: ct}});
    };

    onFormSubmit(metadata) {
        const data = Object.assign({}, this.state.metadata, metadata);
        console.log("Submit: ", data);

        // Call back if asked for
        if (!!this.props.onComplete) {
            this.props.onComplete(data);
        }

        // Clear internal state
        this.onFormCancel();
    }

    onFormCancel() {
        this.setState({metadata: CIT.defaultProps.metadata});
    }

    render() {
        const {store, metadata} = this.state;

        let el;
        if (!!metadata.content_type) {
            switch (metadata.content_type) {
                default:
                case "LESSON_PART":
                    el = <LessonForm sources={store.sources}
                                     tags={store.tags}
                                     metadata={this.props.metadata}
                                     onSubmit={(x) => this.onFormSubmit(x)}
                                     onCancel={() => this.onFormCancel()}/>;
                    break;
                case "VIDEO_PROGRAM_CHAPTER":
                    el = <TVShowForm onSubmit={(x) => this.onFormSubmit(x)}
                                     onCancel={() => this.onFormCancel()}/>;
                    break;
            }

        } else {
            el = <ContentTypeForm onSelect={(x) => this.onCTSelected(x)}/>;
        }

        return <Container text style={{direction: 'rtl'}}>
            {el}
        </Container>;
    }
}

export default CIT;