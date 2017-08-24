import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {
  CT_EVENT_PART,
  CT_LESSON_PART,
  CT_UNKNOWN,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  EVENT_CONTENT_TYPES
} from './shared/consts';
import { Metadata } from './shared/shapes';
import { activateCollection, fetchCollections, fetchSources, fetchTags } from './shared/store';
import ContentTypeForm from './forms/ContentTypeForm';
import LessonForm from './forms/LessonForm';
import TVShowForm from './forms/TVShowForm';
import VirtualLessonForm from './forms/VirtualLessonForm';
import EventPartForm from './forms/EventPartForm';
import GenericContentForm from './forms/GenericContentForm';

import './forms/forms.css';

class CIT extends Component {
  static propTypes = {
    metadata: Metadata,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    metadata: {
      content_type: null,
    },
    onComplete: noop,
    onCancel: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      metadata: { ...props.metadata },
      store: {
        sources: [],
        tags: [],
        collections: new Map(),
      },
    };
  }

  componentDidMount() {
    fetchSources(sources => this.setState({ store: { ...this.state.store, sources } }));
    fetchTags(tags => this.setState({ store: { ...this.state.store, tags } }));
    fetchCollections(collections => this.setState({ store: { ...this.state.store, collections } }));
  }

  onCTSelected = (contentType) => {
    this.setState({ metadata: { ...this.state.metadata, content_type: contentType } });
  };

  onFormSubmit = (e, metadata) => {
    if (this.props.onComplete) {
      this.props.onComplete(metadata);
    } else {
      this.onFormCancel();
    }
  };

  onFormCancel = (e) => {
    if (this.props.onCancel) {
      this.props.onCancel(e);
    } else {
      this.onCTSelected(null);
    }
  };

  onClear = () => {
    // make a fresh copy of input metadata
    const metadata = { ...this.props.metadata };

    // set content_type to UNKNOWN
    metadata.content_type = CT_UNKNOWN;

    // delete all fields coming from us (leave what's given from external embedder, i.e. workflow)
    [
      'manual_name',
      'collection_uid',
      'collection_type',
      'sources',
      'tags',
      'artifact_type',
      'number',
      'part',
      'part_type',
      'episode',
      'pattern',
      'major',
    ].forEach(f => delete metadata[f]);

    this.setState({ metadata });
  };

  onActivateShow(tvshow) {
    activateCollection(tvshow.id, () =>
      fetchCollections(x => this.setState({ store: { ...this.state.store, collections: x } }))
    );
  }

  render() {
    const { store, metadata } = this.state;

    let el;
    if (metadata.content_type && metadata.content_type !== CT_UNKNOWN) {
      // This is here to allow reloading compatibility with given metadata saved from EventForm
      if (EVENT_CONTENT_TYPES.includes(metadata.collection_type)) {
        el = (
          <EventPartForm
            metadata={metadata}
            onSubmit={this.onFormSubmit}
            onCancel={this.onFormCancel}
            onClear={this.onClear}
            collections={store.collections}
          />
        );
      } else {
        switch (metadata.content_type) {
        case CT_LESSON_PART:
          el = (
            <LessonForm
              metadata={metadata}
              onSubmit={this.onFormSubmit}
              onCancel={this.onFormCancel}
              onClear={this.onClear}
              availableSources={store.sources}
              availableTags={store.tags}
            />
          );
          break;

        case CT_VIDEO_PROGRAM_CHAPTER:
          el = (
            <TVShowForm
              metadata={metadata}
              onSubmit={this.onFormSubmit}
              onCancel={this.onFormCancel}
              onClear={this.onClear}
              collections={store.collections}
              onActivateShow={(e, x) => this.onActivateShow(x)}
            />
          );
          break;

        case CT_EVENT_PART:
          el = (
            <EventPartForm
              metadata={metadata}
              onSubmit={this.onFormSubmit}
              onCancel={this.onFormCancel}
              onClear={this.onClear}
              collections={store.collections}
              availableTags={store.tags}
            />
          );
          break;

        case CT_VIRTUAL_LESSON:
          el = (
            <VirtualLessonForm
              metadata={metadata}
              onSubmit={this.onFormSubmit}
              onCancel={this.onFormCancel}
              onClear={this.onClear}
              collections={store.collections}
            />
          );
          break;
        default:
          el = (
            <GenericContentForm
              metadata={metadata}
              onSubmit={this.onFormSubmit}
              onCancel={this.onFormCancel}
              onClear={this.onClear}
            />
          );
          break;
        }
      }
    } else {
      el = <ContentTypeForm onSelect={this.onCTSelected} />;
    }

    return (
      <div style={{ direction: 'rtl' }}>
        {el}
      </div>
    );
  }
}

export default CIT;
