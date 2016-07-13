import React, { Component, PropTypes } from 'react';

import {
    StyleSheet, View, Text,
    TouchableHighlight
} from 'react-native';

class OvalButtonComp extends Component {
    render() {
        return (
            <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={this.props.onPress}>
                <View style={[styles.container, this.props.bgStyle]}>
                   <Text style={[styles.text, this.props.bgStyle]}>{this.props.children}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

OvalButtonComp.propTypes = {
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    onPress: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 30,
        paddingRight: 30,
        borderColor: '#cccccc',
        borderStyle: 'solid',
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#cccccc',
        fontSize: 15
    }
});

export default OvalButtonComp;