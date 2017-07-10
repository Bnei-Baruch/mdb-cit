import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Grid } from 'semantic-ui-react';

import {
  CT_CHILDREN_LESSON_PART,
  CT_CLIP,
  CT_EVENT_PART,
  CT_FRIENDS_GATHERING,
  CT_LECTURE,
  CT_LESSON_PART,
  CT_MEAL,
  CT_TRAINING,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON_PART
} from '../shared/consts';

const otherOptions = [
  { text: 'קליפ', value: CT_CLIP },
  { text: 'שיעור וירטואלי', value: CT_VIRTUAL_LESSON },
  { text: 'הרצאה', value: CT_LECTURE },
  { text: 'הכשרה', value: CT_TRAINING },
  { text: 'שיעור נשים', value: CT_WOMEN_LESSON_PART },
  { text: 'שיעור ילדים', value: CT_CHILDREN_LESSON_PART },
];

const ContentTypeForm = props => (
  <Grid columns="equal">
    <Grid.Row columns={2}>
      <Grid.Column>
        <Button
          fluid
          content="שיעור"
          color="blue"
          size="massive"
          onClick={() => props.onSelect(CT_LESSON_PART)}
        />
      </Grid.Column>
      <Grid.Column>
        <Button
          fluid
          content="תכנית טלוויזיה"
          color="teal"
          size="massive"
          onClick={() => props.onSelect(CT_VIDEO_PROGRAM_CHAPTER)}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row columns={2}>
      <Grid.Column>
        <Button
          fluid
          content="ישיבת חברים"
          color="teal"
          size="massive"
          onClick={() => props.onSelect(CT_FRIENDS_GATHERING)}
        />
      </Grid.Column>
      <Grid.Column>
        <Button
          fluid
          content="סעודה"
          color="teal"
          size="massive"
          onClick={() => props.onSelect(CT_MEAL)}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row columns={2}>
      <Grid.Column>
        <Button
          fluid
          content="אירוע מיוחד"
          color="yellow"
          size="massive"
          onClick={() => props.onSelect(CT_EVENT_PART)}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Dropdown
          fluid
          selection
          placeholder="אחר"
          options={otherOptions}
          onChange={(e, data) => props.onSelect(data.value)}
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

ContentTypeForm.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default ContentTypeForm;
