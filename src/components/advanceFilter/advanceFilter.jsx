import React,{ useEffect, useState } from 'react';
import { Form, Input, Drawer, Button, notification, Spin, Select, TreeSelect, DatePicker, TimePicker, Radio, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCalendar, faChevronLeft, faClose, faExternalLink, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import './advanceFilter.css';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { CaretDownFilled } from '@ant-design/icons';
import { GetBranchObject } from '../../util/query/branch.query';
import { PlainFilter } from './plainFilter';
import { DateFilter } from './dateFilter';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';

export const AdvanceFilter = ({visible, onClose, loading}) =>{
    const {data, loading:propertyLoading, refetch} = useQuery(GetPropertyByGroupQuery,{
        fetchPolicy:'network-only'
    });

    const [propList, setPropList] = useState([]);
    const [quickFilter, setQuickFilter] = useState(true);
    const [isFilterEnable, setFilterEnable] = useState(false);
    const [filtervalues, setFilterValues] = useState([]);
    const [filterValueSearch, setFilterValueSearch] = useState("");
    const [conditionOperator, setConditionOperator] = useState(null)
   
    const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject,{
        fetchPolicy: 'network-only',
    });

    const quickFilterReducer = useSelector(state=>state.quickFilterReducer);

    const [localQuickFilter, setLocalQuickFilter] = useState(quickFilterReducer?.quickFilter);

    useEffect(()=>{
        setLocalQuickFilter(quickFilterReducer?.quickFilter);
    },[quickFilterReducer?.quickFilter]);

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


    const handelOption = () =>{
        const isExist = filtervalues.find((val)=>val==filterValueSearch);
        if(isExist){
            setFilterValueSearch("");
        }else{
            setFilterValues([...filtervalues, filterValueSearch]);
            setFilterValueSearch("");
        }
    };

    const handelChange = (e) => {
        if(e.length<filtervalues?.length){
            console.log(e, e.length, filtervalues?.length);
            setFilterValues([...e]);
            setFilterValueSearch("");
        }
    };

    const [filters, setFilters] = useState([]);
    const [filterDetail, setFilterDetail] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("");

    const renderFilterOption=(prop)=>{
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


    useEffect(()=>{
        const isEmptyExist = filters?.find((filter)=>filter?.length<1)
        if(filters?.length>0 && isEmptyExist){
            setFilters(filters?.filter((filter)=>filter?.length>0))
        }
    }, [filters]);

    const upsertFilter = (prop)=>{
        if(filters?.length===0){
            setFilters([[prop]])
        }else{
            if(conditionOperator?.operator=='and'){
                
                filters?.map((filter, index)=>{
                    if(index==conditionOperator?.tag){
                        filter.push(prop)
                    }
                });
                setFilters([...filters]);
                
            }else if(conditionOperator?.operator=='or'){
                filters.push([prop]);
            }
        }


    }


    const cloneFilter = (index)=>{
        setFilters([...filters, [...filters[index]]]);
    }

    const deleteFilterBlock = (index) => {
        setFilters(filters?.filter((filter,i)=>(i!==index)))
    }


    const deleteSingleFilter = (mainIndex, index)=>{
        setFilters(filters?.map((mainFilter, i)=>(
            mainIndex==i? mainFilter?.filter((filter,i)=> i!==index):mainFilter
        )));
    };

    return(
        
        <Drawer
            title="All filters"
            placement="right"
            className="advanceFilter"
            closable={true}
            onClose={()=>{onClose();clearFilter();}}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{onClose();clearFilter();}} className='close-icon'/>}
            open={visible}
            width={410}
            mask={true}
            maskClosable={false}
            maskClassName='filtermask'
      >


        

        {!isFilterEnable?

        // static welcoming filter section
        <div className="filterMainBody">
        {/* quick filter section */}
            {
                Object.values(quickFilterReducer?.quickFilter)?.length > 0 ?
            <>
                <div className="quickFilter">

                    <div className="filter-header">
                        <div className="h5" style={{letterSpacing: '0.4px'}}>Quick filter ({Object.values(quickFilterReducer.quickFilter)?.filter(filter=>filter!=null)?.length})</div>
                        <div style={{cursor:'pointer'}} onClick={()=>setQuickFilter(!quickFilter)}>{ quickFilter? "Show" : "Hide" }</div>

                    </div>
                    {!quickFilter &&
                    <div className='quickFilterInner'>
                        <div className="text">These filters were set within the current table.</div>
                        {Object.values(quickFilterReducer.quickFilter)?.length>0 ? 
                            <>
                                {
                                quickFilterReducer?.quickFilter?.createdDate?
                                    <div className="filterBox">
                                        <span>
                                            <strong> Created date</strong>&nbsp; is &nbsp;<strong>{quickFilterReducer?.quickFilter?.createdDate}</strong>
                                        </span>
                                    </div>
                                    : null
                                }
                                
                                {Object.values(quickFilterReducer.quickFilter)?.filter(filter=>filter!=null)?.length == 2 ?
                                <>
                                
                                    <div className='verticalBorder'></div>
                                    
                                    <span className='text' style={{color:'#99ACC2'}}>and</span>
                                    
                                    <div className='verticalBorder'></div>
                                
                                </>

                                :
                                    null
                                }

                                {
                                quickFilterReducer?.quickFilter?.updatedDate?
                                    <div className="filterBox">
                                        <span>
                                            <strong> Last activity date</strong>&nbsp; is &nbsp;<strong>{quickFilterReducer?.quickFilter?.updatedDate}</strong>
                                        </span>
                                    </div>
                                    : null
                                }
                            </>
                            : null
                        }
                    </div>
                    }

                </div>
                <div className='dividerline'></div>
            </>
            : null
            }


        {/* advance filter section */}

            <div className="advanceFilter-inner">
                
                <div className="filter-header">
                    <div className="h5" style={{letterSpacing: '0.4px'}}>Advance filters ({filters?.length})</div>
                </div>

                <div style={{marginTop:'16px'}}>
                    {filters?.length>0 ?
                    filters?.map((filter, mainindex)=>(
                    <>
                        
                        <div style={{display:'flex',direction:'rtl', columnGap:'10px'}}>
                            <span className='back-btn' onClick={()=>deleteFilterBlock(mainindex)}>Delete</span>
                            <span className='back-btn' onClick={()=>cloneFilter(mainindex)}>Clone</span>
                        </div>

                        <div className="filterMainBox">
                        
                        {filter?.length>0 ? filter?.map((filterDetail, index) => (
                            <>
                                <div className="filterbox-inner">
                                    <div>
                                        <span className='grid-text-btn'>{filterDetail?.operator} </span> 
                                        <span className='text'> {filterDetail?.filter.split('_')[0]} {filterDetail?.filter.split('_')[1]} </span>
                                        <strong style={{color:'black'}}>{filterDetail?.filterValue} {filterDetail?.filterValue1.includes("/") ? "To" : null} {filterDetail?.filterValue1}</strong>
                                    </div>
                                    <span className='trash-icon-wrapper'>
                                        <Popover content={"delete this condition"} placement='left'>
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={()=>deleteSingleFilter(mainindex, index)}/>
                                        </Popover>
                                    </span>
                                </div>
                                {index<filter?.length-1?
                                <>
                                <div className='verticalBorder'></div>
                                
                                <span className='text' style={{color:'#99ACC2'}}>and</span>
                                
                                <div className='verticalBorder'></div>
                                </> : null}
                            </>
                            
                        )): null}

                            {filter?.length>0?
                            <button className='conditionalBtn' onClick={()=>{
                                setFilterEnable(true);
                                setConditionOperator({operator:'and',tag:mainindex});
                            }} style={{marginTop:'2%', marginBottom:'2%'}}>AND</button>
                            : null}    
                        </div>
                        {mainindex < filters?.length-1 ?
                        <div className="text" style={{marginBottom:'-4%', marginTop:'4%', fontWeight:'600'}}>OR</div>
                        : <button className='conditionalBtn'  onClick={()=>{
                            setFilterEnable(true);
                            setConditionOperator({operator:'or'});
                        }} style={{marginTop:'2%', marginBottom:'2%'}}>OR</button>
                        }
                    </>
                    ))
                    

                    :
                        <center>
                            <div className="text" style={{textAlign:'center'}}>This view has no advance filters.</div>
                            <button className='filter-btn' onClick={()=>setFilterEnable(true)}>
                                <FontAwesomeIcon icon={faAdd} color='white'/> Add filter
                            </button>
                        </center>
                    }   
                </div>

            </div>
        </div>
        :
        // do render the concerned property list when the filter is not clicked
        isFilterEnable && filterDetail == null ?
        <div className="propList">
            {filters?.length > 0 &&
                <div className='back-btn' style={{marginBottom:'6%'}} onClick={()=>setFilterEnable(false)}> <FontAwesomeIcon style={{fontSize: '8px'}} icon={faChevronLeft}/> <span>Back</span> </div>
            }

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
              setFilterValueSearch={setFilterValueSearch}
              filtervalues={filtervalues}
              filterValueSearch={filterValueSearch}
              setFilterValues={setFilterValues}
              handelChange={handelChange}
              selectedFilter={selectedFilter}
              singleFilter={singleFilter}
              setFilterEnable={setFilterEnable}
              upsertFilter={upsertFilter}
            /> 

        : filterDetail=="date" ? 
            <DateFilter
                clearFilter={clearFilter}
                handelFilter={handelFilter}
                handelOption={handelOption}
                setFilterValueSearch={setFilterValueSearch}
                filtervalues={filtervalues}
                filterValueSearch={filterValueSearch}
                setFilterValues={setFilterValues}
                handelChange={handelChange}
                selectedFilter={selectedFilter}
                singleFilter={singleFilter}
                setFilterEnable={setFilterEnable}
                upsertFilter={upsertFilter}
            /> : null
        
        

    }

      </Drawer>
    );
}

