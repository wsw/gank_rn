import React, { Component } from 'react';
import {
    StyleSheet, ListView,
    RefreshControl, Text,
    View, 
    ActivityIndicator as ProgressBar
} from 'react-native';

import { connect } from 'react-redux';
import WebViewPage from '../WebViewPage';
import CommonTouchableComp from '../../comp/CommonTouchableComp';
import CommonLoadView from '../../comp/CommonLoadView';
import { FETCH_GANK_DATA_STATUS } from '../../actions/types';
import { fetchGankList } from '../../actions/gankApi';
import { COMMON_BACKGROUND_COLOR } from '../../GlobalConst';
import { showToast } from '../../comp/CommonComp';

class GankListComp extends Component {
    constructor(props) {
        super(props);
        
        this.category = this.props.category;
        this.tagName = this.props.tagName;
        this.curPageNo = 1;
        this.isLoadMoreing = false;
        this.onRetry = this._onRetry.bind(this);
    }
    
    componentDidMount() {
        this._fetchData(0);
    }
    
    shouldComponentUpdate(nextProps, nexState) {
        if (this.tagName !== nextProps.ext) {
            return false;
        }
        if (nextProps.status === FETCH_GANK_DATA_STATUS.START) {
            return false;
        } else if (nextProps.status === FETCH_GANK_DATA_STATUS.FAILURE) {
            if (nextProps.opt === 1) {
                showToast('刷新数据失败了');
                return false;
            } else if (nextProps.opt === 2) {
                showToast('加载更多数据失败了');
                this.isLoadMoreing = false;
                return false;
            }
        }
        return true;
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.opt === 2) {
            this.isLoadMoreing = false;
        }
    }
    
    render() {
        let contentView;
        if (this.props.status == FETCH_GANK_DATA_STATUS.INITIALIZE) {
            contentView = <CommonLoadView loadState="ing" />
        } else if (this.props.status == FETCH_GANK_DATA_STATUS.FAILURE) {
            contentView = <CommonLoadView loadState="error" onRetry={this.onRetry}/>;
        } else {
            contentView = (
                <ListView
                    dataSource={this.props.dataSource}
                    renderRow={this._renderItem.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    onEndReachedThreshold={5}
                    onEndReached={this.props.isLoadMore?this._onLoadMore.bind(this) : null}
                    renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
                    renderFooter={this.props.isLoadMore ? this._footerView : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#AAAAAA"
                            title="下拉刷新"
                            progressBackgroundColor="#FFFFFF" />
                        }
                    />
            );
        }
        return (
            <View style={styles.container}>
                {contentView}
            </View>
        );
    }
    
    _fetchData(opt) {
        this.curPageNo = opt !== 2 ? 1 : (this.curPageNo + 1);
        this.props.dispatch(fetchGankList(opt, this.category, this.curPageNo, this.tagName));
    }
    
    _onRetry() {
        this.props.dispatch({type: FETCH_GANK_DATA_STATUS.INITIALIZE, ext: this.tagName});
        // 延迟2秒再调用数据
        setTimeout(() => {
            this._fetchData(0);
        }, 2000)
    }
    
    _onRefresh() {
        this._fetchData(1);
    }
    
    _onLoadMore() {
        if (this.isLoadMoreing) {
            return ;
        }
        this.isLoadMoreing = true;
        setTimeout(() => {
            this._fetchData(2);
        }, 1000);
    }
    
    _footerView() {
        return (
            <View style={styles.footerContainer}>
                <ProgressBar styleAttr="Small" />
                <Text>
                    正在加载中...
                </Text>
            </View>
        )
    }
    
    _onItemViewPress(gankData) {
        console.log(gankData);
        this.props.navigator.push({
            component: WebViewPage,
            title: gankData.desc,
            url: gankData.url
        });
    }
    
    _renderItem(gankData) {
        return (
            <CommonTouchableComp onPress={this._onItemViewPress.bind(this, gankData)}>
                <View style={styles.itemViewContainer}>
                    <Text style={styles.title} numberOfLines={2}>{gankData.desc}</Text>
                    <View style={styles.line2ItemViewContainer}>
                        <Text style={styles.author}>{typeof gankData.who !== 'undefined' && gankData.who !== null ? 'via：' + gankData.who : ''}</Text>
                        <Text style={styles.time}>{this._formatTime(gankData.publishedAt)}</Text>
                    </View>
                </View>
            </CommonTouchableComp>
        )
    }
    _formatTime(time) {
        let date = new Date(time);
        return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_BACKGROUND_COLOR,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemViewContainer: {
    padding: 10,
  },
  line2ItemViewContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  author: {
    flex: 1,
    fontSize: 14,
    color: '#999999',
  },
  time: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
});

function select(store) {
  return {
    status: store.gankListCompStore.status,
    dataSource: store.gankListCompStore.dataSource,
    isRefreshing: store.gankListCompStore.isRefreshing,
    isLoadMore: store.gankListCompStore.isLoadMore,
    opt: store.gankListCompStore.opt,
    ext: store.gankListCompStore.ext,
  }
}

export default connect(select)(GankListComp);