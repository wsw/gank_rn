import React, {Component} from 'react';
import {
    View, StyleSheet, Navigator, Text,
    DrawerLayoutAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { HOME_TABS } from '../actions/types';
import { switchTab } from '../actions/navigator';
import HomePage from './HomePage'
// import GankRecommendPage from './GankRecommendPage'
// import GirlPage from './GirlPage'
// import AboutPage from './AboutPage'
// import CollectListPage from './CollectListPage'

class MainPage extends Component {
    static contextTypes = {
        addBackButtonListener: React.PropTypes.func,
        removeBackButtonListener: React.PropTypes.func
    };
    
    constructor(props, context) {
        super(props, context);
        
        this.renderDrawerMenuView = this._renderDrawerMenuView.bind(this);
        this.onDrawerOpen = this._onDrawerOpen.bind(this);
        this.onDrawerClose = this._onDrawerClose.bind(this);
        this.onBackButton = this._onBackButton.bind(this);
        this.onDrawerMenuToggle = this._onDrawerMenuToggle.bind(this);
        
        this.state = {
            curSelTag: HOME_TABS.HOME
        };
        
        this.ROUTE_STACKS = [
            { component: HomePage},
            { component: HomePage},
            { component: HomePage},
            { component: HomePage},
        ]
    }
    
    render() {
        return (
            <DrawerLayoutAndroid
                ref="drawer"
                drawerWidth={290}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={this.renderDrawerMenuView}
                onDrawerOpen={this.onDrawerOpen}
                onDrawerClose={this.onDrawerClose} >
                <Navigator
                    ref={component => this.navigator=component}
                    navigator={this.props.navigator}
                    configureScene={() => {
                        return {
                            ...Navigator.SceneConfigs.FadeAndroid,
                            defaultTransitionVelocity: 1000,
                            gestures: {}
                        }
                    }}
                    initialRoute={this.ROUTE_STACKS[0]}
                    initialRouteStack={this.ROUTE_STACKS}
                    renderScene={this._renderScene.bind(this)}
                    />
            </DrawerLayoutAndroid>
        )
    }
    
    _renderScene(route, navigator) {
        var { component:Component, ...route} = route;
        return (
            <Component 
                navigator={this.props.navigator}
                {...route} 
                onDrawerMenuToggle={this.onDrawerMenuToggle} 
                curSelTag={this.state.curSelTag} 
                />
        );
    }
    
    _onDrawerOpen() {
        this.context.addBackButtonListener(this.onBackButton);
    }
    
    _onDrawerClose() {
        this.context.removeBackButtonListener(this.onBackButton);
    }
    
    _onTabSelect(tab) {
        this.refs.drawer.closeDrawer();
        
        if (this.props.tab !== tab) {
            this.props.dispatch(switchTab(tab));
            this.setState({curSelTag: tab});
            
            switch (tab) {
                case HOME_TABS.HOME: 
                    this.navigator.jumpTo(this.ROUTE_STACKS[0]);
                    break;
                case HOME_TABS.GANK_DAY:
                    this.navigator.jumpTo(this.ROUTE_STACKS[1]);
                    break;
                case HOME_TABS.GIRL: 
                    this.navigator.jumpTo(this.ROUTE_STACKS[2]);
                    break;
                case HOME_TABS.COLLECT: 
                    this.navigator.jumpTo(this.ROUTE_STACKS[3]);
                    break;
            }
        }
    }
    _onDrawerMenuToggle() {
        this.refs.drawer.openDrawer();
    }

    _onBackButton() {
        this.refs.drawer.closeDrawer();
        return true;
    }

    _renderDrawerMenuView() {
        // return <DrawerMenuComp tab={this.props.tab} onTabSelect={(tab) => this._onTabSelect.bind(this, tab)} />;
        return <View><Text>{this.props.tab}</Text></View>
    }
}


const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

function select(store) {
  return {
    tab: store.navigatorStore.tab,
  }
}

export default connect(select)(MainPage);