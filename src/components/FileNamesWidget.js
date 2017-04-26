import React, {PropTypes} from "react";
import {Input, Table} from "semantic-ui-react";

const FileNamesWidget = (props) => {
    const {auto_name, manual_name, onChange} = props;

    return <Table celled>
        <Table.Body>
            <Table.Row>
                <Table.Cell collapsing>שם אוטומטי</Table.Cell>
                <Table.Cell>{auto_name}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>שם ידני</Table.Cell>
                <Table.Cell style={{padding: "0 0.5rem"}}>
                    <Input fluid
                           size="small"
                           placeholder="שנה שם אוטומטי"
                           className="bb-manual-name-input"
                           value={!!manual_name ? manual_name : ""}
                           focus={!!manual_name && manual_name !== auto_name}
                           onChange={onChange}/>
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>שם סופי</Table.Cell>
                <Table.Cell>{manual_name || auto_name}</Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>;
};

FileNamesWidget.propTypes = {
    onChange: PropTypes.func.isRequired,
    auto_name: PropTypes.string,
    manual_name: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default FileNamesWidget;