import React, { Component } from 'react';
import './App.css';
import CollectionPanel from './components/collectionPanel';
import { getCollectionAndAssetAsync } from './utils/data';
import AssetsPanel from './components/assetsPanel';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      collection:[],
      selectedCollection:{}
    }
  }

  componentDidMount(){
    var collection = [];
    getCollectionAndAssetAsync().then(res=>{
        this.setState({collection:res})
    })
  }

  onCollectionSelect=(collection)=>{
    this.setState({
      selectedCollection:collection
    });
  }

  onMakeMasterClick=(collectionId,assetId,path)=>{
    const {collection} = this.state;
    collection.map(data=>{
      if(data.id===collectionId){
        data.masterAssetId=assetId
        data.masterAssetPath=path
      }
    })
    this.setState({collection});
  }
  
  updateCollection = (data,tagArr,i) =>{
    if(data){
      data.name = tagArr[i];
      if(!tagArr[i+1]){
        delete data.subTag;
      }
      if(data.subTag){
        return this.updateCollection(data.subTag,tagArr,++i);
      }
    }
  }

  saveChangedTag = (tagArr,colId) =>{
    var {collection} = this.state;
    collection.map(data=>{
      if(data.id===colId){
        if(tagArr.length===0){
          delete data.tags
        }else{
          this.updateCollection(data.tags,tagArr,0);
        }
      }
    })
    this.setState({collection});
  }

  render() {
    const {collection,selectedCollection} = this.state;
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row pt-3">
            <CollectionPanel collection={collection} onCollectionSelect={this.onCollectionSelect} 
              saveChangedTag={this.saveChangedTag}/>
            { selectedCollection && selectedCollection.assets && selectedCollection.assets.length>0 &&
              <AssetsPanel collection={selectedCollection} onMakeMasterClick={this.onMakeMasterClick}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
