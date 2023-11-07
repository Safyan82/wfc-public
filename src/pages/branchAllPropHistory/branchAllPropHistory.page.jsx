import './branchAllPropHistory.css';
import { Input, Table } from 'antd';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@apollo/client';
import { GetBranchAllPropertiesHistory } from '../../util/query/branchPropHistory';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const columns=[
    {
        title: "Property",
        dataIndex: "property", 
        key: "property",
        sorter: (a, b) => a.property - b.property, // Custom sorting function
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: "CHanged to",
        dataIndex: "value", 
        key: "value"
    },
    {
        title: "made on",
        dataIndex: "createdAt", 
        key: "createdAt",
        sorter: (a, b) => a.createdAt - b.createdAt, // Custom sorting function
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: "Source",
        dataIndex: "", 
        key: "",
    },
]

export const BranchAllPropHistory = ()=>{

    const branchData = useSelector(state => state.branchDataReducer?.specificBranchData);
    

    const navigate = useNavigate();
    const {data, loading, error} = useQuery(GetBranchAllPropertiesHistory,{
        variables:{
            branchId: branchData?.id,
        },
        skip: !branchData?.id
    });

    const [dataSource, setDataSource] = useState([]);

    useEffect(()=>{
        if(!loading){
            setDataSource(data?.getBranchAllPropHistory?.response?.map((prop)=>({
                property: prop?.propertyDetail?.label,
                ...prop
            })));
        }
    },[data, loading]);

    const [search, setSearch] = useState("");
    useEffect(()=>{
        if(search?.length>0 && !loading && data){
            setDataSource(data?.getBranchAllPropHistory?.response?.map((prop)=>({
                property: prop?.propertyDetail?.label,
                ...prop
            }))?.filter((props)=> props?.property.toLowerCase().includes(search.toLowerCase())));
        }else if(!loading && data){
            
            setDataSource(data?.getBranchAllPropHistory?.response?.map((prop)=>({
                property: prop?.propertyDetail?.label,
                ...prop
            })));
        }
    }, [search]);

    // console.log(single)

    return(
        <div className="bg" style={{padding:'25px 48px'}}>
             <header style={{border: "none"}}>
                <div className="back-btn" onClick={()=>navigate(-1)}>
                    <FontAwesomeIcon  className="back-icon" icon={faChevronLeft} /> Back
                </div>
            </header>
            <div className='propHist-head-container'>
                <div className='propHist-head-container-txt'>Property history for {branchData?.branch?.branchname}</div>
                <Input 
                    type='search' 
                    style={{ width: '30%', height:'40px'}} 
                    className='generic-input-control' 
                    placeholder='Search property history'
                    onChange={(e)=>setSearch(e.target.value)}  
                    suffix={<FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch} />}
                />
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
            />
        </div>
    );
}