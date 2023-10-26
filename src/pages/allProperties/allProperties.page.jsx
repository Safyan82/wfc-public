import './allproperties.css';
import React, { useEffect, useState } from "react";
import { Row, Col, Input, Collapse } from 'antd';
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DraggableList from '../../components/shuffle/draggeableList';
import { GetBranchObject } from '../../util/query/branch.query';
import { useQuery } from '@apollo/client';
import Spinner from '../../components/spinner';
import { useSelector } from 'react-redux';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { useLocation, useNavigate } from 'react-router-dom';

export const AllProperties  = () => {
    const singleBranchData = useSelector(state => state.branchDataReducer.specificBranchData);
    console.log(singleBranchData, "singleBranchData")
    const {data: branchObjectdata , loading: branchObjectLoading} = useQuery(GetBranchObject);
    const [groupedProp, setGroupedProp] = useState([]);

    useEffect(()=>{
        if(!branchObjectLoading){
            // branchObjectdata?.getBranchProperty?.response?.map(({propertyDetail})=>{
                
            //     // console.log(branch, "bc bc")
            //     console.log(singleBranchData?.branch[propertyDetail?.label.replaceAll(" ","").toLowerCase()] || singleBranchData?.branch['metadata'][propertyDetail?.label.replaceAll(" ","").toLowerCase()])
            // });
            const groupedData = branchObjectdata?.getBranchProperty?.response.reduce((result, item) => {
                const key = item.propertyDetail.groupId+'-'+item.propertyDetail.groupName;
                if (!result[key]) {
                    result[key] = [];
                }
                result[key].push(item);
                return result;
            }, {});
            setGroupedProp(groupedData);
            console.log(groupedData, "ddd");
        }
    },[branchObjectLoading]);
  

    const [allPropList, setAllPropList] = useState([]);

   useEffect(()=>{
    if(groupedProp && Object.keys(groupedProp)?.length>0){
        const allPropList = Object.keys(groupedProp)?.map((item, index)=>{
            
            return (
                {
                    key: index,
                    label: item.split("-")[1],
                    children: groupedProp[item]?.map((prop)=>(
                        <div>
                            <div className='allpropList-propHead'>
                                {prop?.propertyDetail?.label} 
                            </div>
                            <div>
                                {singleBranchData?.branch[prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()] 
                                || 
                                singleBranchData?.branch['metadata'][prop?.propertyDetail?.label.replaceAll(" ","").toLowerCase()]
                                }
                            </div>
                        </div>
                    ))
                }
            )
        });
        console.log(allPropList, "allPropList");
        setAllPropList([...allPropList]);
    }
   }, [groupedProp]);

    

    const navigate = useNavigate();

    return(
        <div className='bg'>
            <header>
                <div className="back-btn" style={{marginBottom:'6px'}}>
                    <FontAwesomeIcon  className="back-icon" icon={faChevronLeft} /> Back
                </div>
                <div className='head-h1'>
                    Manage propertiess for Branch
                </div>
            </header>

            <div style={{display:'flex', columnGap:'20px'}}>
                
                <div className="abtProp">
                
                    <div className="abtProp-Head">
                        About
                    </div>
                    <div className="text">
                        These properties will appear when you view information about a branch. These changes will only affect you.
                    </div>
                    <button className='simple-btn' style={{margin: 'auto', display:'table', marginBottom:'16px'}}> Reset to account defaults </button>

                    {
                        branchObjectLoading? 
                        <Spinner/>
                        :
                        <div style={{paddingLeft: '5%', paddingBottom: '5%'}} className='allprop'>
                            <DraggableList editColumn={true} list={branchObjectdata?.getBranchProperty?.response?.map((br, index)=> { 
                                const {propertyDetail} = br;
                                return({
                                    ...propertyDetail,
                                    _id: br.propertyId,
                                })
                            })} />        
                        </div>
                    }


                </div>

                <div className="allpropList">
                    <div className="allpropList-head">
                        <span>
                            All properties
                        </span>

                        <button className='filter-btn' onClick={()=>navigate("/user/setting")}> Manage properties </button>
                    </div>

                    <div className="allpropList-searchbar">
                        <Input type='search' style={{background: 'white', width:'70%', height:'40px'}} className='generic-input-control' placeholder='Search properties'  suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}/>
                    </div>

                    <Collapse items={allPropList}/>
                </div>

            </div>
        </div>
    );
}

const RenderChild = ()=>{

}