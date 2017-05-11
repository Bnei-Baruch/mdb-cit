import React, {PropTypes} from "react";
import {Icon, Input, Popup, Table} from "semantic-ui-react";

const FileNamesWidget = (props) => {
    const {auto_name, manual_name, onChange} = props;

    return <Table celled>
        <Table.Body>
            <Table.Row>
                <Table.Cell collapsing>שם אוטומטי</Table.Cell>
                <Table.Cell style={{direction: "ltr"}}>{auto_name}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    שם ידני
                    &nbsp;&nbsp;
                    <Popup trigger={<Icon name="help circle outline" color="teal"/>}
                           position="top right"
                           style={{direction: "rtl", textAlign:"right"}}
                           header="שם ידני"
                           content="לשם הקובץ אין השפעה על המערכת, הוא ניתן אך ורק לצורכי תצוגה."/>
                </Table.Cell>
                <Table.Cell style={{padding: "0", direction: "ltr"}}>
                    <Input fluid
                           size="small"
                           placeholder="שנה שם אוטומטי"
                           className="bb-manual-name-input"
                           value={manual_name ? manual_name : ""}
                           focus={manual_name && manual_name !== auto_name}
                           onChange={onChange}/>
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>שם סופי</Table.Cell>
                <Table.Cell style={{direction: "ltr"}}>{manual_name || auto_name}</Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>;
};

FileNamesWidget.propTypes = {
    onChange: PropTypes.func.isRequired,
    auto_name: PropTypes.string,
    manual_name: PropTypes.string,
};

export default FileNamesWidget;