import React, { Component } from 'react';
import CustomTitleBarComp from '../comp/CustomTitleBarComp';
import {
    View, Text, StyleSheet
} from 'react-native';

class AboutPage extends Component {
    render() {
        return (
             <View style={styles.container}>
                <CustomTitleBarComp
                    title="关于"
                    onLeftBtnClick={() => {this.props.navigator.pop()}}
                    />
                <Text>about page</Text>
             </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'red'}
});

export default AboutPage;