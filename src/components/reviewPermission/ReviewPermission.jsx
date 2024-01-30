import { Avatar, Collapse, Table } from "antd";
import "./reviewPermission.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { objectType } from "../../util/types/object.types";
import { accessType } from "../../util/types/access.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faCross, faTimes } from "@fortawesome/free-solid-svg-icons";

export const ReviewPermission = ({roleName, user, userAccessType}) =>{

    const {propAccess} = useSelector((state)=>state?.permissionReducer);

    const [items, setItems] = useState([]);

    const getChild = (propAccess, module)=>{
        const dataSource = Object.values(propAccess[module])?.filter((prop)=>prop?.label).map((prop)=>({
            label: prop?.label,
            view: prop?.visible==0? <FontAwesomeIcon style={{color:'red'}} icon={faTimes}/>: <FontAwesomeIcon style={{color:'rgb(0, 189, 165)'}} icon={faCheck}/>,
            edit: propAccess[module]?.edit==="None"? <FontAwesomeIcon style={{color:'red'}} icon={faTimes}/> : prop?.edit==0? <FontAwesomeIcon style={{color:'red'}} icon={faTimes}/>: <FontAwesomeIcon style={{color:'rgb(0, 189, 165)'}}  icon={faCheck}/>
        }))

        return (
            <div className="review-child">
                
                <div>
                    <b>Delete</b> ({propAccess[module]?.delete}),  &nbsp;
                    <b> Edit</b> ({propAccess[module]?.edit}), &nbsp; and
                    <b> View</b> ({propAccess[module]?.view})
                </div>

                {propAccess[module].hasOwnProperty('custom'+module)?
                <div style={{margin: '16px 0px'}}>
                    <b>Custom {module}</b> <br/>
                    { JSON.stringify(propAccess[module]['custom'+module]?.map((obj)=>obj.name).join(",", " , ").replaceAll(",", ", ")) }
                </div>
                : null}

                {dataSource?.length>0?
                <Table
                    style={{margin:'32px 0'}}
                    columns={[{title:'Property name', dataIndex:'label'}, {title:'View', dataIndex:'view'}, {title: 'Edit', dataIndex:'edit'}]}
                    dataSource={dataSource}
                />
                : null
                }

            </div>
        )
    };

    useEffect(()=>{
        if(propAccess){
            const permittedObject = userAccessType==accessType.AdminPermission ? propAccess : Object.fromEntries(Object.entries(propAccess).slice(0,5));
            setItems(Object.keys(permittedObject)?.map((module, index)=>({
                key: index,
                label: 
                <div  style={{margin: '0px 40px', fontWeight: 'bold'}} >
                    {module}
                </div>,
                children: getChild(propAccess, module)
                
            })))
        }
    }, [propAccess]);

    return (
        <div style={{ maxHeight: '70vh', height:'70vh', overflowY: 'scroll'}}>
            {user && Object.keys(user)?.length>0?
            <div id="userDetail" style={{margin: '0px 40px'}}>
                <Avatar size={60}>
                    {user?.firstname[0]+user?.lastname[0]}
                </Avatar>
                <div style={{display: 'flex', rowGap: '5px', flexDirection: 'column'}}>
                    <span>
                        {user?.firstname+" "+user?.lastname} 
                    </span>
                    <b>
                       <a href={"mailto:"+user?.email || user?.metadata?.email}>{user?.email || user?.metadata?.email}</a> 
                    </b>
                </div>
            </div>
            :null}
            {roleName?
            <>
                <div style={{margin: '0px 40px'}} className="role-title">{roleName}</div>
                <div style={{margin: '0px 40px'}}  className='review-title'>
                    Everything you need to get started
                </div>
            </>
            : null}

            <hr style={{margin: '30px 40px', borderColor:'rgb(223, 227, 235)'}}/>
            <div className="review-title" style={{fontSize:'22px', marginBottom:'10px',}}>
                Review permissions
            </div>
            <Collapse
                className="review-collapse" 
                items={items}
                />
            <br/>
        </div>
    )
}