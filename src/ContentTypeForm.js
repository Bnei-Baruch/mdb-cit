import React, {PropTypes} from "react";
import {Grid, Button, Dropdown, Header} from "semantic-ui-react";

const ContentTypeForm = (props) => {

    const otherOptions = [
        {text: "שיעור קמפוס", value: "CAMPUS_LESSON"},
        {text: "שיעור לרנינג סנטר", value: "LC_LESSON"},
        {text: "שיעור וירטואלי", value: "VIRTUAL_LESSON"},
        {text: "שיעור נשים", value: "WOMEN_LESSON_PART"},
        {text: "שיעור ילדים", value: "CHILDREN_LESSON_PART"},
        {text: "הרצאה", value: "LECTURE"},
    ];

    return <Grid columns="equal">
            <Grid.Row>
                <Grid.Column>
                    <Header size="huge" textAlign="left">בחר סוג תוכן</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Button fluid
                            color="blue"
                            size="massive"
                            onClick={() => props.onSelect("LESSON_PART")}>
                        שיעור
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button fluid
                            color="teal"
                            size="massive"
                            onClick={() => props.onSelect("VIDEO_PROGRAM_CHAPTER")}>
                        תכנית טלוויזיה
                    </Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Button fluid
                            color="teal"
                            size="massive"
                            onClick={() => props.onSelect("FRIENDS_GATHERING")}>
                        ישיבת חברים
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button fluid
                            color="teal"
                            size="massive"
                            onClick={() => props.onSelect("MEAL")}>
                        סעודה
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