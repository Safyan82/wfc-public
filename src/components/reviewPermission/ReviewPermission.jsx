import { Avatar, Collapse } from "antd";
import "./reviewPermission.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const ReviewPermission = ({roleName, user}) =>{

    console.log("propAccesspropAccess")
    const state = useSelector((state)=>state);
    console.log(state, "propAccesspropAccess")
    const {propAccess} = useSelector((state)=>state?.permissionReducer);

    const [items, setItems] = useState([]);

    useEffect(()=>{
        if(propAccess){
            
            setItems(Object.keys(propAccess)?.map((module, index)=>({
                key: index,
                label: 
                <div  style={{margin: '0px 40px', fontWeight: 'bold'}} >
                    {module}
                </div>,
                children: 
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

                    {/* {Object.values(propAccess[module])[0]?.label} */}
                    {Object.values(propAccess[module])?.map((prop)=>{
                        if(prop?.label){
                            return(<div style={{margin: '16px 0px'}}>
                                <b>Property access </b>
                                <br/>
                                {prop?.label} 
                                 &nbsp; <b>View</b> ({prop?.visible==0? <span style={{fontStyle: 'italic', color: 'red'}}> Not allowed </span> : "Allow"})  &nbsp; <b>Edit</b> ({prop?.edit==0? <span style={{fontStyle: 'italic', color: 'red'}}> Not Allowed </span> : "Allow"}) 
                            </div>)
                        }
                    })}
                </div>
            })))
        }
    }, [propAccess]);

    return (
        <div style={{ maxHeight: '380px', overflowY: 'scroll'}}>
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
                       <a href={"mailto:"+user?.metadata?.email}>{user?.metadata?.email}</a> 
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