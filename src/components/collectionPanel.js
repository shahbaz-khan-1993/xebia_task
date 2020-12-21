import React,{useState} from 'react';
import Modal from "react-bootstrap/Modal";

const CollectionPanel = ({collection,onCollectionSelect,saveChangedTag}) =>{
    const [tagSelected, setTagSelected] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selCollId, setSelCollId] = useState(0);

    function *processData(data){
        if (!data) { return; }
        yield data.name;
        if(data.subTag){
            yield *processData(data.subTag); 
        }
    }

    const getCollectionTags=(data)=>{
        var tags = "";
        var it = processData(data.tags);
        var res = it.next();

        while(!res.done){
            tags = tags.concat(res.value);
            res = it.next();
            if(!res.done){
                tags = tags.concat(" > ");
            }
        }
        return tags;
    }

    const onModalTrigger = (tag,id) =>{
        setTagSelected(tag);
        setSelCollId(id);
        setIsModalOpen(!isModalOpen);
    }

    const onTagChange=(value,i)=>{
        var tagArr = tagSelected.split('>')
        tagArr[i] = value;
        setTagSelected(tagArr.join('>'));
    }

    const onSaveTag = () =>{
        var tagArr = tagSelected.split('>');
        tagArr = tagArr.filter(el=>{return el!==""});

        saveChangedTag(tagArr,selCollId);
        onModalTrigger('',0);
    }

    return (
        <nav className="col-lg-2 col-md-3 col-sm-4 d-none d-md-block sidebar">
            <div className="sidebar-sticky">
                {
                    collection.map(data=>{
                        var tagList = getCollectionTags(data);
                        return(
                            <React.Fragment key={data.id}>
                                <div className="thumbnail text-center">
                                    <img src={require(`../images/${data.masterAssetPath}`)} alt={data.name} className="img-responsive"/>
                                    <div className="caption">
                                        <span type="button" className="mb-2" onClick={()=>onCollectionSelect(data)}>
                                            <strong>{data.name}</strong><br/>
                                            <strong>Number of assets - {data.assets.length}</strong><br/>
                                        </span><br/>
                                        <span>{tagList}</span><br/>
                                        <button className="btn btn-info btn-sm mt-2" onClick={()=>onModalTrigger(tagList,data.id)}>Edit Tag</button>
                                    </div>
                                </div><br/>
                            </React.Fragment>
                        )
                    })
                }
                <Modal
                    show={isModalOpen} backdrop="static" keyboard={false} centered
                    onHide={()=>{onModalTrigger('')}} >
                    <Modal.Header closeButton>
                        <Modal.Title>Update Tags Name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            tagSelected.split('>').map((tag,i)=>{
                                return(
                                    <React.Fragment key={i}>
                                        <input className="form-control" type="text" value={tag.trim()}
                                            onChange={(e)=>onTagChange(e.target.value,i)}/>
                                        {(i!==tagSelected.split('>').length-1)?<br/>:''}
                                    </React.Fragment>
                                )
                            })
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={()=>{onModalTrigger('')}}>Cancel</button>
                        <button className="btn btn-primary" onClick={onSaveTag}>Save</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </nav>
    );
}

export default CollectionPanel;