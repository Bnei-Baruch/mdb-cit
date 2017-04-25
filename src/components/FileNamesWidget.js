import React, {PropTypes} from "react";
import {Input, Table} from "semantic-ui-react";

const FileNamesWidget = (props) => {
    const {auto_name, manual_name, onChange} = props;

    return <Table celled definition>
        <Table.Body>
            <Table.Row>
                <Table.Cell collapsing>שם אוטומטי</Table.Cell>
                <Table.Cell>{auto_name}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>שם ידני</Table.Cell>
                <Table.Cell>
                    <Input fluid
                           size="small"
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