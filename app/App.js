import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from './store';
import RootPage from './RootPage';
import SplashPage from './SplashPage';
import {View, Text} from 'react-native';

const store = configureStore();

class App extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isShowSplash: true
        };
    }
    
    render() {
        if (this.state.isShowSplash) {
           return <SplashPage onAnimEnd={() => this.setState({isShowSplash: false})}></SplashPage>;
            // return <SplashPage style={{backgroundColor: '#555555', flex: 1}}></SplashPage>;
        } else {
            return (
                <Provider store={store}>
                    <RootPage />
                </Provider>
            );
        }
    }
}

export default App;