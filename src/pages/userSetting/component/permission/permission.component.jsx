import './permission.css';
import { Collapse, Input, Popover, Radio } from "antd";
import { useEffect, useState } from "react";
import standard from './robot.svg'
import pencil from './pencil.svg'
import admin from './keys.svg'
import { PopoverSearch } from '../../../setting/popoverSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBugSlash, faExternalLink, faEye, faEyeSlash, faLink, faList12, faPencil, faPencilRuler, faSearch, faStoreSlash, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';
import { objectType } from '../../../../util/types/object.types';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery, PROPERTYWITHFILTER } from '../../../../util/query/properties.query';
import { useDispatch } from 'react-redux';
import { setDefaultPropPermission, setlocalPermission, updateDefaultPropPermissin, updateModulePermission } from '../../../../middleware/redux/reducers/permission.reducer';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CustomModulePermission } from '../../modal/customModulePermission';


export const PermissionComponent = ()=>{
    const [isExpanded, setExpand] = useState('1');


    const items = [
        {
            key: '1',
            label: <div className="permission-accordin">
                        <div>
                            Choose how to set access
                        </div>
                        {isExpanded=='1'? null:
                            <div className="helping-heading">Start with standard user access</div>
                        }
                    </div>
            ,
            children: <UserAccess />,
        },
        {
            key: '2',
            label:<div className="permission-accordin">
                    <div>
                        Choose permission
                    </div>
                    {isExpanded=='2'? null:
                        <div className="helping-heading">Change permissions</div>
                    }
                </div>
            ,
            children: <Permission />,
        },
//         {
//             key: '3',
//             label:  <div className="permission-accordin">
//                     <div>
//                         Review access
//                     </div>
//                     {isExpanded=='1'? null:
//                         <div className="helping-heading"></div>
//                     }
//                 </div>
// ,
//             // children: <p>{text}</p>,
//         },
    ];


    return(
        <div className="stepperBody createUser-block">
            <div className="createUser-block-header">
                <h3 className="h3">
                    Set up user access levels
                </h3>
                <div className="text">
                    Assign a seat to give users access to features. Narrow down that access with permissions.
                </div>
            </div>
            
            <div>
                <Collapse 
                    accordion 
                    defaultActiveKey={'1'}  
                    items={items}
                    onChange={(e)=>setExpand(e[0])}
                />      
            
            </div>

        </div>
    );
}

const UserAccess = ()=>{
    const [access, setAccess] = useState('standardPermissions');

    return(
        <div style={{ margin:'20px 20px', display:'flex', columnGap:'40px', justifyContent: 'center' }}>
            
            <div className={access=="standardPermissions"? "userAccess-box-active" :"userAccess-box"} onClick={()=>setAccess("standardPermissions")} >
                <Radio name="access" checked={access=="standardPermissions"? true: false} value={"standardPermissions"} onChange={(e)=>setAccess(e.target.value)}    className="radio-btn"/>
                <img style={{marginTop:'-25px'}} src={standard} width="40%" height="40%" alt="" />
                <h5 className='premission-head'>Start with standard user access</h5>
                <div className="text">
                    Assign default access to your users as-is or customize for your needs.
                </div>
            </div>

            <div className={access=="newPermissions"? "userAccess-box-active" :"userAccess-box"}  onClick={()=>setAccess("newPermissions")} >
                <Radio name="access" checked={access=="newPermissions"? true: false} value={"newPermissions"} onChange={(e)=>setAccess(e.target.value)}      className="radio-btn"/>
                <img style={{marginTop:'-25px'}}  src={pencil} width="40%" height="40%" alt="" />

                <h5 className='premission-head'>Start from scratch</h5>
                <div className="text">Create permissions specifically for this user.</div>

            </div>

            <div className={access=="adminPermission"? "userAccess-box-active" :"userAccess-box"}  onClick={()=>setAccess("adminPermission")}>
                <Radio name="access"  checked={access=="adminPermission"? true: false}  value={"adminPermission"} onChange={(e)=>setAccess(e.target.value)}   className="radio-btn"/>
                <img style={{marginTop:'-25px'}}  src={admin} width="40%" height="40%" alt="" />
                <h5 className='premission-head'>Make Super Admin</h5>
                <div className="text">
                Super Admins can manage all users, tools, and settings.
                </div>
            </div>

        </div>
    )
}

