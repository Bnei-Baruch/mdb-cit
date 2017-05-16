import React, {PropTypes} from "react";
import {Button, Dropdown, Grid} from "semantic-ui-react";
import {
    CT_CHILDREN_LESSON_PART,
    CT_CLIP,
    CT_EVENT_PART,
    CT_FRIENDS_GATHERING,
    CT_VIRTUAL_LESSON,
    CT_LECTURE,
    CT_LESSON_PART,
    CT_MEAL,
    CT_TRAINING,
    CT_VIDEO_PROGRAM_CHAPTER,
    CT_WOMEN_LESSON_PART
} from "../shared/consts";

const ContentTypeForm = (props) => {

    const otherOptions = [
        {text: "קליפ", value: CT_CLIP},
        {text: "שיעור וירטואלי", value: CT_VIRTUAL_LESSON},
        {text: "הרצאה", value: CT_LECTURE},
        {text: "הכשרה", value: CT_TRAINING},
        {text: "שיעור נשים", value: CT_WOMEN_LESSON_PART},
        {text: "שיעור ילדים", value: CT_CHILDREN_LESSON_PART},
    ];

    return <Grid columns="equal">
        <Grid.Row columns={2}>
            <Grid.Column>
                <Button fluid
                        color="blue"
                        size="massive"
                        onClick={() => props.onSelect(CT_LESSON_PART)}>
                    שיעור
                </Button>
            </Grid.Column>
            <Grid.Column>
                <Button fluid
                        color="teal"
                        size="massive"
                        onClick={() => props.onSelect(CT_VIDEO_PROGRAM_CHAPTER)}>
                    תכנית טלוויזיה
                </Button>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
            <Grid.Column>
                <Button fluid
                        color="teal"
                        size="massive"
                        onClick={() => props.onSelect(CT_FRIENDS_GATHERING)}>
                    ישיבת חברים
                </Button>
            </Grid.Column>
            <Grid.Column>
                <Button fluid
                        color="teal"
                        size="massive"
                        onClick={() => props.onSelect(CT_MEAL)}>
                    סעודה
                </Button>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
            <Grid.Column>
                <Button fluid
                        color="yellow"
                        size="massive"
                        onClick={() => props.onSelect(CT_EVENT_PART)}>
                    אירוע מיוחד
                </Button>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column>
                <Dropdown fluid
                          selection
                          placeholder="אחר"
                          options={otherOptions}
                          onChange={(e, data) => props.onSelect(data.value)}/>
            </Grid.Column>
        </Grid.Row>
    </Grid>;
};

ContentTypeForm.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default ContentTypeForm;