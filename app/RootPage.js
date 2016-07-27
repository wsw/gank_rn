/**
 * 1.初始化导航器（Navigator）
 * 2.处理Android返回事件
 */
import React, {Component} from 'react';
import {
    Navigator, StatusBar, StyleSheet,
    View, BackAndroid, Platform
} from 'react-native';
import MainPage from './pages/MainPage';
import {showToast} from './comp/CommonComp';

class RootPage extends Component {
    
    constructor(props) {
        super(props);

        this.backButtonListeners = [];
        this.onBack = this._onBack.bind(this);
        this.addBackButtonListener = this._addBackButtonListener.bind(this);
        this.removeBackButtonListener = this._removeBackButtonListener.bind(this);
        this.handlerConfigureScene = this._handlerConfigureScene.bind(this);
    }
    
    static childContextTypes = {
        addBackButtonListener: React.PropTypes.func,
        removeBackButtonListener: React.PropTypes.func,
    };

    getChildContext() {
        return {
            addBackButtonListener: this.addBackButtonListener,
            removeBackButtonListener: this.removeBackButtonListener
        }
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
    }

    render() {
        return (<View style={styles.container}>
            <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.2)'} />
            <Navigator
                ref={component => this.navigator = component}
                initalRoute={{}}
                configureScene={this.handlerConfigureScene}
                renderScene={this._renderScene.bind(this)} />
        </View>)
    }

    _handlerConfigureScene() {
        return Navigator.SceneConfigs.FloatFromBottomAndroid;
    }

    _addBackButtonListener(listener) {
        this.backButtonListeners.push(listener);
    }

    _removeBackButtonListener(listener) {
        this.backButtonListeners = this.backButtonListeners.filter(
            (handler) => handler !== listener
        );
    }

    _onBack() {
        for (let i = this.backButtonListeners.length-1; i>=0; i--) {
            if (this.backButtonListeners[i]()) return true;
        }

        let navigator = this.navigator;

        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }

        let curTimestamp = new Date().getTime();

        if (this.extTimestamp !== undefined && curTimestamp - this.extTimestamp < 3000) {
            return false;
        } else {
            showToast('再按一次退出App');
            this.extTimestamp = curTimestamp;
            return true;
        }
    }

    _renderScene(route, navigator) {
        console.log(route);
        if (route && route.component) {
            var {component: Component, ...route} = route;
            return <Component navigator={navigator} {...route} />
        }
        return <MainPage navigator={navigator} {...route} />
        // return <View style={styles.container}></View>
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'red'
  },
});

export default RootPage;