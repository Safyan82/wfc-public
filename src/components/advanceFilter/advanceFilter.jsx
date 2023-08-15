import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Spin, Select, TreeSelect, DatePicker, TimePicker, Radio } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCalendar, faChevronLeft, faClose, faExternalLink, faSearch } from '@fortawesome/free-solid-svg-icons';
import './advanceFilter.css';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { CaretDownFilled } from '@ant-design/icons';
import { GetBranchObject } from '../../util/query/branch.query';
import { PlainFilter } from './plainFilter';
import { DateFilter } from './dateFilter';

export const AdvanceFilter = ({visible, onClose, loading}) =>{
    const [quickFilter, setQuickFilter] = useState(false);
    const {data, loading:propertyLoading, refetch} = useQuery(GetPropertyByGroupQuery,{
        fetchPolicy:'network-only'
    });

    const [propList, setPropList] = useState([]);
   
    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject,{
        fetchPolicy: 'network-only',
    });

    const [isFilterEnable, setFilterEnable] = useState(false);
    useEffect(()=>{
        setFilterEnable(false);
    },[visible]);
    
    useEffect(()=>{
        if(data?.getPropertyByGroup?.data){
            setPropList(data?.getPropertyByGroup?.data?.map((props)=>{
                const properties = props?.properties?.filter((prop)=>branchProperties?.getBranchProperty.response?.find((branchProp)=>branchProp.propertyId==prop._id))
                return {
                    ...props,
                    properties
                }
            }));
            // setPropList([...data?.getPropertyByGroup?.data]);
            // console.log(branchProperties?.getBranchProperty.response, data?.getPropertyByGroup?.data)
        }
    },[data, branchProperties, isFilterEnable]);


    

    const [values, setValues] = useState([]);
    const [valueSearch, setValueSearch] = useState("");
    const handelOption = () =>{
        const isExist = values.find((val)=>val==valueSearch);
        if(isExist){
            setValueSearch("");
        }else{
            setValues([...values, valueSearch]);
            setValueSearch("");
        }
    };

    const handelChange = (e) => {
        if(e.length<values?.length){
            console.log(e, e.length, values?.length);
            setValues([...e]);
            setValueSearch("");
        }
    };

    const [filters, setFilters] = useState([]);
    const [filterDetail, setFilterDetail] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("");

    const renderFilterOption=(prop)=>{
        setFilters([...filters, prop]);
        if(prop.fieldType.includes('date')){
            setFilterDetail('date');
        }else{

            setFilterDetail('plain');
        }
        setSelectedFilter(prop.label)
    };

    const [singleFilter, setSingleFilter] = useState(null);

    const handelFilter = (e)=>{
        setSingleFilter(e.target.value);
    };

    const clearFilter=()=>{
        setFilterDetail(null);
        setSingleFilter(null);

    }

    return(
        
        <Drawer
            title="All filters"
            placement="right"
            className="advanceFilter"
            closable={true}
            onClose={onClose}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={onClose} className='close-icon'/>}
            open={visible}
            width={410}
            mask={true}
            maskClosable={false}
            maskClassName='filtermask'
      >

        {!isFilterEnable?
        <div className="filterMainBody">
            <div className="quickFilter">

                <div className="filter-header">
                    <div className="h5" style={{letterSpacing: '0.4px'}}>Quick filter (1)</div>
                    <div style={{cursor:'pointer'}} onClick={()=>setQuickFilter(!quickFilter)}>{ quickFilter? "Show" : "Hide" }</div>

                </div>
                {!quickFilter &&
                <div className='quickFilterInner'>
                    <div className="text">These filters were set within the current table.</div>

                    <div className="filterBox">
                        <span>
                            <strong> Created date</strong>&nbsp; is &nbsp;<strong>Today</strong>
                        </span>
                    </div>
                </div>
                }

            </div>

            <div className='dividerline'></div>

            <div className="advanceFilter-inner">
                
                <div className="filter-header">
                    <div className="h5" style={{letterSpacing: '0.4px'}}>Advance filters (0)</div>
                </div>

                <center>
                    <div className="text" style={{textAlign:'center', marginTop:'16px'}}>This view has no advance filters.</div>
                    <button className='filter-btn' onClick={()=>setFilterEnable(true)}>
                        <FontAwesomeIcon icon={faAdd} color='white'/> Add filter
                    </button>
                </center>

            </div>
        </div>
        :
        // do render the prop list when the filter is not clicked
        filterDetail == null ?
        <div className="propList">
            <div className="h5" style={{marginTop:'-4%', marginBottom:'2.6%',letterSpacing: '0.4px'}}>Branch Properties</div>
            <Input 
                type="text"
                style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }}
                placeholder='Search'
                className='generic-input-control'
                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
            />
            <div className="proplistView">
                {propList?.map((list)=>(
                    <>
                        <div className="proplistHead">{list._id}</div>
                        {list?.properties?.map((prop)=>(

                            <div className="list-item popoverdataitem" 
                            onClick={()=>renderFilterOption(prop)}
                            >{prop.label}</div>
                        ))}
                    </>
                ))}
            </div>
        </div>
        
        //  else select the filter detail according the prop type
        :
        filterDetail=="plain" ?
            <PlainFilter
              clearFilter={clearFilter}
              handelFilter={handelFilter}
              handelOption={handelOption}
              setValueSearch={setValueSearch}
              values={values}
              valueSearch={valueSearch}
              setValues={setValues}
              handelChange={handelChange}
              selectedFilter={selectedFilter}
              singleFilter={singleFilter}
              setFilterEnable={setFilterEnable}
            />            
        : filterDetail=="date" ? 
        <DateFilter
            clearFilter={clearFilter}
            handelFilter={handelFilter}
            handelOption={handelOption}
            setValueSearch={setValueSearch}
            values={values}
            valueSearch={valueSearch}
            setValues={setValues}
            handelChange={handelChange}
            selectedFilter={selectedFilter}
            singleFilter={singleFilter}
            setFilterEnable={setFilterEnable}
        /> : null
        
        }

      </Drawer>
    );
}

