import './permission.css';
import { Collapse, Input, Popover, Radio } from "antd";
import { useEffect, useState } from "react";
import standard from './robot.svg'
import pencil from './pencil.svg'
import admin from './keys.svg'
import { PopoverSearch } from '../../../setting/popoverSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBugSlash, faExternalLink, faEye, faEyeSlash, faPencil, faPencilRuler, faSearch, faStoreSlash, faTrashCanArrowUp } from '@fortawesome/free-solid-svg-icons';
import { objectType } from '../../../../util/types/object.types';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery, PROPERTYWITHFILTER } from '../../../../util/query/properties.query';
import { useDispatch } from 'react-redux';
import { setDefaultPropPermission, setlocalPermission, updateDefaultPropPermissin } from '../../../../middleware/redux/reducers/permission.reducer';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


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

const Permission = ({access})=>{
    
    const [obj, setObj] = useState(objectType.Branch);
    const {data: groupProperty} = useQuery(GetPropertyByGroupQuery,{
        variables:{
          objectType: obj
        },
        fetchPolicy:'network-only'
    });

    const [list, setList] = useState([]);

    const [activeKey, setActiveKey] = useState([]);

   

    const dispatch = useDispatch();

    const {propAccess} = useSelector((state)=>state?.permissionReducer);
  


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
                dispatch(setDefaultPropPermission({[property._id]: {visible:1, edit:1} }))
                return(
                    <div key={index} className='object-prop-item'>
                                    <span>{property?.label}</span>
                                    <div style={{display:'flex', columnGap:'20px'}}>

                                        <FontAwesomeIcon className='access-icon'  
                                            icon={propAccess?.visible? faEye : faEyeSlash} />    
                                    
                                        <FontAwesomeIcon className='access-icon'  
                                            icon={propAccess?.edit? faPencil : faPencilRuler}  />

                                        <FontAwesomeIcon className='access-icon'  
                                            icon={propAccess?.delete? faTrashCanArrowUp : faStoreSlash}  />
                                    </div>
                    </div>
                )
            }),
        }});
        setList(d);
    },[groupProperty?.getPropertyByGroup?.data]);



// Top access control of each module
    const [moduleView, setModuleView] = useState("All "+obj);
    const [moduleEdit, setModuleEdit] = useState("All "+obj);
    const [moduleDelete, setModuleDelete] = useState("All "+obj);

    useEffect(()=>{
        setModuleView("All "+obj);
        setModuleEdit("All "+obj);
        setModuleDelete("All "+obj);
    },[obj]);

    // popover state managements
    const [viewPopover, setViewPopover] = useState(false);
    const [editPopover, setEditPopover] = useState(false);
    const [deletePopover, setDeletePopover] = useState(false);

    useEffect(()=>{
        if(moduleView =="Team owns"){
            setModuleEdit("Team owns");
            setModuleDelete("Team owns");
        };
        if(moduleView=="None"){
            if(groupProperty?.getPropertyByGroup?.data){
                const d = groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            permission:{
                                visible: 0,
                                edit: 0,
                                delete: propAccess[property?._id]?.delete
                            }
                        }));
            })})}
                    
        }else{
            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            permission:{
                                visible: 1,
                                edit: 1
                            }
                        }));
            })})}

        }
    }, [moduleView]);

    useEffect(()=>{
        if(moduleEdit=="None"){
            
            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            permission:{
                                visible: 1,
                                edit: 0
                            }
                        }));
            })})}
        }else{
            
            if(groupProperty?.getPropertyByGroup?.data){
                groupProperty?.getPropertyByGroup?.data?.map((data)=>{
                    data?.properties?.map((property, index)=>{
                        dispatch(updateDefaultPropPermissin({
                            id: property?._id,
                            permission:{
                                visible: 1,
                                edit: 1
                            }
                        }));
            })})}
        }
    },[moduleEdit]);
    
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
            
                                <FontAwesomeIcon className={moduleView == "None"? 'access-icon disabled' :'access-icon'} onClick={()=>{
                                    if(moduleView=="None"){
                                        return;
                                    } 
                                    else {
                                        dispatch(updateDefaultPropPermissin({
                                            id: property?._id,
                                            permission:{
                                                visible: propAccess[property?._id]?.visible==1? 0 : 1,
                                                edit: propAccess[property?._id]?.edit,
                                                delete: propAccess[property?._id]?.delete
                                            }
                                        }))
                                    }}
                                } 
                                    icon={propAccess[property?._id]?.visible==1? faEye : faEyeSlash} />    
                            
                                <FontAwesomeIcon className={moduleView == "None"? 'access-icon disabled' :'access-icon'} onClick={()=>{
                                     if(moduleView=="None"){
                                        return;
                                    }else{
                                        dispatch(updateDefaultPropPermissin({
                                            id: property?._id,
                                            permission:{
                                                edit: propAccess[property?._id]?.edit==1? 0 : 1,
                                                visible: propAccess[property?._id]?.visible,
                                                delete: propAccess[property?._id]?.delete
                                            }
                                        }))
                                    }
                                }}  
                                icon={faPencil}  />
                                {propAccess[property?._id]?.edit==1? null : <span className={moduleView=="None"?'slash-disabled ':'slash'}></span> }
                                
                            </div>
                        </div>
                    )
                }),
            }});
            setList(d);
        }
        console.log(propAccess, "propAccess");
    },[propAccess]);

    return(
        <div className='permission-block'>
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
                            <b>View</b>
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
                                            None
                                        </div>
                                    </div>

                                }>
                                    <span className='truncated-text' onClick={()=>{setViewPopover(!viewPopover)}}> {moduleView}
                                    <span className='caret'></span>
                                    </span> 
                                </Popover>
                            </div>
                        </div>

                           
                        <div className={moduleView=="None"?"disabled":null} style={{display:'flex', justifyContent:'space-between'}}>
                            <b>Edit</b>
                            <div className="filter-item">

                                <Popover 
                                    overlayClassName='settingCustomPopover permission-popover'
                                    trigger={"click"}
                                    open={moduleView=="None"? false :editPopover}
                                    content={
                                    <div className='popover-data'>
                                        <div className={moduleView=="Team owns"? "popoverdataitem disabled" : "popoverdataitem"} onClick={(e)=>{
                                            if(moduleView=="Team owns"){
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
                                    <span className={moduleView=="None"?"disabled":null} onClick={()=>setEditPopover(moduleView=="None"? false :!editPopover)}> {moduleEdit} 
                                    <span className='caret'></span>
                                    </span> 
                                </Popover>
                            </div>
                        </div>


                        <div className={moduleView=="None"? "disabled" : null}  style={{display:'flex', justifyContent:'space-between'}}>
                            <b>Delete <span className='badge'> Critical</span></b>

                            <div className="filter-item">

                                <Popover 
                                    overlayClassName='settingCustomPopover permission-popover'
                                    trigger={"click"}
                                    open={moduleView=="None"? false :deletePopover}
                                    content={
                                    <div className='popover-data'>
                                        <div className={moduleView=="Team owns"? "popoverdataitem disabled" : "popoverdataitem"} onClick={(e)=>{
                                            if(moduleView=="Team owns"){
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
                                    <span className={moduleView=="None"? "disabled" : null}  onClick={()=>{setDeletePopover(moduleView=="None"? false: !deletePopover)}}> {moduleDelete} 
                                    <span className='caret'></span>
                                    </span> 
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Collapse  items={list} />
                
            </div>

        </div>
    )
}