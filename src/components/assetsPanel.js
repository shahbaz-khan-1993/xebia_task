import React, {useState, useEffect} from 'react';

const AssetsPanel = ({collection,onMakeMasterClick}) =>{
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        setSortBy('name')
    },[collection]);

    var attr = sortBy.toLowerCase();
    collection.assets.sort((a,b)=>{
        if(typeof a[attr] === "string"){
            var x = a[attr].toLowerCase();
            var y = b[attr].toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        }else{
            return(a[attr]-b[attr])
        }
    })

    return(
        <>
            <div className="row col-lg-8 col-md-7 col-sm-5 asserts">
                {
                    collection.assets.map(asset=>{
                        return(
                            <div key={asset.id} className="col-lg-3 col-md-4 col-sm-6 card pl-0 pr-0">
                                <img src={require(`../images/${asset.path}`)} alt={asset.name} className="card-img-top rounded mx-auto d-block"/>
                                <div className="card-body bg-light">
                                    <h5 className="card-title">{asset.name}
                                    {collection.masterAssetId===asset.id &&
                                        <span className="badge badge-pill badge-danger ml-1">M</span>
                                    }
                                    </h5>
                                    <div>
                                        <span className="card-text">ID - {asset.id}</span>
                                        { collection.masterAssetId!==asset.id && 
                                        <button type="button" className="btn btn-primary ml-1" data-toggle="button" aria-pressed="false"
                                            onClick={()=>onMakeMasterClick(collection.id,asset.id,asset.path)}>
                                            Make master
                                        </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2">
                <select value={sortBy} className="form-control" onChange={e=>setSortBy(e.target.value)}>
                    <option>Name</option>
                    <option>Id</option>
                </select>
            </div>
        </>
    )
}

export default AssetsPanel;