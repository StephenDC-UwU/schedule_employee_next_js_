import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { select } from '@syncfusion/ej2-base';

export class PropertyPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobilePropPane: null,
            isMobile: false
        };
    }

    componentDidMount() {
        const mobilePropPane = select('.sb-mobile-prop-pane');
        const isMobile = window.matchMedia('(max-width:550px)').matches;
        this.setState({ mobilePropPane, isMobile });
    }

    render() {
        const { mobilePropPane, isMobile } = this.state;

        const panel = (
            <div className='property-panel-section !mt-5'>
                <div className="property-panel-header">{this.props.title}</div>
                <div className="property-panel-content">{this.props.children}</div>
            </div>
        );

        return isMobile && mobilePropPane
            ? ReactDOM.createPortal(panel, mobilePropPane)
            : panel;
    }
}