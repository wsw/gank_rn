import React, { Component } from 'react';
import {
    StyleSheet, View,
    ScrollView, ViewPagerAndroid,
    Platform, Dimensions
} from 'react-native';

class ViewPagerComp extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            width: 0,
            height: 0,
            selectedIndex: this.props.selectedIndex,
            initialSelectedIndex: this.props.selectedIndex,
            scrollingTo: null
        }
        
        this.handerHorizontalScroll = this._handerHorizontalScroll.bind(this);
        this.adjustCardSize = this._adjustCardSize.bind(this);
        
        this.screenWidth = Dimensions.get('window').width;
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedIndex !== this.state.selectedIndex) {
            this.refs.scrollview.setPage(nextProps.selectedIndex);
            this.setState({
                selectedIndex: nextProps.selectedIndex
            })
        }
    }
    
    render() {
        return (
            <ViewPagerAndroid
                ref="scrollview"
                initialPage={this.state.initialSelectedIndex}
                onPageSelected={this.handerHorizontalScroll}
                onPageScroll={(event) => this.props.onViewPageScroll && this.props.onViewPageScroll(event.nativeEvent.position + event.nativeEvent.offset)}
                style={styles.container} >
                {this._renderContent()}
            </ViewPagerAndroid>
        )
    }
    
    _adjustCardSize(event) {
        this.setState({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height
        });
    }
    
    _renderContent() {
        let { width, height } = this.state;
        return React.Children.map(this.props.children, (child, i) => (
            <View style={[styles.card, {width, height}]} key={'r_' + i}>
                {child}
            </View>
        ));
        // 
    }
    
    _handerHorizontalScroll(event) {
        let selectedIndex = event.nativeEvent.position;
        if (selectedIndex === undefined) {
            selectedIndex = Math.round(
                event.nativeEvent.contentOffset.x / this.state.width
            );
        }
        if (selectedIndex < 0 || selectedIndex >= this.props.count) {
            return ;
        }
        if (this.props.selectedIndex !== selectedIndex || this.state.scrollingTo != null) {
            this.setState({selectedIndex, scrollingTo: null});
            const { onSelectedIndexChange } = this.props;
            onSelectedIndexChange && onSelectedIndexChange(selectedIndex);
        }
    }
}

const styles = StyleSheet.create({
    container: { flex: 1},
    scrollview: { flex: 1, backgroundColor: 'transparent' },
    card: { backgroundColor: 'transparent'}
});

export default ViewPagerComp;