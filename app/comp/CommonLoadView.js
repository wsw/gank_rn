import React, { Component, PropTypes } from 'react';
import {
    StyleSheet, View, Text,
    ActivityIndicator as ProgressBar
} from 'react-native';

import { COMMON_BACKGROUND_COLOR, APP_MAIN_COLOR } from '../GlobalConst';
import Spinner from 'react-native-spinkit';
import OvalButtonComp from './OvalButtonComp';

const LOAD_STATE_ING = 'ing';
const LOAD_STATE_ERROR = 'error';

class CommonLoadView extends Component {
    constructor(props) {
        super(props);
        
        this.state = { spinnerType: null };
    }
    
    componentDidMount() {
        this.setState({ spinnerType: 'ChasingDots'});
    }
    
    render() {
        let contentView;
        if (this.props.laodState === LOAD_STATE_ERROR) {
            contentView = this._renderErrorView();
        } else {
            contentView = this._renderLoadingView();
        }
        
        return (
            <View style={styles.container}>
                {contentView}
            </View>
        );
    }
    
    _renderLoadingView() {
        return (
            <View style={styles.commonChildContainer}>
                <Spinner 
                    size={45}
                    type={this.state.spinnerType}
                    color={APP_MAIN_COLOR}
                />
                <Text style={this.tipsText}>正在加载中...</Text>
            </View>
        );
    }
    
    _renderErrorView() {
        return (
            <View style={styles.commonChildContainer}>
                <Text style={styles.errorTipsText}>
                    加载失败了哦！
                </Text>
                <OvalButtonComp onPress={this.props.onRetry}>重试</OvalButtonComp>
            </View>
        )
    }
}

CommonLoadView.propTypes = {
    laodState: PropTypes.oneOf({
        LOAD_STATE_ERROR, LOAD_STATE_ING
    })
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_BACKGROUND_COLOR,
  },
  commonChildContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsText: {
    color: '#999999',
    fontSize: 15,
    marginTop: 10,
  },
  errorTipsText: {
    color: '#999999',
    fontSize: 15,
    marginBottom: 20,
  },
});

export default CommonLoadView;