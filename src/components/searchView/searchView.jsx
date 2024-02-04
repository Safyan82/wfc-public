import './searchView.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Popover, Table, Tag } from "antd";
import { faChevronLeft, faCodeBranch, faExternalLink, faInfoCircle, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery } from '@apollo/client';
import { SearchMutation } from '../../util/mutation/search.mutation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { resetSearchState } from '../../middleware/redux/reducers/search.reducer';
import Spinner from '../spinner';
import noData from '../../assets/img/noData.svg';
import { useNavigate } from 'react-router-dom';
import { selectedSearchMutation } from '../../util/mutation/selectedSearch.mutation';
import { selectedSearchQuery } from '../../util/query/selectedSearch.query';

export const SearchView = React.memo(()=>{
    const [filters, setFilters] = useState(['Branch', 'Employee', 'Schedule', 'Site', 'Customer'])
    const [getSearchResult, {loading, error}] = useMutation(SearchMutation);
    const {query, isModalOpen, searchFilter} = useSelector(state => state.searchReducer);
    const [data, setData] = useState([]);
    const [localdata, setLocalData] = useState([]);
    const navigate = useNavigate();

    const [newSelectedSearchMutation] = useMutation(selectedSearchMutation);
    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);

    const {data:recentSearchResult, loading: recentSearchLoading} = useQuery(selectedSearchQuery,{
        variables:{
            userId: authenticatedUserDetail?._id
        },
        fetchPolicy: 'network-only',
        skip: !authenticatedUserDetail?._id
    });

    console.log(recentSearchResult?.getSelectedSearchByUser, "");

    const handelDetailNavigation = (category, record)=>{
        const {_id:id} = record;
        if(category=="employee"){
            newSelectedSearchMutation({
                variables:{
                    input:{
                        category,
                        searchedBy: authenticatedUserDetail?._id,
                        selectedSearchObject: record,
                        query,
                    }
                }
            })
            navigate("/user/employee-detail/"+id);
        }else if(category=="branch"){
            newSelectedSearchMutation({
                variables:{
                    input:{
                        category,
                        searchedBy: authenticatedUserDetail?._id,
                        selectedSearchObject: record,
                        query,
                    }
                }
            })
            navigate("/user/branch-detail/"+id)
        }
        dispatch(resetSearchState())
    }

    const handelSearchResults = async (query)=>{
        const response = await getSearchResult({
            variables:{
                input:{
                    searchQuery: query,
                    filters: searchFilter,
                }
            }
        });
        const reteriveddata = response?.data?.QueryResult.response;
        if(reteriveddata?.length>0){
            setLocalData(reteriveddata?.map((result)=>{
                if(Object.keys(result)=="employee"){
                    result["employee"]["columns"]=result?.employee?.columns?.map((col)=>{
                    if(col?.dataIndex=="firstname"){
                        return {
                            ...col,
                            render:(_, record)=>{
                                return (
                                    <span className='prev-btn' onClick={()=>handelDetailNavigation("employee",record)}>{record?.firstname}</span>
                                )
                            }
                        }
                    }else{
                        return col;
                    }
                    });
                }
                else if(Object.keys(result)=="branch"){
                    
                    result["branch"]["columns"]=result?.branch?.columns?.map((col)=>{
                        if(col?.dataIndex=="branchname"){
                        return {
                            ...col,
                            render:(_, record)=>{
                                return (
                                    <span className='prev-btn' onClick={()=>handelDetailNavigation("branch", record)}>{record?.branchname}</span>
                                )
                            }
                        }
                        }else{
                        return col;
                        }
                    });
                }
                return result;
            }));
        }else{
            setLocalData([]);
        }
        // console.log(Object.keys(response?.data?.QueryResult.response[0])[0], "response1")
        
    };

    useEffect(()=>{
        if(localdata?.length>0){
            setData([...localdata]);
        }else{
            setData([]);
        }
    },[localdata]);

    useEffect(()=>{
        if(query?.length>1){
            handelSearchResults(query);
        }
    },[query, searchFilter]);

    const dispatch = useDispatch();

    const [selectedFilter, setSelectedFilter] = useState(null);
    
    useEffect(()=>{
        if(selectedFilter){
            setData(localdata?.filter((data)=>Object.keys(data)[0]==selectedFilter.toLowerCase()))
        }
    },[selectedFilter]);

    useEffect(()=>{
        console.log(searchFilter, "searchFilter")
        setFilters([...searchFilter]);
    },[searchFilter]);


    return(
        <div className='searchViewModalParent'>
            <div
                
                className='searchViewModal'
                style={{ top: 0, paddingBottom: 10 }}
            >

                <div className="search-header">
                    {query?.length<2?
                        <span className='search-header-text'>Type something to start searching</span>
                    :
                    <>
                        <span className='search-header-text'>
                            {
                                selectedFilter &&
                                <div className="prev-btn" onClick={()=>{setData([...localdata]);setSelectedFilter(null)}}> <FontAwesomeIcon icon={faChevronLeft} /> Back to all search result </div> 
                            }
                            Showing results for <b>"{query}"</b>  &nbsp;
                            <Popover
                                content={<div>
                                    <b>Something missing?</b>
                                    <div className="text" style={{color: 'white'}}>
                                    If you feel that a result <br/> is missing, get in touch with an <br/> administrator  as you might not <br/> have the proper permissions.
                                    </div>
                                </div>}
                            >
                                <FontAwesomeIcon icon={faInfoCircle}/> 
                            </Popover>
                           
                            {/* based on your <b className='prev-btn'>Search Setting <FontAwesomeIcon icon={faExternalLink}/> </b>  */}
                        </span>
                    </>
                    }

                    <div
                        className='filterSection'
                    >
                        {query?.length>1?<div className='searchFilter'>
                            Filter by: &emsp;
                            {selectedFilter?
                            <Tag closable closeIcon={<FontAwesomeIcon icon={faTimes} style={{color:'white'}}/>} style={{background:'rgb(66, 91, 118)', color:'white'}} onClose={()=>{setData([...localdata]);setSelectedFilter(null)}}>{selectedFilter} &nbsp;</Tag>
                            :filters?.map((filter=>(
                                <Tag onClick={()=>setSelectedFilter(filter)}>{filter}</Tag>
                            )))}
                        </div>:null}

                        <FontAwesomeIcon 
                            onClick={()=>dispatch(resetSearchState())}
                            style={{fontSize:'16px',cursor:'pointer'}}
                            icon={faTimes}
                        />
                    </div>

                </div>

                <div className="search-body">
                    {
                        loading?
                            <div style={{width:'100%',textAlign:'center'}}>
                                <Spinner/>
                            </div>
                        :
                        // if the query is valid and search result is available
                        data?.length>0 && query?.length>1 ? data?.map((result)=>(
                            <>
                                <h3>
                                    {Object.keys(result)[0].toUpperCase()==='EMPLOYEE' ? <FontAwesomeIcon icon={faUsers}/> : <FontAwesomeIcon icon={faCodeBranch}/> }
                                   &nbsp; {Object.keys(result)[0].toUpperCase()}
                                </h3>
                                <Table
                                    columns={result[Object.keys(result)[0]]["columns"]}
                                    dataSource={result[Object.keys(result)[0]]["data"]}
                                />
                                <br/><br/>
                            </>
                        ))
                        :
                        // if query valid and no data found
                        query?.length>1 && data?.length==0 ?
                            <div style={{textAlign:'center'}}>
                                <h3>No results found.</h3>
                                <img src={noData} width={300}/>
                            </div> 
                        :
                        recentSearchLoading?
                            <div style={{margin:'auto', display:'table'}}>
                                <Spinner  />
                            </div>
                        :
                        recentSearchResult?.getSelectedSearchByUser?.length>0? 
                        <>
                            <h3 style={{borderBottom:'1px solid rgb(203, 214, 226)', paddingBottom:'12px'}}>Recently Selected Result</h3>

                            {recentSearchResult?.getSelectedSearchByUser?.map((result)=>(
                                result?.category=="branch"?
                                <div style={{padding:'10px 0 20px 0', borderBottom:'1px solid rgb(203, 214, 226)', margin:'16px 0'}}>
                                    <Tag style={{background:'rgb(234, 240, 246)', fontWeight:'bold', padding:'0 20px'}}>{result?.category.toUpperCase()}</Tag> &emsp; <span className='prev-btn' onClick={()=>handelDetailNavigation("branch",result?.selectedSearchObject)}>{result?.selectedSearchObject?.branchname}</span>
                                </div>:
                                result?.category=="employee"?
                                <div style={{padding:'10px 0 20px 0', borderBottom:'1px solid rgb(203, 214, 226)', margin:'16px 0'}}>
                                    <Tag style={{background:'rgb(234, 240, 246)', fontWeight:'bold', padding:'0 20px'}}>{result?.category.toUpperCase()}</Tag> &emsp; <span className='prev-btn' onClick={()=>handelDetailNavigation("employee",result?.selectedSearchObject)}>{result?.selectedSearchObject?.firstname +" "+ result?.selectedSearchObject?.lastname}</span>
                                </div>: null
                            ))}

                        </>
                        :
                        // render it when no query no data
                        <>
                            <h3 style={{borderBottom:'1px solid rgb(203, 214, 226)', paddingBottom:'12px'}}>Recently Selected Result</h3>

                            <div style={{textAlign:'center'}}>
                                <img src={noData} width={300}/>
                                <div className="text">There's no recent selected result</div>
                            </div>
                        </>
                    }


                </div>


            </div>
        </div>
    );
})