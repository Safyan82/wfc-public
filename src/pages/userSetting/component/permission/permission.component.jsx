import './permission.css';
import { Collapse, Input, Radio } from "antd";
import { useEffect, useState } from "react";
import standard from './robot.svg'
import pencil from './pencil.svg'
import admin from './keys.svg'
import { PopoverSearch } from '../../../setting/popoverSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { objectType } from '../../../../util/types/object.types';
import { useQuery } from '@apollo/client';
import { GetPropertyByGroupQuery, PROPERTYWITHFILTER } from '../../../../util/query/properties.query';


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
        {
            key: '3',
            label:  <div className="permission-accordin">
                    <div>
                        Review access
                    </div>
                    {isExpanded=='1'? null:
                        <div className="helping-heading"></div>
                    }
                </div>
,
            // children: <p>{text}</p>,
        },
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

    useEffect(()=>{
        console.log(groupProperty?.getPropertyByGroup?.data, "d saf")
        const d = groupProperty?.getPropertyByGroup?.data?.map((data)=>({
            key: data._id,
            label: data._id,
            children: data?.properties?.map((property)=>(<div className='object-prop-item'>{property?.label}</div>)) ,
        }));
        setList(d);
    },[groupProperty?.getPropertyByGroup?.data]);

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
                {
                    <Collapse  items={list}/>
                }
            </div>
        </div>
    )
}