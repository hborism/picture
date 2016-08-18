/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  CameraRoll,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  ListView,
  Dimensions
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob'

const images = []

class picture extends Component {

  constructor(props) {
    super(props)
    this.state = {
      images: []
    }
  }

  componentWillMount() {
    CameraRoll.getPhotos({first:5}).done(
      (data) => {
        this.setState({
          images: data,
        });
        console.log("IMAGES STATE", this.state.images)
        console.log("data", data);
      },
      (error) => {
        console.warn(error)
      }
    )
  }

  _onPressButton(uri){
    console.log("WRAP", RNFetchBlob.wrap(uri))
    RNFetchBlob.fetch('POST', 'http://46.101.178.251/uploadpic' ,{
      'Access-token': "abc123",
      'Content-Type' : 'multipart/form-data'
    },[
      {name: 'avatar', filename: 'avatar2.jpg', type: 'image/jpeg', data: RNFetchBlob.wrap(uri)}
    ]).uploadProgress((written, total) => {
        console.log('uploaded', written / total)
    }).then((resp) => {
      alert("sent uri", uri, "resp", resp)
    }).catch((err) => {
      console.log(err)
      alert("error")
    })
  }

  _renderList(){
    var {height, width} = Dimensions.get('window')
    console.log(height, width, "dimensions")
    let data = []
    var length = this.state.images.edges.length
    console.log("renderlist", this.state.images.edges)
    console.log(length, "length")
    for(let i = 0; i < length; i++){
      data[i]=<TouchableOpacity key = {i} onPress={() => this._onPressButton(this.state.images.edges[i].node.image.uri)}>
      <Image source={{uri: this.state.images.edges[i].node.image.uri}}
      style = {{width:width/3, height:width/3}}/>
      </TouchableOpacity>
    }
    console.log("return data", data)
    return data
  }


  render() {

    if(this.state.images.length==0) {
      return (
        <View>
        <Text>Loading...</Text>
        </View>
      )
    }

    return (

      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>

        <ScrollView>
            {this._renderList()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  list: {
        flexDirection: 'row',
        flexWrap: 'wrap'
  },
  item: {
        backgroundColor: 'red',
        margin: 3,
        width: 100
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

AppRegistry.registerComponent('picture', () => picture);