export const Permission = ({access, role})=>{
    
    const [obj, setObj] = useState(objectType.Branch);

    const {data: groupProperty} = useQuery(GetPropertyByGroupQuery,{
        variables:{
          objectType: obj
        },
        fetchPolicy:'network-only'
    });

    const [list, setList] = useState([]);
   

    const dispatch = useDispatch();

    const {propAccess} = useSelector((state)=>state?.permissionReducer);

    // console.log(propAccess)

    //  first time rendering when property data recieves
    useEffect(()=>{
        const d = groupProperty?.getPropertyByGroup?.data?.map((data)=>{
            
            return{
            key: data._id,
            
            label: 
                    <div style={{}} >
                        <span>{data?._id}</span>
                    </div>,

            children: data?.properties?.map((property, index)=>{
                return(
                    <div key={index} className={moduleView =="None" ? 'disabled object-prop-item' : 'object-prop-item'}>
                        <span>{property?.label}</span>
                        <div style={{display:'flex', columnGap:'20px'}} >
        
                            <FontAwesomeIcon className={propAccess[obj]?.view=="None"? 'access-icon disabled' :'access-icon'} onClick={()=>{
                                if(moduleView=="None"){
                                    return;
                                } 
                                else {
                                    dispatch(updateDefaultPropPermissin({
                                        id: property?._id,
                                        permission:{
                                            visible: propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.visible==1? 0 : 1,
                                            edit: propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.edit,
                                            delete: propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.delete || moduleDelete
                                        },
                                        objectType: obj
                                    }))
                                }}
                            } 
                                icon={propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.visible==1? faEye : faEyeSlash} />    
                        
                            <FontAwesomeIcon className={propAccess[obj]?.view=="None"? 'access-icon disabled' :'access-icon'} onClick={()=>{
                                 if(moduleView=="None"){
                                    return;
                                }else{
                                    dispatch(updateDefaultPropPermissin({
                                        id: property?._id,
                                        objectType: obj,
                                        permission:{
                                            edit: propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.edit==1? 0 : 1,
                                            visible: propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.visible,
                                            delete: propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.delete || moduleDelete
                                        }
                                    }))
                                }
                            }}  
                            icon={faPencil}  />
                            {propAccess.hasOwnProperty(obj) && propAccess[obj][property?._id]?.edit==1? null : <span className={propAccess[obj]?.view=="None" ? 'slash-disabled' : 'slash'}></span> }
                            
                        </div>
                    </div>
                )
            }),
        }});
        setList(d);
    },[groupProperty?.getPropertyByGroup?.data]);


// Top access control of each module
    const [moduleView, setModuleView] = useState(propAccess[obj]?.view || null);
    const [moduleEdit, setModuleEdit] = useState(null);
    const [moduleDelete, setModuleDelete] = useState(null);

    useEffect(()=>{
        setModuleView(null);
        setModuleDelete(null);
        setModuleEdit(null);
    }, [obj]);

    // popover state managements
    const [viewPopover, setViewPopover] = useState(false);
    const [editPopover, setEditPopover] = useState(false);
    const [deletePopover, setDeletePopover] = useState(false);
    const [customModulePermission, setCustomModulePermission] = useState(false);

    useEffect(()=>{
        if(moduleView!=null){
            if(moduleView=="None"){
                dispatch(updateModulePermission({objectType: obj, view: moduleView, edit: moduleView, delete: moduleView}));
            }else{
                dispatch(updateModulePermission({objectType: obj, view: moduleView, edit: moduleView, delete: moduleView}));
            }
        }
        if(moduleView?.toLowerCase()== "custom branch"){
            setCustomModulePermission(true);
        }else{
            setCustomModulePermission(false)
        }

        if(moduleView =="Team owns"){
            dispatch(updateModulePermission({objectType: obj, edit: "Team owns", delete: "Team owns"}));

            setModuleEdit("Team owns");
            setModuleDelete("Team owns");
        };
        if(moduleView=="None"){
           
            if(groupProperty?.getPropertyByGroup?.data){
                const d = groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            objectType: obj,
                            permission:{
                                visible: 0,
                                edit: 0,
                            }
                        }));
            })})}
                    
        }else{
            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            objectType: obj,
                            permission:{
                                visible: 1,
                                edit: 1
                            }
                        }));
            })})}

        }
    }, [moduleView]);

    useEffect(()=>{
        if(moduleEdit!=null){

            dispatch(updateModulePermission({objectType: obj, edit: moduleEdit}));
        }
        if(moduleEdit=="None" && moduleView=="None"){
            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            objectType: obj,
                            permission:{
                                visible: 0,
                                edit: 0
                            }
                        }));
            })})}
        }else if(moduleEdit=="None"){

            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            objectType: obj,
                            permission:{
                                visible: propAccess[obj][property?._id]?.visible,
                                edit: 0
                            }
                        }));
            })})}
        }        
        else{
            
            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            objectType: obj,
                            permission:{
                                visible: 1,
                                edit: 1
                            }
                        }));
            })})}
        }
    },[moduleEdit]);

    useEffect(()=>{
        if(moduleDelete!=null){
            dispatch(updateModulePermission({objectType: obj, delete: moduleDelete}));
        }
    },[moduleDelete]);

    console.log(propAccess,obj)
    
    // handel rendering when any thing change in depth access of each module
    useEffect(()=>{
        if(groupProperty?.getPropertyByGroup?.data){
            const d = groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                
                return{
                key: data._id,
                
                label: 
                    <div style={{}} >
                        <span>{data?._id}</span>
                    </div>,

                children: data?.properties?.map((property, index)=>{
                    return(
                        <div key={index} className={moduleView =="None" ? 'disabled object-prop-item' : 'object-prop-item'}>
                            <span>{property?.label}</span>
                            <div style={{display:'flex', columnGap:'20px'}} >
            
                                <FontAwesomeIcon className={propAccess[obj]?.view=="None"? 'access-icon disabled' :'access-icon'} onClick={()=>{
                                    if(moduleView=="None"){
                                        return;
                                    } 
                                    else {
                                        dispatch(updateDefaultPropPermissin({
                                            id: property?._id,
                                            permission:{
                                                visible: propAccess[obj][property?._id]?.visible==1? 0 : 1,
                                                edit: propAccess[obj][property?._id]?.edit,
                                                delete: propAccess[obj][property?._id]?.delete || moduleDelete
                                            },
                                            objectType: obj
                                        }))
                                    }}
                                } 
                                    icon={propAccess[obj][property?._id]?.visible==1? faEye : faEyeSlash} />    
                                
                                <FontAwesomeIcon className={propAccess[obj]?.view=="None" ? 'access-icon disabled' :'access-icon'} onClick={()=>{
                                     if(moduleView=="None"){
                                        return;
                                    }else{
                                        dispatch(updateDefaultPropPermissin({
                                            id: property?._id,
                                            objectType: obj,
                                            permission:{
                                                edit: propAccess[obj][property?._id]?.edit==1? 0 : 1,
                                                visible: propAccess[obj][property?._id]?.visible,
                                                delete: propAccess[obj][property?._id]?.delete || moduleDelete
                                            }
                                        }))
                                    }
                                }}  
                                icon={faPencil}  />
                                {propAccess[obj][property?._id]?.edit==1? null : <span className={propAccess[obj]?.view=="None"?'slash-disabled ':'slash'}></span> }
                                
                            </div>
                        </div>
                    )
                }),
            }});
            setList(d);
        }
        if(propAccess && propAccess.hasOwnProperty(obj)){

            setModuleView(propAccess[obj]?.view)
            setModuleDelete(propAccess[obj]?.delete)
            setModuleEdit(propAccess[obj]?.edit)
        }
    },[propAccess]);

    const [objectPropertyDefaultDetail, setobjectPropertyDefaultDetail] = useState({});

    useEffect(()=>{
        let objectPropertyDetail = {};
        groupProperty?.getPropertyByGroup?.data?.map((data)=>{
            data?.properties?.map((property, index)=>(
                objectPropertyDetail[property._id] = {visible:1, edit:1, objectType: obj}
            ));
        });
        setobjectPropertyDefaultDetail(objectPropertyDetail);
    }, [groupProperty?.getPropertyByGroup?.data]);

    useEffect(()=>{
        if(Object.keys(objectPropertyDefaultDetail)?.length && (!propAccess.hasOwnProperty(obj) || Object.keys(propAccess[obj])?.length<4)){
            dispatch(setDefaultPropPermission({[obj]:{view: "All "+obj , edit:  "All "+obj, delete:  "All "+obj, ...objectPropertyDefaultDetail}}))
        }else if(groupProperty?.getPropertyByGroup?.data?.length==0){
            setModuleDelete("All "+obj);
            setModuleEdit("All "+obj);
            setModuleView("All "+obj);
        }
    }, [objectPropertyDefaultDetail]);
    
   

    return(
        <div className='permission-block' style={role?{minHeight: '290px', maxHeight: '300px', overflowY: 'scroll'}:null}>
            <div className="object-block">
                <Input type="text" 
                    name="popoverSearch"
                    id={"popoverSearch"} 
                    style={{backgroundColor: 'white', marginBottom: '5px'  }} 
                    className='generic-input-control' 
                    placeholder="Search..."
                    autoFocus={access=='2' ?true:false}
                    // onChange={(e)=> setLocalGroup(groupList?.filter((group)=> (group.name)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                    suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                />
                {Object.values(objectType)?.map((object)=>(
                    <div className={object==obj?'object-block-item object-block-item-active' : 'object-block-item'} onClick={()=>setObj(object)}>{object}</div>
                ))}
            </div>

           

            <div className='object-prop'>
                <div className='module-block'>
                    <h4 style={{letterSpacing: '1px'}}>{obj}</h4>
                    <div className="text">Save important info about your {obj}. So your team can interact with branch data. <Link className='link' target='_blank' to="/setting" > Manage Properties <FontAwesomeIcon icon={faExternalLink}/> </Link></div>
                    <div style={{display:'flex', rowGap:'16px', flexDirection: 'column'}}>
                        
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <div style={{display: 'flex', columnGap: '15px'}}>
                                <b>View</b>
                                {
                                    propAccess.hasOwnProperty(obj) && (propAccess[obj]).hasOwnProperty("custom"+obj)?
                                    <span onClick={()=>setCustomModulePermission(true)} className='moduleList'>See {obj} List <FontAwesomeIcon icon={faLink}/> </span>
                                    : null
                                }
                            </div>

                            <div className="filter-item">

                                <Popover 
                                    overlayClassName='settingCustomPopover permission-popover'
                                    trigger={"click"}
                                    open={viewPopover}
                                    content={
                                    <div className='popover-data'>
                                        <div className="popoverdataitem" onClick={(e)=>{setViewPopover(!viewPopover); setModuleView(e.target.innerText)}}>
                                            All {obj}
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setViewPopover(!viewPopover); setModuleView(e.target.innerText)}}>
                                            Team owns
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setViewPopover(!viewPopover); setModuleView(e.target.innerText)}}>
                                            Custom {obj}
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setViewPopover(!viewPopover); setModuleView(e.target.innerText)}}>
                                            None
                                        </div>
                                    </div>

                                }>
                                    <span className='truncated-text' onClick={()=>{setViewPopover(!viewPopover)}}> { propAccess.hasOwnProperty(obj) ? propAccess[obj]?.view : moduleView}
                                    <span className='caret'></span>
                                    </span>
                                </Popover>
                            </div>
                        </div>

                           
                        <div className={propAccess[obj]?.view=="None"?"disabled":null} style={{display:'flex', justifyContent:'space-between'}}>
                            <b>Edit</b>
                            <div className="filter-item">

                                <Popover 
                                    overlayClassName='settingCustomPopover permission-popover'
                                    trigger={"click"}
                                    open={propAccess[obj]?.view=="None" || moduleView=="None"? false :editPopover}
                                    content={
                                    <div className='popover-data'>
                                        <div className={propAccess[obj]?.view=="Team owns" || moduleView=="Team owns"? "popoverdataitem disabled" : "popoverdataitem"} onClick={(e)=>{
                                            if(propAccess[obj]?.view=="Team owns" || moduleView=="Team owns"){
                                                return;
                                            }else{
                                                setEditPopover(!editPopover);
                                                setModuleEdit(e.target.innerText)
                                            }
                                        }}>
                                            All {obj}
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{
                                            setEditPopover(!editPopover);
                                            setModuleEdit(e.target.innerText)
                                        }}>
                                            Team owns
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{
                                            setEditPopover(!editPopover);
                                            setModuleEdit(e.target.innerText)
                                        }}>
                                            None
                                        </div>
                                    </div>

                                }>
                                    <span className={propAccess[obj]?.view=="None"?"disabled":null} onClick={()=>setEditPopover(moduleView=="None"? false :!editPopover)}> { propAccess.hasOwnProperty(obj) ? propAccess[obj]?.edit : moduleEdit} 
                                    <span className='caret'></span>
                                    </span> 
                                </Popover>
                            </div>
                        </div>


                        <div className={propAccess[obj]?.view=="None"? "disabled" : null}  style={{display:'flex', justifyContent:'space-between'}}>
                            <b>Delete <span className='badge'> Critical</span></b>

                            <div className="filter-item">

                                <Popover 
                                    overlayClassName='settingCustomPopover permission-popover'
                                    trigger={"click"}
                                    open={propAccess[obj]?.view=="None"? false :deletePopover}
                                    content={
                                    <div className='popover-data'>
                                        <div className={propAccess[obj]?.view=="Team owns" || moduleView=="Team owns"? "popoverdataitem disabled" : "popoverdataitem"} onClick={(e)=>{
                                            if(propAccess[obj]?.view=="Team owns" || moduleView=="Team owns"){
                                                return;
                                            }else{
                                                setModuleDelete(e.target.innerText);
                                                setDeletePopover(!deletePopover);
                                            }
                                        }}>
                                            All {obj} 
                                        </div>
                                        <div className={"popoverdataitem"} onClick={(e)=>{
                                            setModuleDelete(e.target.innerText);
                                            setDeletePopover(!deletePopover);
                                        }}>
                                         Team owns
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{
                                            setModuleDelete(e.target.innerText);
                                            setDeletePopover(!deletePopover);
                                        }}>
                                            None
                                        </div>
                                    </div>

                                }>
                                    <span className={propAccess[obj]?.view=="None"? "disabled" : null}  onClick={()=>{setDeletePopover(moduleView=="None"? false: !deletePopover)}}> { propAccess.hasOwnProperty(obj) ? propAccess[obj]?.delete : moduleDelete} 
                                    <span className='caret'></span>
                                    </span> 
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Collapse  items={list} />
                
            </div>

            {customModulePermission?
                <CustomModulePermission obj={obj} visible={customModulePermission} onClose={()=>setCustomModulePermission(!customModulePermission)}/>
                : 
                null
            }
        </div>
    )
}