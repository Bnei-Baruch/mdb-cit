import React, {Component, PropTypes} from "react";
import {Breadcrumb, Button, Dropdown} from "semantic-ui-react";

class TreeItemSelector extends Component {

    static propTypes = {
        tree: PropTypes.array.isRequired,
        fieldLabel: PropTypes.func,
        onSelect: PropTypes.func.isRequired
    };

    static defaultProps = {
        fieldLabel: x => x.name
    };

    constructor(props) {
        super(props);
        this.state = {
            selection: []
        };
    }

    onSelectionChange(level, idx, isFinal) {
        this.setState({selection: this.state.selection.slice(0, level).concat([idx])},
            () => {
                // UX shortcut for "final" selection when hitting a leaf node
                if (isFinal) {
                    this.onFinalSelection();
                }
            }
        );
    }

    onFinalSelection() {
        const selection = this.state.selection;

        // Map index selection to real nodes
        let l = this.props.tree,
            nodes = [];
        for (let i = 0; i < selection.length; i++) {
            const node = l[selection[i]];
            nodes.push(node);
            l = node.children || [];
        }

        this.props.onSelect(nodes);
    }

    renderLevelDropdown(level, idx, text) {
        return <Dropdown text={text} scrolling>
            <Dropdown.Menu>
                {level.map((x, j) =>
                    <Dropdown.Item key={j}
                                   text={j + 1 + ". " + this.props.fieldLabel(x)}
                                   onClick={(e, data) =>
                                       this.onSelectionChange(idx, j, (x.children || []).length === 0)}/>)}
            </Dropdown.Menu>
        </Dropdown>
    }

    render() {
        const {tree, fieldLabel} = this.props;
        const selection = this.state.selection;

        let crumbs = [],
            level = tree;

        for (let i = 0; i < selection.length; i++) {
            let selectedChild = level[selection[i]],
                nextLevel = selectedChild.children || [],
                nlHasChildren = nextLevel.length > 0;

            crumbs.push((<Breadcrumb.Section key={i} link={nlHasChildren} active={!nlHasChildren}>
                {this.renderLevelDropdown(level, i, fieldLabel(selectedChild))}
            </Breadcrumb.Section>));
            if (nlHasChildren) {
                crumbs.push(<Breadcrumb.Divider key={"d" + i} icon='left angle'/>);
            }
            level = nextLevel;
        }

        if (level.length > 0) {
            crumbs.push((<Breadcrumb.Section key={selection.length} active>
                {this.renderLevelDropdown(level, selection.length + 1, "בחר מהרשימה")}
            </Breadcrumb.Section>));
        }

        let btn = (selection.length > 0) ?
            <Button size="mini"
                    floated="right"
                    color="blue"
                    onClick={() => this.onFinalSelection()}>
                הוסף
            </Button>
            : null;

        return <div>
            <Breadcrumb>
                {crumbs}
            </Breadcrumb>
            {btn}
        </div>
    }
}

export default TreeItemSelector;