import './leftsidebar.css';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHandHoldingHand, faTimes, faPencil, faSearch, faLocationDot, faEnvelope, faUserPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Popover, Collapse, Skeleton, Tag, DatePicker, Input } from 'antd';
import {faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { PhoneOutlined,  FormOutlined, MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import { GET_BRANCHES,} from '../../../util/query/branch.query';
import { useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../components/spinner';
import { PropertyDetailDrawer } from '../../allProperties/propertyDetail.drawer';
import { getUserEmployeeDetailView } from '../../../util/query/employeeDetailView.query';
import { getEmployeePropHistoryQuery } from '../../../util/query/employee.query';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export const DetailPageLeftSideBar = ({employeeObject, singleEmployee, loading, handelInputChange})=>{
    
    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);

    const [phoneNumber, setPhoneNumber] = useState();

    const phoneInputRef = useRef(null);

    const [isAction, setAction] = useState(false);
    const containerRef = useRef(null);

    const {data: employeeDetailViewData, loading: employeeDetailViewLoading, refetch: employeeDetailViewRefetch} = useQuery(getUserEmployeeDetailView,{
        variables:{
            createdBy: authenticatedUserDetail?._id,
            createdFor: singleEmployee?._id,
        },
        fetchPolicy: 'network-only'
    });

    const [viewProperties, setViewProperties] = useState([]);
    useEffect(()=>{
        if(employeeDetailViewData?.getUserEmployeeDetailView?.response){
            
            const view = employeeDetailViewData?.getUserEmployeeDetailView?.response?.properties?.filter((prop)=>(
                employeeObject?.find(prp => prp._id== prop)));
                
                setViewProperties(view?.map((prop)=>{
                const property = employeeObject?.find(prp => prp._id == prop)
                return {
                    _id: property?._id,
                    ...property
                }
            }));
            
            console.log(employeeDetailViewData?.getUserEmployeeDetailView?.response, "employeeObject", employeeObject, view);


        }
    },[employeeDetailViewData?.getUserEmployeeDetailView?.response, employeeObject]);

    
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setAction(false);
        }
      };
  
      document.addEventListener('click', handleOutsideClick);
  
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);

    const navigate = useNavigate();

    const [propertyDetailDrawer, setPropertyDetailDrawer] = useState(false);

    const [selectedProp, setSelectedProp] = useState();
    
    const {data: employeeProp, loading: employeePropLoading, error} = useQuery(getEmployeePropHistoryQuery,{
        variables:{
            input: {
                propertyId: selectedProp?.propertyId,
                employeeId: singleEmployee?._id
            }
        },
        skip: !selectedProp?.propertyId || !singleEmployee?._id,
        fetchPolicy: 'network-only'
    });

    const { data: branchData, } = useQuery(GET_BRANCHES ,{
        fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: null
            }
        }
    });

    const [readonlyProp, setReadOnlyProp] = useState([]);
    useEffect(()=>{
        let readOnly = [];
        for (const key in authenticatedUserDetail?.permission?.Employee) {
            if (authenticatedUserDetail?.permission?.Employee.hasOwnProperty(key) && authenticatedUserDetail?.permission?.Employee[key].hasOwnProperty('edit')) {
                if(authenticatedUserDetail?.permission?.Employee[key]?.edit==0){

                    readOnly.push(key);
                    
                }
                
            }
        };
        setReadOnlyProp([...readOnly]);
        console.log(readOnly, "readOnly", authenticatedUserDetail?.permission?.Employee);
        // console.log(Object.values(authenticatedUserDetail?.permission?.Employee), "authenticatedUserDetail");
    }, [authenticatedUserDetail]);
    // console.log(authenticatedUserDetail?.permission?.Employee, "authenticatedUserDetail", employeeObject);


    // branch multi select
        
  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const [localGroup, setLocalGroup] = useState(branchData?.branches||[]);
  const [groupInput, setGroupInput] = useState();
  const [groupPopover, setGroupPopover] = useState(false);

  useEffect(()=>{
    if(branchData?.branches?.length>0){
        setLocalGroup(branchData?.branches);
    }
  },[branchData?.branches]);

  
  const [parentWidth, setParentWidth] = useState(null);
  const parentRef = useRef(null);

  const [tags, setTags] = useState([]);

  useEffect(() => {

    const updateParentWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        setParentWidth(width);
      }
    };

    // Call the update function on initial mount and window resize
    updateParentWidth();
    window.addEventListener('resize', updateParentWidth);
    inputRef?.current?.focus();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateParentWidth);
    };

  }, [groupPopover]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.group-wrapper')) {
        setGroupPopover(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

 
  useEffect(()=>{
    if(groupInput && !tags?.find((tag)=>tag?.name==groupInput?.name) && groupInput?.id!="dumy"){
        setTags([...tags, groupInput]);
        handelInputChange({name: "branch", value: [...tags, groupInput]});
    }
  }, [groupInput]);



  useEffect(()=>{
        if(singleEmployee?.hasOwnProperty("branch")  || singleEmployee['metadata']?.hasOwnProperty("branch")){
            const branchIds = singleEmployee["branch"] || singleEmployee['metadata']["branch"] ;
            setTags(
                branchIds.map((branchId)=>{

                    const filteredBranch = localGroup?.find((lg)=>(lg._id==branchId));
                    return {
                        name: filteredBranch?.branchname,
                        id: filteredBranch?._id
                    }
                    
                })
            )
        }
    
  },[singleEmployee]);


    return(
        <div className='sidebar-wrapper' >
            <div className='leftsidebar'>

                <div className='side-intro'>
                    {singleEmployee?
                    <>
                        <div className='emp-avatar'>
                            <Avatar size={70} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"}/>
                            {/* <Avatar size={70} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"}>{singleEmployee?.firstname? singleEmployee?.firstname[0]+" "+singleEmployee.lastname[0] : ""}</Avatar> */}
                        </div>
                        
                        <div className='text-head' style={{width:'100%'}}>
                            <div className='text-title' style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',}}
                            >
                                <span>
                                    {singleEmployee?.firstname+" "+singleEmployee?.lastname}
                                </span>
                                <Popover
                                    overlayClassName='notePopover'
                                    placement='right'
                                    content={
                                        <div className='popover-data'>
                                            <div className="popoverdataitem" onClick={()=>navigate("/user/employee-detail-view/"+singleEmployee?._id)}>
                                                Data Fields View
                                            </div>
                                            <div className="popoverdataitem" onClick={()=>navigate(`/user/employee-prop-history/`+singleEmployee?._id)}>
                                               Data Fields History
                                            </div>
                                        </div>
                                    }
                                >
                                    <FontAwesomeIcon style={{cursor:'pointer'}} icon={faEllipsisV}/>
                                </Popover>
                            </div>

                            <div className='text-subtitle'>

                                <div style={{textTransform:'lowercase', fontSize:'1em', marginBottom:'22px', marginTop:'10px'}}>
                                    <FontAwesomeIcon icon={faEnvelope}/> &nbsp; {singleEmployee?.metadata?.email} 
                                </div>   
                            
                                <div className="activity-btn-grp">
                                    
                                    <Popover
                                        content={"Make a phone call"}
                                    >
                                        <span>
                                            <button>
                                                <PhoneOutlined />
                                            </button>
                                            <span className='tiny-text'>Call</span>
                                        </span>
                                    </Popover>

                                    
                                    <Popover
                                        content={"Start conversation"}
                                    >
                                        <span>
                                            <button>
                                                {/* <FontAwesomeIcon icon={faComment} /> */}
                                                <MessageOutlined/>
                                            </button>
                                            <span className='tiny-text'>Chat</span>
                                        </span>
                                    </Popover>


                                    <Popover
                                        content={"Create a note"}
                                    >
                                        <span>

                                            <button>
                                                <FormOutlined icon={faPenToSquare} />
                                            </button>
                                            <span className='tiny-text'>Note</span>
                                        </span>
                                    </Popover>


                                    
                                    <Popover content={"Follow this"} >
                                        <span>
                                            <button>
                                                {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                                                <UserAddOutlined />
                                            </button>
                                            <span className='tiny-text'>Follow</span>
                                        </span>
                                    </Popover>
                                </div>

                            </div>
                        </div>
                    </>
                    : 
                    <div className='skeleton-custom'>

                    <Skeleton.Avatar active size={69} />
                    <Skeleton className='text-head' active/>
                    </div>
                    }
                </div>

                

                
            </div>
            

                {
                    (viewProperties?.length>0? viewProperties:
                    employeeObject)?.map((prop, index)=>{
                        if(prop?.label?.replaceAll(" ","")?.toLowerCase()=="firstname" || prop?.label?.replaceAll(" ","")?.toLowerCase()=="lastname"){
                            return(
                                <div className='fieldView'>
                                    <div>{prop?.label}</div>
                                    <div>
                                        {singleEmployee?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())  || singleEmployee['metadata']?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())? 
                                        singleEmployee[prop?.label?.replaceAll(" ","")?.toLowerCase()] || singleEmployee['metadata'][prop?.label?.replaceAll(" ","")?.toLowerCase()] : ""}
                                    </div>
                                </div>
    
                            )
                        }
                    })
                }

                <div className="btm-border"></div>

                
                {
                    (viewProperties?.length>0? viewProperties:
                    employeeObject)?.map((prop, index)=>{
                        if(prop?.label?.replaceAll(" ","")?.toLowerCase()!=="firstname" && prop?.label?.replaceAll(" ","")?.toLowerCase()!=="lastname"){
                            if(prop?.label?.toLowerCase()=="branch"){
                                return(                                
                                    tags?.length>0?
                                    <>
                                        <div className='fieldView'>
                                            <div>{prop?.label}</div>
                                            <div>
                                            {tags?.map((property)=>(
                                                <span>
                                                    {property.name}
                                                </span>
                                            ))}
                                            </div>
                                        </div>
        
                                        
                                    </>
                                    : null
                                    
                                )
                            }else{
                                return(
                                    <div className='fieldView'>
                                        <div>{prop?.label}</div>
                                        <div>
                                            {singleEmployee?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())  || singleEmployee['metadata']?.hasOwnProperty(prop?.label?.replaceAll(" ","")?.toLowerCase())? 
                                            singleEmployee[prop?.label?.replaceAll(" ","")?.toLowerCase()] || singleEmployee['metadata'][prop?.label?.replaceAll(" ","")?.toLowerCase()] : ""}
                                        </div>
                                    </div>
        
                                )
                            }                             
                        }
                    })
                }


            <PropertyDetailDrawer
                visible={propertyDetailDrawer}
                selectedProp={selectedProp} 
                clearState={setSelectedProp} 
                loading={employeePropLoading}
                data={employeeProp?.getEmployeePropHistory?.response?.map((data)=>({ ...data, createdby: data?.sourceDetail?.length>0? data?.sourceDetail[0]?.firstname  +" "+ data?.sourceDetail[0]?.lastname : <div style={{textAlign:'center'}}>--</div> }))}
                close={()=>setPropertyDetailDrawer(false)} />
               
        </div>
    );
}