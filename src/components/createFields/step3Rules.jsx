import { Checkbox, Typography } from "antd"
import React, { useEffect } from "react"

export const Rules = ({basicInfo, setWidth})=>{
    useEffect(()=>{
        setWidth(false);
    },[]);
    return(
        <React.Fragment>
            
            <Typography className='label'>
                <Typography.Title level={4}>{basicInfo?.label}</Typography.Title>
            </Typography>

            <Typography className='rule-heading'>
                <Typography.Title level={5}>Select property rules</Typography.Title>
            </Typography>

            <div className="propertyCheckbox">
                <div style={{color: 'black',marginTop:'5%', marginBottom: '2%'}} >Property visibility</div>
                <Checkbox style={{fontWeight:'300'}}>Show in forms, pop-up forms, and bots</Checkbox>
            </div>



        </React.Fragment>
    )
}