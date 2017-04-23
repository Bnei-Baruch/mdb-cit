import React, {Component, PropTypes} from "react";
import {activateCollection, fetchCollections, fetchSources, fetchTags} from "./Store";
import ContentTypeForm from "./ContentTypeForm";
import LessonForm from "./LessonForm";
import TVShowForm from "./TVShowForm";
import EventPartForm from "./EventPartForm";
import GenericContentForm from "./GenericContentForm";
import {CT_EVENT_PART, CT_LESSON_PART, CT_VIDEO_PROGRAM_CHAPTER, EVENT_CONTENT_TYPES} from "./consts";


class CIT extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        onComplete: PropTypes.func,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        metadata: {
            content_type: null,
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            content_type: props.metadata.content_type,
            store: {
                sources: [],
                tags: [],
                collections: new Map(),
            },
        };
    }

    componentDidMount() {
        fetchSources((sources) => this.setState({store: {...this.state.store, sources}}));
        fetchTags((tags) => this.setState({store: {...this.state.store, tags}}));
        fetchCollections((collections) => this.setState({store: {...this.state.store, collections}}));
    }

    onCTSelected(content_type) {
        this.setState({content_type});
    };

    onFormSubmit(metadata) {
        if (this.props.onComplete) {
            this.props.onComplete(metadata);
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
        const metadata = this.props.metadata;

        let el;
        if (!!content_type) {

            // This is here to allow reloading compatibility with given metadata saved from EventForm
            if (EVENT_CONTENT_TYPES.includes(metadata.collection_type)) {
                el = <EventPartForm metadata={{...metadata, content_type}}
                                    onSubmit={(e, x) => this.onFormSubmit(x)}
                                    onCancel={(e) => this.onFormCancel(e)}
                                    collections={store.collections}/>;
            } else {
                switch (content_type) {
                    case CT_LESSON_PART:
                        el = <LessonForm metadata={{...metadata, content_type}}
                                         onSubmit={(e, x) => this.onFormSubmit(x)}
                                         onCancel={(e) => this.onFormCancel(e)}
                                         availableSources={store.sources}
                                         availableTags={store.tags}/>;
                        break;

                    case CT_VIDEO_PROGRAM_CHAPTER:
                        el = <TVShowForm metadata={{...metadata, content_type}}
                                         onSubmit={(e, x) => this.onFormSubmit(x)}
                                         onCancel={(e) => this.onFormCancel(e)}
                                         collections={store.collections}
                                         onActivateShow={(e, x) => this.onActivateShow(x)}/>;
                        break;

                    case CT_EVENT_PART:
                        el = <EventPartForm metadata={{...metadata, content_type}}
                                            onSubmit={(e, x) => this.onFormSubmit(x)}
                                            onCancel={(e) => this.onFormCancel(e)}
                                            collections={store.collections}/>;
                        break;

                    default:
                        el = <GenericContentForm metadata={{...metadata, content_type}}
                                                 onSubmit={(e, x) => this.onFormSubmit(x)}
                                                 onCancel={(e) => this.onFormCancel(e)}/>;
                        break;
                }
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