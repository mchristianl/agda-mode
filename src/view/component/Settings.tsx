import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
// import { View } from '../../type';
import { Core } from '../../core';
import { View } from '../../type';
import * as Action from '../actions';

import Breadcrumb from './Settings/Breadcrumb';
import Connection from './Settings/Connection';
import Protocol from './Settings/Protocol';
import ReqRes from './Settings/Protocol/ReqRes';

type OwnProps = React.HTMLProps<HTMLElement> & {
    core: Core;
}
type InjProps = {
    uri: View.SettingsURI;
    protocol: View.Protocol,
}

type DispatchProps = {
    navigate: (path: View.SettingsURI) => () => void
}
type Props = OwnProps & InjProps & DispatchProps;

function mapStateToProps(state: View.State): InjProps {
    return {
        uri: state.view.settingsURI,
        protocol: state.protocol,
    }
}

function mapDispatchToProps(dispatch): DispatchProps {
    return {
        navigate: (uri: View.SettingsURI) => () => {
            dispatch(Action.VIEW.navigate(uri));
        }
    };
}

class Settings extends React.Component<Props, {}> {

    constructor(props) {
        super(props);
        // this.tabClassName = this.tabClassName.bind(this);
        // this.panelClassName = this.panelClassName.bind(this);
        this.props.core.connection.disconnect = this.props.core.connection.disconnect.bind(this);
    }

    render() {
        return (
            <section
                className='agda-settings'
                tabIndex={-1}
            >
                <Breadcrumb
                    navigate={this.props.navigate}
                    uri={this.props.uri}
                />
                <div className='agda-settings-pages'>
                    <ul
                        className={classNames('agda-settings-menu', this.at({path: '/'}))}
                    >
                        <li
                            onClick={this.props.navigate({path: '/Connection'})}
                        >
                            <span className='icon icon-plug'>Connection</span>
                        </li>
                        <li
                            onClick={this.props.navigate({path: '/Protocol'})}
                        >
                            <span className='icon icon-comment-discussion'>Protocol</span>
                        </li>
                    </ul>
                    <Connection
                        className={this.at({path: '/Connection'})}
                        core={this.props.core}
                    />
                    <Protocol
                        core={this.props.core}
                        className={this.at({path: '/Protocol'})}
                    />
                    <ReqRes
                        className={this.at({path: '/Protocol/*'})}
                        log={this.props.protocol.log}
                        index={this.props.uri.param}
                    />
                </div>
            </section>
        )
    }

    at(uri: View.SettingsURI): string {
        return classNames({
            'hidden': uri.path !== this.props.uri.path
        })
    }
}

export default connect<InjProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
