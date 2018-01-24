import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

import { ARTIFACT_TYPES, CONTENT_TYPES_MAPPINGS } from '../shared/consts';
import BaseForm from './BaseForm';

class LessonForm extends BaseForm {

  suggestName(diff) {
    const {
            content_type: contentType,
            language,
            lecturer,
            has_translation: hasTranslation,
            sources,
            tags,
            capture_date: captureDate,
            film_date: filmDate,
            number,
            part,
            artifact_type: artifactType,
            major
          } = Object.assign({}, this.state, diff || {});

    let pattern = '';

    if (major.type) {
      const selection = major.type === 'source' ? sources : tags;
      const item      = selection[major.idx];
      if (Array.isArray(item)) {
        // pattern is the deepest node in the chain with a pattern
        for (let j = item.length - 1; j >= 0; j--) {
          const x = item[j];
          if (x.pattern) {
            pattern = x.pattern;
            break;
          }
        }
      }
    }

    // Note: We keep the 2 following paragraphs for cases where
    // major has no pattern in it's chain.
    // In such cases we take what we have if possible.

    // pattern is the deepest node in the chain with a pattern
    for (let i = 0; pattern === '' && i < tags.length; i++) {
      const tag = tags[i];
      for (let j = tag.length - 1; j >= 0; j--) {
        const t = tag[j];
        if (t.pattern) {
          pattern = t.pattern;
          break;
        }
      }
    }

    // if no tag was selected take pattern from sources, same logic as above
    for (let i = 0; pattern === '' && i < sources.length; i++) {
      const source = sources[i];
      for (let j = source.length - 1; j >= 0; j--) {
        const s = source[j];
        if (s.pattern) {
          pattern = s.pattern;
          break;
        }
      }
    }

    // override lesson preparation value
    if (pattern === '' && part === 0) {
      pattern = 'achana';
    }
    pattern = pattern.toLowerCase().trim();

    // eslint-disable-next-line prefer-template
    const name = (hasTranslation ? 'mlt' : language) +
      '_o_' +
      lecturer +
      '_' +
      (this.props.metadata.label_id ? filmDate : captureDate) +
      '_' +
      CONTENT_TYPES_MAPPINGS[artifactType === ARTIFACT_TYPES[0].value ? contentType : artifactType].pattern +
      (pattern ? `_${pattern}` : '') +
      '_n' +
      (number || 1) +
      '_' +
      'p' + part;

    return {
      pattern,
      auto_name: name.toLowerCase().trim(),
    };
  }

  validate() {
    if (this.isValidClassification()) {
      return true;
    }

    this.setState({ error: 'נא לבחור חומרי לימוד או תגיות' });
    return false;
  }

  isValidClassification() {
    const { sources, tags, part, artifact_type: artifactType } = this.state;
    return sources.length !== 0 ||
      tags.length !== 0 ||
      part === 0 ||
      artifactType !== 'main';
  }

  // eslint-disable-next-line class-methods-use-this
  renderHeader() {
    return <Header as="h2" color="blue">פרטי השיעור</Header>;
  }

  renderForm() {
    const { metadata } = this.props;

    return (
      <Grid.Row columns={2} className="bb-interesting">
        <Grid.Column width={12}>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                {this.renderTags()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderSources()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column width={4}>
          <Grid className="bb-less-interesting">
            <Grid.Row>
              <Grid.Column>
                {this.renderPart()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderArtifactType()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderLanguage()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderLecturer()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderHasTranslation()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderRequireTest()}
              </Grid.Column>
            </Grid.Row>
            {
              metadata.label_id ?
                <Grid.Row>
                  <Grid.Column>
                    {this.renderFilmDate()}
                  </Grid.Column>
                </Grid.Row> :
                null
            }
          </Grid>
        </Grid.Column>
      </Grid.Row>
    );
  }

}

export default LessonForm;
