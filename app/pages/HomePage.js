import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';

import AboutPage from './AboutPage';
import CustomTitleBarComp from '../comp/CustomTitleBarComp';
import ViewPagerComp from '../comp/ViewPagerComp';
import GankListComp from './comppages/GankListComp';
import { switchTitleBarTab } from '../actions/titleBarTab';
import { COMMON_BACKGROUND_COLOR } from '../GlobalConst';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.onViewPageScroll = this._onViewPageScroll.bind(this);
    }

    render() {
        console.log(GankListComp)
        return (
            <View style={styles.container}>
                <CustomTitleBarComp 
                    ref="titleBar"
                    title="干货"
                    onLeftBtnClick={this.props.onDrawerMenuToggle}
                    isMainPage={true}
                    rightText="关于"
                    onRightBtnClick={() => this.props.navigator.push({componet: AboutPage})}>
                    <CustomTitleBarComp.HeaderTabItem 
                        tabText={'android'}
                        selected={this.props.selectedTabIndex == 0}
                        onTabClick={this._switchTitleBar.bind(this, 0)}
                    />
                    <CustomTitleBarComp.HeaderTabItem 
                        tabText={'ios'}
                        selected={this.props.selectedTabIndex == 1}
                        onTabClick={this._switchTitleBar.bind(this, 1)}
                    />
                    <CustomTitleBarComp.HeaderTabItem 
                        tabText={'前端'}
                        selected={this.props.selectedTabIndex == 2}
                        onTabClick={this._switchTitleBar.bind(this, 2)}
                    />
                </CustomTitleBarComp>
                <ViewPagerComp
                    selectedIndex={this.props.selectedTabIndex}
                    onViewPageScroll={this.onViewPageScroll}
                    onSelectedIndexChange={(curSelIndex) => this._switchTitleBar(curSelIndex)}>
                    <GankListComp 
                        tagName="tag_1"
                        category="Android"
                        navigator={this.props.navigator}
                    />
                    <GankListComp 
                        tagName="tag_2"
                        category="iOS"
                        navigator={this.props.navigator}
                    />
                    <GankListComp 
                        tagName="tag_3"
                        category="前端"
                        navigator={this.props.navigator}
                    />
                </ViewPagerComp>
            </View>
        )
        
        
        
    }

    _switchTitleBar(selIndex) {
        console.log('tab', new Date());
        if (this.props.selectedTabIndex !== selIndex) {
            this.props.dispatch(switchTitleBarTab(selIndex));
        }
    }

    _onViewPageScroll(offset) {
        console.log('scroll', new Date())
        this.refs.titleBar.onPageScroll(offset);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'column',
        backgroundColor: COMMON_BACKGROUND_COLOR
    }
});

export default connect((store) => {
    return {
        selectedTabIndex: store.homePageStore.selectedTabIndex
    }
})(HomePage);