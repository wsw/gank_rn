import React, { Component, PropTypes } from 'react';
import { View, WebView, Platform } from 'react-native';
import { connect } from 'react-redux';

import CustomTitleBarComp from '../comp/CustomTitleBarComp';
import HorizontalProgressComp from '../comp/HorizontalProgressComp';
import CommonLoadView from '../comp/CommonLoadView';
import { TITLE_BAR_HEIGHT } from '../GlobalConst';

class WebViewPage extends Component {

    static defaultProps = {
        hideTitleBar: false
    };

    static propTypes = {
        isHideTitleBar: PropTypes.bool
    };

    static contextTypes = {
        addBackButtonListener: PropTypes.func,
        removeBackButtonListener: PropTypes.func
    };

    constructor(props, context) {
        super(props, context);

        this.onNavigationStateChange = this._onNavigationStateChange.bind(this);
        this.onBackButton = this._onBackButton.bind(this);
        this.canGoBack = false;

        this.state = {
            loadEnd: false
        }
    }

    componentDidMount() {
        this.context.addBackButtonListener(this.onBackButton);
    }

    componentWillUnmount() {
        this.context.removeBackButtonListener(this.onBackButton);
    }

    render() {
        let titleBar;
        if (!this.props.hideTitleBar) {
            titleBar = (
                <CustomTitleBarComp
                    title={this.props.title}
                    onLeftBtnClick={() => this.props.navigator.pop()}
                    />
            );
        }
        let horizontalProgress;
        if (!this.state.loadEnd) {
            horizontalProgress = (
                <HorizontalProgressComp
                    color={'#FF5000'}
                    progress={60}
                    style={{position: 'absolute', left: 0, right: 0, top: TITLE_BAR_HEIGHT+18}}
                />
            )
        }
        return (
            <View style={{flex: 1}}>
                {titleBar}
                <WebView
                    ref="webView"
                    source={{uri: this.props.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onLoadEnd={() => this.setState({loadEnd: true})}
                    renderError={() => 
                        <CommonLoadView loadState="error" onRetry={() => this.refs.webView.reload()}/>}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
                {horizontalProgress}
            </View>
        )
    }

    _onNavigationStateChange(navState) {
        this.canGoBack = navState.canGoBack;
    }

    _onBackButton() {
        if (this.canGoBack) {
            this.refs.webView.goBack();
            return true;
        }
        return false;
    }
}

export default WebViewPage;