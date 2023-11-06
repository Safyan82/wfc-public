import './allproperties.css';
import React, { useEffect, useState } from "react";
import { Row, Col, Input, Collapse, Checkbox } from 'antd';
import { faCheck, faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DraggableList from '../../components/shuffle/draggeableList';
import { GetBranchObject } from '../../util/query/branch.query';
import { useMutation, useQuery } from '@apollo/client';
import Spinner from '../../components/spinner';
import { useSelector } from 'react-redux';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { useLocation, useNavigate } from 'react-router-dom';
import { PropertyDetailDrawer } from './propertyDetail.drawer';
import { AddBranchDetailViewMutation } from '../../util/mutation/branchDetailView.mutation';
import { useDispatch } from 'react-redux';
import { AddDataFieldFromView, removeDataFieldFromSpecificBranchView } from '../../middleware/redux/reducers/branchData.reducer';
import { BranchViewForSpecificUser } from '../../util/query/branchView.query';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';

export const AllProperties  = () => {
    const singleBranchData = useSelector(state => state.branchDataReducer.specificBranchData);
    
    const {data: branchObjectdata , loading: branchObjectLoading} = useQuery(GetBranchObject);
    const [groupedProp, setGroupedProp] = useState([]);

    const [propToRemove, setPropToRemove] = useState(null);
    
    useEffect(()=>{

        if(!branchObjectLoading){
            const groupedData = branchObjectdata?.getBranchProperty?.response?.reduce((result, item) => {
                const key = item.propertyDetail.groupName;
                if (!result[key]) {
                    result[key] = [];
                }
                result[key].push(item);
                return result;
            }, {});
            setGroupedProp(groupedData);
        }
    },[branchObjectLoading]);

    const [addBranchViewDetail, {loading, error}] = useMutation(AddBranchDetailViewMutation);
    const {data: branchViewForUser, loading: branchViewForUserLoading, refetch: branchViewForUserRefetch} = useQuery(BranchViewForSpecificUser,{
        variables:{
            createdBy: "M Safyan",
            createdFor: singleBranchData?.id,
        },
        fetchPolicy: 'network-only'
    });


    const updateUserBranchView = async(properties) =>{
        // alert(singleBranchData?.id);
        await addBranchViewDetail({
            variables:{
                input:{
                    properties,
                    createdFor: singleBranchData?.id,
                    createdBy: "M Safyan",
                    _id: branchViewForUser?.getUserBranchView?.response?._id,
                }
            }
        });
        await branchViewForUserRefetch();
        dispatch(setNotification({
            notificationState:true, 
            message:"Data Fields Updated",
            error: false,
        }));

        
    }
  

    const [allPropList, setAllPropList] = useState([]);
    const [propertyDetailDrawer, setPropertyDetailDrawer] = useState(false);
    const [propToAdd, setPropToAdd] = useState(null);
    useEffect(()=>{
        if(propToAdd){

        console.log(propToAdd, "propToA");
        updateUserBranchView([ ...branchViewForUser?.getUserBranchView?.response?.properties, { ...propToAdd.propertyDetail,
            _id: propToAdd.propertyId,}])
            setPropToAdd(null);
        }
    }, [propToAdd]);

   const [blankHide, setBlankHide] = useState(false);


   useEffect(()=>{
    if(groupedProp && Object.keys(groupedProp)?.length>0 ){
        const existingIds = branchViewForUser?.getUserBranchView?.response?.properties?.map((prop)=> prop._id) || branchObjectdata?.getBranchProperty?.response?.map((prop)=>prop.propertyId)
        const allPropList = Object.keys(groupedProp)?.map((item, index)=>{
            let count = 0;
            groupedProp[item]?.map((prop)=>(
                blankHide?
                singleBranchData?.branch[prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] 
                || 
                singleBranchData?.branch['metadata'][prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] ?
                count++
                :null : null
            ));

            return (
                {
                    key: index,
                    label: <span>
                            {item[0].toLocaleUpperCase()+item.slice(1)} 
                            <small style={{fontSize:'12px'}}> {blankHide? count  : groupedProp[item]?.length} data fields
                            </small>
                        </span>,
                    
                    children: groupedProp[item]?.map((prop)=>(
                        blankHide?
                        singleBranchData?.branch[prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] 
                        || 
                        singleBranchData?.branch['metadata'][prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] ?
                        
                        <div className='field-presentation'>
                            
                            <FontAwesomeIcon 
                                style={!existingIds.includes(prop?.propertyId) ? { visibility: 'hidden'} : {visibility:'visible'}}
                             icon={faCheck}/>
                            
                            <div style={{width: '100%'}}>
                                
                                <div className='allpropList-propHead'>
                                    {prop?.propertyDetail?.label} 
                                </div>
                                <div className='field-prop-value'>
                                    <span>
                                        {singleBranchData?.branch[prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] 
                                        || 
                                        singleBranchData?.branch['metadata'][prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()]
                                        || "--"
                                        }
                                    </span>
                                    <span className='field-prop-btn-grp'>
                                        <button className='grid-sm-btn' style={{ padding: "4px 10px" }} onClick={()=>{setPropertyDetailDrawer(true); setSelectedProp({propertyId:prop?.propertyId, propertyName: prop?.propertyDetail?.label});}}> Details </button> &nbsp;
                                        {!existingIds?.includes(prop?.propertyId) ?
                                            <button className='grid-sm-btn'
                                            onClick={()=>setPropToAdd(prop)}
                                            
                                            style={{ padding: "4px 10px" }}>Add to your view</button>
                                        
                                        :
                                            <button className='grid-sm-btn' 
                                                onClick={()=>handelAddBranches(prop?.propertyId)}
                                                style={{ padding: "4px 10px" }}
                                            >  Remove from your view</button>
                                        }
                                    </span>
                                </div>
                                
                            </div>
                        </div>

                        : null
                        :
                        <div className='field-presentation'>
                            
                            <FontAwesomeIcon 
                                style={!existingIds.includes(prop?.propertyId) ? { visibility: 'hidden'} : {visibility:'visible'}}
                             icon={faCheck}/>
                            
                            <div style={{width: '100%'}}>
                                
                                <div className='allpropList-propHead'>
                                    {prop?.propertyDetail?.label} 
                                </div>
                                <div className='field-prop-value'>
                                    <span>
                                        {singleBranchData?.branch[prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] 
                                        || 
                                        singleBranchData?.branch['metadata'][prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()]
                                        || "--"
                                        }
                                    </span>
                                    <span className='field-prop-btn-grp'>
                                        <button className='grid-sm-btn' style={{ padding: "4px 10px" }} onClick={()=>{setPropertyDetailDrawer(true);setSelectedProp({propertyId:prop?.propertyId, propertyName: prop?.propertyDetail?.label});}}> Details </button> &nbsp;
                                        {!existingIds?.includes(prop?.propertyId) ?
                                            <button className='grid-sm-btn'
                                            onClick={()=>setPropToAdd(prop)}
                                            
                                            style={{ padding: "4px 10px" }}>Add to your view</button>
                                        
                                        :
                                            <button className='grid-sm-btn' 
                                                onClick={()=>handelAddBranches(prop?.propertyId)}
                                                style={{ padding: "4px 10px" }}
                                            >  Remove from your view</button>
                                        }
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                    ))
                }
            )
        });
        console.log(allPropList, "all prop list");
        setAllPropList([...allPropList]);
    }
   }, [groupedProp, branchViewForUser, blankHide]);


    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handelAddBranches = async (id)=>{
        setPropToRemove(id);
    }

    const [selectedProp, setSelectedProp] = useState(null);
    useEffect(()=>{
        console.log(selectedProp, "setSelectedProp");
    }, [selectedProp]);

    useEffect(()=>{
        if(propToRemove !== null){

            if(branchViewForUser?.getUserBranchView?.response?.properties){
                updateUserBranchView(branchViewForUser?.getUserBranchView?.response?.properties?.filter((prop)=>prop._id != propToRemove));
                setPropToRemove(null)
            }else{

                const newBranchViewFields = branchObjectdata?.getBranchProperty?.response?.map((prop)=>({
                    ...prop.propertyDetail,
                    _id: prop.propertyId,
                })).filter((prop)=>propToRemove != (prop._id));
                updateUserBranchView(newBranchViewFields);
                setPropToRemove(null)
                
            }
        }
    }, [propToRemove]);

    
    return(
        <div className='bg'>
            <header>
                <div className="back-btn" style={{marginBottom:'6px'}}>
                    <FontAwesomeIcon  className="back-icon" icon={faChevronLeft} /> Back
                </div>
                <div className='head-h1'>
                    Manage data fields for Branch
                </div>
            </header>

            <div style={{display:'flex', columnGap:'20px'}}>
                
                <div className="abtProp">
                
                    <div className="abtProp-Head">
                        About
                    </div>
                    <div className="text">
                        These data fields will appear when you view information about a branch. These changes will only affect you.
                    </div>
                    <button className='simple-btn grid-sm-btn-disabled' style={{margin: 'auto', display:'table', marginBottom:'16px'}} > Reset to account defaults </button>

                    {
                        branchObjectLoading || branchViewForUserLoading? 
                        <div style={{display:'flex', justifyContent:'center', paddingTop:'3%'}}><Spinner/></div>
                        :
                        <div style={{paddingLeft: '5%', paddingBottom: '5%'}} className='allprop'>
                            <DraggableList editColumn={true} 
                                handelAddBranches={handelAddBranches} 
                                updateUserBranchView = {updateUserBranchView} 
                                list={
                                    branchViewForUser?.getUserBranchView?.response?.properties
                                    || 
                                    branchObjectdata?.getBranchProperty?.response?.map((prop)=>({
                                    ...prop.propertyDetail,
                                    _id: prop.propertyId,
                                    }))
                                } />        
                        </div>
                    }


                </div>

                <div className="allpropList">
                    <div className="allpropList-head">
                        <span>
                            All data fields
                        </span>

                        <button className='filter-btn' onClick={()=>navigate("/user/setting")}> Manage data fields </button>
                    </div>

                    <div className="allpropList-searchbar">
                        <Input type='search' style={{ width:'69%', height:'40px'}} className='generic-input-control' placeholder='Search data fields'  suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}/>
                        <Checkbox value={blankHide} onChange={(e)=>setBlankHide(e.target.checked)}><span style={{fontSize:'16px'}}>Hide blank data fields</span></Checkbox>
                    </div>

                    <Collapse items={allPropList}/>
                    <PropertyDetailDrawer 
                        clearState={setSelectedProp}
                        visible={propertyDetailDrawer} 
                        selectedProp={selectedProp} 
                        close={()=>setPropertyDetailDrawer(false)} 
                        branchId={singleBranchData?.id}
                    />
                </div>

            </div>
        </div>
    );
}

const RenderChild = ()=>{

}