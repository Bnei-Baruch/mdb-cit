import React, {Component, PropTypes} from "react";
import {activateCollection, fetchCollections, fetchSources, fetchTags} from "./Store";
import ContentTypeForm from "./ContentTypeForm";
import LessonForm from "./LessonForm";
import TVShowForm from "./TVShowForm";
import GenericContentForm from "./GenericContentForm";
import {CONTENT_TYPE_IDS, CT_VIDEO_PROGRAM, CT_LESSON_PART, CT_VIDEO_PROGRAM_CHAPTER} from "./consts";


class CIT extends Component {
    static propTypes = {
        onComplete: PropTypes.func,
        onCancel: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            content_type: props.metadata ? props.metadata.content_type : null,
            store: {
                sources: [],
                tags: [],
                collections: {},
            },
        };
    }

    componentDidMount() {
        fetchSources((x) => this.setState({store: Object.assign({}, this.state.store, {sources: x})}));
        fetchTags((x) => this.setState({store: Object.assign({}, this.state.store, {tags: x})}));
        fetchCollections((x) => this.setState({store: {...this.state.store, collections: x}}));
    }

    onCTSelected(content_type) {
        this.setState({content_type});
    };

    onFormSubmit(metadata) {
        if (this.props.onComplete) {
            const data = {...metadata, content_type: this.state.content_type};
            this.props.onComplete(data);
        } else {
            this.onFormCancel();
        }
    }

    onFormCancel(e) {
        if (this.props.onCancel) {
            this.props.onCancel(e);
        } else {
            this.setState({content_type: null});
        }
    }

    onActivateShow(tvshow) {
        activateCollection(tvshow.id, () =>
            fetchCollections((x) => this.setState({store: {...this.state.store, collections: x}}))
        )
    }

    render() {
        const {store, content_type} = this.state;

        let el;
        if (!!content_type) {
            switch (content_type) {
                case CT_LESSON_PART:
                    el = <LessonForm metadata={{...this.props.metadata, content_type}}
                                     onSubmit={(e, x) => this.onFormSubmit(x)}
                                     onCancel={(e) => this.onFormCancel(e)}
                                     availableSources={store.sources}
                                     availableTags={store.tags}
                                     availableEvents={store.collections}/>;
                    break;
                case CT_VIDEO_PROGRAM_CHAPTER:
                    el = <TVShowForm metadata={{...this.props.metadata, content_type}}
                                     onSubmit={(e, x) => this.onFormSubmit(x)}
                                     onCancel={(e) => this.onFormCancel(e)}
                                     tvshows={store.collections[CONTENT_TYPE_IDS[CT_VIDEO_PROGRAM]]}
                                     onActivateShow={(e, x) => this.onActivateShow(x)}/>;
                    break;
                default:
                    el = <GenericContentForm metadata={{...this.props.metadata, content_type}}
                                             onSubmit={(e, x) => this.onFormSubmit(x)}
                                             onCancel={(e) => this.onFormCancel(e)}/>;
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