import React, {Component, PropTypes} from "react";
import {activateCollection, fetchSources, fetchTags, fetchTVShows} from "./Store";
import ContentTypeForm from "./ContentTypeForm";
import LessonForm from "./LessonForm";
import TVShowForm from "./TVShowForm";


class CIT extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        onComplete: PropTypes.func,
        onCancel: PropTypes.func,
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
        fetchTVShows((x) => this.setState({store: Object.assign({}, this.state.store, {tvshows: x})}));
    }

    onCTSelected(ct) {
        this.setState({metadata: {content_type: ct}});
    };

    onFormSubmit(metadata) {
        if (this.props.onComplete) {
            const data = Object.assign({}, this.state.metadata, metadata);
            this.props.onComplete(data);
        } else {
            this.onFormCancel();
        }
    }

    onFormCancel(e) {
        if (this.props.onCancel) {
            this.props.onCancel(e);
        } else {
            this.setState({metadata: CIT.defaultProps.metadata});
        }
    }

    onActivateShow(tvshow) {
        activateCollection(tvshow.id, () => {
            fetchTVShows((x) => this.setState({store: Object.assign({}, this.state.store, {tvshows: x})}));
        })
    }

    render() {
        const {store, metadata} = this.state;

        let el;
        if (!!metadata.content_type) {
            switch (metadata.content_type) {
                default:
                case "LESSON_PART":
                    el = <LessonForm availableSources={store.sources}
                                     availableTags={store.tags}
                                     metadata={this.props.metadata}
                                     onSubmit={(e, x) => this.onFormSubmit(x)}
                                     onCancel={(e) => this.onFormCancel(e)}/>;
                    break;
                case "VIDEO_PROGRAM_CHAPTER":
                    el = <TVShowForm tvshows={store.tvshows}
                                     metadata={this.props.metadata}
                                     onSubmit={(e, x) => this.onFormSubmit(x)}
                                     onCancel={(e) => this.onFormCancel(e)}
                                     onActivateShow={(e, x) => this.onActivateShow(x)}/>;
                    break;
            }

        } else {
            el = <ContentTypeForm onSelect={(x) => this.onCTSelected(x)}/>;
        }

        return <div style={{direction: 'rtl'}}>
            {el}
        </div>;
    }
}

export default CIT;