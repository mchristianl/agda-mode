import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import { View } from '../../types';

interface Props {
    // initial: number;
    onResizeStart?: (pageY: number) => void;
    onResize?: (offset: number) => void;
    onResizeEnd?: (pageY: number) => void;
}

interface State {
    initial: number
}

class SizingHandle extends React.Component<Props, State> {
    render() {
        const { onResizeStart, onResize, onResizeEnd } = this.props;
        return (
            <div className="agda-sizing-handle-anchor">
                <div
                    className="agda-sizing-handle native-key-bindings"
                    onDragStart={(e) => {
                        this.setState({
                            initial: e.pageY
                        })
                        if (onResizeStart)
                            onResizeStart(e.pageY);
                    }}
                    onDrag={(e) => {
                        if (e.pageY !== 0) {    // filter wierd noise out
                            const offset = e.pageY - this.state.initial;
                            if (offset !== 0) {
                                if (onResize)
                                    onResize(offset);
                                this.setState({
                                    initial: e.pageY
                                });
                            }
                        }
                    }}
                    onDragEnd={(e) => {
                        if (onResizeEnd)
                            onResizeEnd(e.pageY);
                    }}
                    // to enable Drag & Drop
                    draggable="true"
                    tabIndex="-1"
                ></div>
            </div>
        )
    }
}

export default SizingHandle;