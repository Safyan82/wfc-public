
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faBusinessTime, faMapLocationDot, faGroupArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Popover, Collapse, Skeleton, Tag, DatePicker, Input } from 'antd';
import {faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { PhoneOutlined,  FormOutlined, MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import { GET_BRANCHES,} from '@src/util/query/branch.query';
import { useMutation, useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '@src/components/spinner';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { setNotification } from '@src/middleware/redux/reducers/notification.reducer';
import { SiteGroupObjectQuery } from '../../../../util/query/siteGroup.query';
import { GenerateFields } from '../../../../util/generateFields/generateFields';
import { UpdateSiteGroupMutation } from '../../../../util/mutation/siteGroup.mutation';
import { useDispatch } from 'react-redux';

export const SiteGroupDetailPageLeftSideBar = ({siteGroup, loading, setIsFieldChanged, saveUpdate, setSaveUpdate, refetch})=>{
    
    const {data:siteGroupObject, loading: siteGroupObjectLoading, refetch: siteGroupObjectRefetch} = useQuery(SiteGroupObjectQuery);
    const navigate = useNavigate();
    

    const [siteGroupSchema, setSiteGroupSchema] = useState([]);
    useEffect(()=>{
        if(siteGroupObject?.getSiteGroupObject?.response){
            setSiteGroupSchema(siteGroupObject?.getSiteGroupObject?.response?.map((object)=>({
                label: object?.propertyDetail?.label,
                name: object?.propertyDetail?.label?.toLowerCase().replace(/\s/g,""),
                fieldType: object?.propertyDetail?.fieldType,
                property: object,
            })));
        }
    },[siteGroupObject?.getSiteGroupObject?.response]);

    const [edit, setEdit] = useState(false);

    const [field, setField] = useState([]);

    const handelDataValue = ({name, value})=>{
        if(name){
            if(value){
                const isExist = field?.find((f)=>f.name==name);
                if(isExist){
                    setField(field?.map((f)=>{
                        if(f.name==name){
                            return {
                                ...f,
                                value
                            }
                        }else{
                            return f;
                        }
                    }))
                }else{
                    setField([...field, {name, value}])
                }
            }else{
                // setField(field?.filter(f=>f.name!==name));
                
                const isExist = field?.find((f)=>f.name==name);
                if(isExist){
                    setField(field?.map((f)=>{
                        if(f.name==name){
                            return {
                                ...f,
                                value:''
                            }
                        }else{
                            return f;
                        }
                    }))
                }else{
                    setField([...field, {name, value:''}])
                }
            }
        }
    }

    useEffect(()=>{
        if(Object.values(siteGroup)?.length>0 && siteGroupSchema?.length>0){
            const localFeed = siteGroupSchema?.map((schema)=>{
                const {name} = schema;
                if (name=="customer"){
                    return({name, value: siteGroup['customerId']})
                }else if(name=="branch"){
                    return({name, value: siteGroup['branchId']})
                }                
                else{
                    return {name, value: siteGroup[name]}
                }
            });
            setField([...localFeed]);
        }
    },[siteGroupSchema, siteGroup]);

    useEffect(()=>{
        
        if(Object.values(siteGroup)?.length>0 && siteGroupSchema?.length>0){
            const localFeed = siteGroupSchema?.map((schema, index)=>{
                if(schema?.name=="customer"){
                    return {name: schema?.name, value: siteGroup['customerId']}

                }else if(schema?.name=="branch"){
                    return {name: schema?.name, value: siteGroup['branchId']}

                }else{

                    return {name: schema?.name, value: siteGroup[schema?.name]}
                }
            });
            const isEqual = localFeed.every((local)=>field.find((f)=> {
                if(f.name==local.name && f.value.toLowerCase()==local.value.toLowerCase()){
                    return true;
                }else{
                    return false;
                }
            }));
            setIsFieldChanged(!isEqual);
        }

    },[field]);

    
    useEffect(()=>{
        setIsFieldChanged(false);
        setEdit(false);
    },[loading]);

    const [updateSiteGroup, {loading: updateSiteGroupLoading}] = useMutation(UpdateSiteGroupMutation);
    const dispatch = useDispatch();
    const param = useParams();
    const handelUpdateSiteGroup = async()=>{
        try{
            
            let schemaFields = [];

            field?.map((field)=>{
                if(field.name==="sitegroupname" || field.name==="customer" || field.name==="branch"){
                    schemaFields.push(field);
                }
                else{
                    schemaFields.push({...field, metadata:1})
                }
            });


            await updateSiteGroup({
                variables:{
                    input:{
                        _id: param?.id,
                        properties: schemaFields
                    }
                }
            });
            setEdit(false);
            setSaveUpdate(false);
            await refetch();
            dispatch(setNotification({
                error: false,
                notificationState: true,
                message: "Site Group was updated successfully"
            }));
        }catch(err){
            dispatch(setNotification({
                error: true,
                notificationState: true,
                message: err.message
            }));
        }   
    }

    useEffect(()=>{
        if(saveUpdate){
            handelUpdateSiteGroup();
        }
    },[saveUpdate])

    return(
        <div className='sidebar-wrapper' >
            <div className='leftsidebar'>

                <div className='side-intro'>
                    {siteGroup?
                    <>
                        <div className='emp-avatar'>
                            {/* <Avatar size={70} src={"https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/424898432_4542228726002734_5791661793434540279_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=95FoMIfU6UgAX9ihnaO&_nc_ht=scontent-man2-1.xx&oh=00_AfBAVkq-CuOQsJjYfVH10IDnqpXH79nyCpVGPrFJndgURA&oe=65EB1456"}/> */}
                            <Avatar size={70} ><FontAwesomeIcon icon={faMapLocationDot} /></Avatar>
                        </div>
                        
                        <div className='text-head' style={{width:'100%'}}>
                            <div className='text-title' style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',}}
                            >
                                <span>
                                    {siteGroup?.sitegroupname?.toUpperCase()}
                                </span>
                                <Popover
                                    overlayClassName='notePopover'
                                    // placement='bottom'
                                    content={
                                        <div className='popover-data'>
                                            <div className="popoverdataitem" onClick={()=>setEdit(!edit)}>
                                               {edit? "Cancel Edit" : "Edit"}
                                            </div>
                                            <div className="disabled popoverdataitem" onClick={()=>navigate("/user/employee-detail-view/"+siteGroup?._id)}>
                                                Data Fields View
                                            </div>
                                            <div className="disabled popoverdataitem" onClick={()=>navigate(`/user/employee-prop-history/`+siteGroup?._id)}>
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
                                    <FontAwesomeIcon icon={faGroupArrowsRotate}/> &nbsp; {"Site Group"} 
                                </div>   
                            
                                <div className="activity-btn-grp">
                                    
                                    <Popover
                                        content={"Make a phone call"}
                                    >
                                        <span>
                                            <button className='disabled-btn'>
                                                <PhoneOutlined />
                                            </button>
                                            <span className='tiny-text disabled'>Call</span>
                                        </span>
                                    </Popover>

                                    
                                    <Popover
                                        content={"Start conversation"}
                                    >
                                        <span>
                                            <button className='disabled-btn'>
                                                {/* <FontAwesomeIcon icon={faComment} /> */}
                                                <MessageOutlined/>
                                            </button>
                                            <span className='tiny-text disabled'>Chat</span>
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
                                            <button className='disabled-btn'>
                                                {/* <FontAwesomeIcon icon={faUserPlus} /> */}
                                                <UserAddOutlined />
                                            </button>
                                            <span className='tiny-text disabled'>Follow</span>
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
                    Object.values(siteGroup)?.map((prop, index)=>{
                        if(Object.keys(siteGroup)[index]=="sitegroupname"){
                            return(
                                edit?
                                <GenerateFields
                                    label = {siteGroupSchema[index]?.label}
                                    name = {siteGroupSchema[index]?.name}
                                    fieldType= {siteGroupSchema[index]?.fieldType}
                                    handelDataValue = {handelDataValue}
                                    value={ field?.find((f)=>f.name==siteGroupSchema[index]?.name)?.value }
                                    property = {siteGroupSchema[index]}
                                />
                                :
                                <div className='fieldView'>
                                    <div>
                                        {siteGroupSchema[index].label}
                                    </div>
                                    <div>
                                        {prop}
                                    </div>                                
                                </div>

                            )
                        }
                    })
                }

                <div className="btm-border"></div>

                
                {
                    siteGroupSchema?.map((schema)=>{
                        if(schema?.name!=="sitegroupname"){
                            return(
                                    edit?
                                    <GenerateFields
                                        label = {schema?.label}
                                        name = {schema?.name}
                                        fieldType= {schema?.fieldType}
                                        handelDataValue = {handelDataValue}
                                        value={ field?.find((f)=>schema?.name==f.name)?.value }
                                        property = {schema}
                                    />
                                    :
                                    <div className='fieldView'>
                                        <div>{schema?.label}</div>
                                        <div>
                                            {siteGroup[schema?.name]}
                                        </div>
                                    </div>
            
                            )
                        }
                    })
                }
               
        </div>
    );
}