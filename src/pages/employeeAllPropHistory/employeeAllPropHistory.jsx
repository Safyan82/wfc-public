import './employeeAllPropHistory.css';
import { Input, Table } from 'antd';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { getAllEmployeePropHistoryQuery, getSingleEmployeeRecord } from '../../util/query/employee.query';

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
        dataIndex: "createdby", 
        key: "createdby",
    },
]

export const EmployeeAllPropHistory = ()=>{

    const param = useParams();

    const navigate = useNavigate();
    const {data, loading, error} = useQuery(getAllEmployeePropHistoryQuery,{
        variables:{
            employeeId: param?.id,
        },
        skip: !param?.id
    });

     // get single employee Record
     const {data: singleEmployeeRecord, loading: singleEmployeeLoading, refetch: singleEmployeeRefetch} = useQuery(getSingleEmployeeRecord,{
        variables:{
            id: param?.id
        },
        fetchPolicy: 'network-only'
    });

    const [dataSource, setDataSource] = useState([]);

    useEffect(()=>{
        if(!loading){
            setDataSource(data?.getEmployeeAllPropHistory?.response?.map((prop)=>({
                property: prop?.propertyDetail?.label,
                createdby: prop?.sourceDetail?.length>0? prop?.sourceDetail[0]?.firstname  +" "+ prop?.sourceDetail[0]?.lastname : <div style={{textAlign:'center'}}>--</div>,
                ...prop
            })));
        }
    },[data, loading]);

    const [search, setSearch] = useState("");
    useEffect(()=>{
        if(search?.length>0 && !loading && data){
            setDataSource(data?.getBranchAllPropHistory?.response?.map((prop)=>({
                property: prop?.propertyDetail?.label,
                createdby: prop?.sourceDetail?.length>0? prop?.sourceDetail[0]?.firstname  +" "+ prop?.sourceDetail[0]?.lastname : <div style={{textAlign:'center'}}>--</div>,
                ...prop
            }))?.filter((props)=> props?.property.toLowerCase().includes(search.toLowerCase())));
        }else if(!loading && data){
            
            setDataSource(data?.getBranchAllPropHistory?.response?.map((prop)=>({
                property: prop?.propertyDetail?.label,
                createdby: prop?.sourceDetail?.length>0? prop?.sourceDetail[0]?.firstname  +" "+ prop?.sourceDetail[0]?.lastname : <div style={{textAlign:'center'}}>--</div>,

                ...prop
            })));
        }
    }, [search]);

    // console.log(single)

    return(
        <div className="bg" style={{padding:'25px 48px', height: '95vh'}}>
             <header style={{border: "none"}}>
                <div className="back-btn" onClick={()=>navigate(-1)}>
                    <FontAwesomeIcon  className="back-icon" icon={faChevronLeft} /> Back
                </div>
            </header>
            <div className='propHist-head-container'>
                <div className='propHist-head-container-txt'>Property history for {singleEmployeeRecord?.singleEmployee?.response?.lastname}</div>
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