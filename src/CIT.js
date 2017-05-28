import React, {Component, PropTypes} from "react";
import {activateCollection, fetchCollections, fetchSources, fetchTags} from "./shared/store";
import ContentTypeForm from "./forms/ContentTypeForm";
import LessonForm from "./forms/LessonForm";
import TVShowForm from "./forms/TVShowForm";
import VirtualLessonForm from "./forms/VirtualLessonForm";
import EventPartForm from "./forms/EventPartForm";
import GenericContentForm from "./forms/GenericContentForm";
import {
    CT_EVENT_PART,
    CT_LESSON_PART,
    CT_UNKNOWN,
    CT_VIDEO_PROGRAM_CHAPTER,
    CT_VIRTUAL_LESSON,
    EVENT_CONTENT_TYPES
} from "./shared/consts";

import "./forms/forms.css";

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
            metadata: {...props.metadata},
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
        this.setState({metadata: {...this.state.metadata, content_type}});
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
            this.onCTSelected(null);
        }
    }

    onClear(e) {
        // make a fresh copy of input metadata
        const metadata = {...this.props.metadata};

        // set content_type to UNKNOWN
        metadata.content_type = CT_UNKNOWN;

        // delete all fields coming from us (leave what's given from external embedder, i.e. workflow)
        for (const f of ["manual_name", "collection_uid", "collection_type", "sources", "tags", "artifact_type",
            "number", "part", "part_type", "episode", "pattern",]) {
            delete metadata[f];
        }

        this.setState({metadata});
    }

    onActivateShow(tvshow) {
        activateCollection(tvshow.id, () =>
            fetchCollections((x) => this.setState({store: {...this.state.store, collections: x}}))
        )
    }

    render() {
        const {store, metadata} = this.state;

        let el;
        if (!!metadata.content_type && metadata.content_type !== CT_UNKNOWN) {

            // This is here to allow reloading compatibility with given metadata saved from EventForm
            if (EVENT_CONTENT_TYPES.includes(metadata.collection_type)) {
                el = <EventPartForm metadata={metadata}
                                    onSubmit={(e, x) => this.onFormSubmit(x)}
                                    onCancel={(e) => this.onFormCancel(e)}
                                    onClear={(e) => this.onClear(e)}
                                    collections={store.collections}/>;
            } else {
                switch (metadata.content_type) {
                    case CT_LESSON_PART:
                        el = <LessonForm metadata={metadata}
                                         onSubmit={(e, x) => this.onFormSubmit(x)}
                                         onCancel={(e) => this.onFormCancel(e)}
                                         onClear={(e) => this.onClear(e)}
                                         availableSources={store.sources}
                                         availableTags={store.tags}/>;
                        break;

                    case CT_VIDEO_PROGRAM_CHAPTER:
                        el = <TVShowForm metadata={metadata}
                                         onSubmit={(e, x) => this.onFormSubmit(x)}
                                         onCancel={(e) => this.onFormCancel(e)}
                                         onClear={(e) => this.onClear(e)}
                                         collections={store.collections}
                                         onActivateShow={(e, x) => this.onActivateShow(x)}/>;
                        break;

                    case CT_EVENT_PART:
                        el = <EventPartForm metadata={metadata}
                                            onSubmit={(e, x) => this.onFormSubmit(x)}
                                            onCancel={(e) => this.onFormCancel(e)}
                                            onClear={(e) => this.onClear(e)}
                                            collections={store.collections}/>;
                        break;

                    case CT_VIRTUAL_LESSON:
                        el = <VirtualLessonForm metadata={metadata}
                                                onSubmit={(e, x) => this.onFormSubmit(x)}
                                                onCancel={(e) => this.onFormCancel(e)}
                                                onClear={(e) => this.onClear(e)}
                                                collections={store.collections}/>;
                        break;
                    default:
                        el = <GenericContentForm metadata={metadata}
                                                 onSubmit={(e, x) => this.onFormSubmit(x)}
                                                 onCancel={(e) => this.onFormCancel(e)}
                                                 onClear={(e) => this.onClear(e)}/>;
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