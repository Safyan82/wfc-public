
import { LoadingOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@apollo/client"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Select, Spin } from "antd"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {setNotification} from "@src/middleware/redux/reducers/notification.reducer";
import { getPayandBillColumnQuery } from "@src/util/query/payandbillColumn.query";
import { newShiftTypeMutation, updateShiftTypeMutation } from "../../../../util/mutation/shiftType.mutation"


export const ShiftTypeDrawer = ({visible, close, summaryShiftType, shiftTypeEdit, shiftTyprefetch}) => {
    console.log(shiftTypeEdit, "shiftTypeEdit")
    const [name, setName] = useState(shiftTypeEdit?.name? shiftTypeEdit?.name : "");
    const [description, setDescription] = useState(shiftTypeEdit?.description? shiftTypeEdit?.description :"");
    const [summaryShiftTypeId, setSummaryShiftTypeId] = useState(shiftTypeEdit?.summaryShiftTypeId? shiftTypeEdit?.summaryShiftTypeId : "");
    const [payCode, setPayCode] = useState(shiftTypeEdit?.payCode? shiftTypeEdit?.payCode: "");
    const [payColumn, setPayColumn] = useState(shiftTypeEdit?.payColumn? shiftTypeEdit?.payColumn :"");
    const [payMethod, setPayMethod] = useState(shiftTypeEdit?.payMethod? shiftTypeEdit?.payMethod : "");
    const [payMultiplier, setPayMultiplier] = useState(shiftTypeEdit?.payMultiplier? shiftTypeEdit?.payMultiplier : "");
    const [billCode, setBillCode] = useState(shiftTypeEdit?.billCode? shiftTypeEdit?.billCode: "");
    const [billColumn, setBillColumn] = useState(shiftTypeEdit?.billColumn? shiftTypeEdit?.billColumn :"");
    const [billMethod, setBillMethod] = useState(shiftTypeEdit?.billMethod? shiftTypeEdit?.billMethod : "");
    const [billMultiplier, setBillMultiplier] = useState(shiftTypeEdit?.billMultiplier? shiftTypeEdit?.billMultiplier : "");

    const {data, loading:getPayandBillColumnLoading, refetch} = useQuery(getPayandBillColumnQuery);

    const [newShiftType, {loading: newShiftTypeLoading}] = useMutation(newShiftTypeMutation);
    const [updateShiftType, {loading: updateShiftTypeLoading}] = useMutation(updateShiftTypeMutation);
    const dispatch = useDispatch();

    const handelSubmit = async()=>{
        try{
            if(shiftTypeEdit?._id){

                await updateShiftType({
                    variables:{
                        input: {
                            _id: shiftTypeEdit?._id, name, description, summaryShiftTypeId, payCode, payColumn, payMethod, payMultiplier,
                            billCode, billColumn, billMethod, billMultiplier
                        }
                    }
                });

                dispatch(setNotification({
                    error: false,
                    notificationState: true,
                    message: "Shift Type was updated successfully",
                }));
            }
            else{
                await newShiftType({
                    variables:{
                        input:{
                            name, description, summaryShiftTypeId, payCode, payColumn, payMethod, payMultiplier,
                            billCode, billColumn, billMethod, billMultiplier
                        }
                    }
                });
                dispatch(setNotification({
                    error: false,
                    notificationState: true,
                    message: "Shift Type was created successfully",
                }));
            }
            close();
            await shiftTyprefetch();
        }catch(err){
            dispatch(setNotification({
                error: true,
                notificationState: true,
                message: err.message,
            }))
        }
    }

    return(
        <Drawer
            open={visible}
            placement="right"
            title={"Add Summary Shift Type"}
            width={800}
            footer={
            <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                <button  
                    onClick={handelSubmit}
                    className={newShiftTypeLoading || updateShiftTypeLoading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                >
                    { newShiftTypeLoading || updateShiftTypeLoading? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                </button>
                <button  className={ newShiftTypeLoading || updateShiftTypeLoading? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{close()}}>
                    Cancel
                </button>
            </div>
            }
            closable={true}
            onClose={()=>{}}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{close()}} className='close-icon'/>}
            maskClosable={false}
            mask={true}
        >

            <Form.Item>
                <label>Name</label>
                <Input
                    placeholder="Name"
                    className="generic-input-control"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <label>Description</label>
                <Input
                    placeholder="Description"
                    className="generic-input-control"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <label>Summary shift type</label>
                <Select
                    placeholder="Select summary shift type"
                    value={summaryShiftTypeId}
                    onChange={(e)=>setSummaryShiftTypeId(e)}
                    className="custom-select"
                >
                    {summaryShiftType?.map((sst)=>(
                        <Select.Option value={sst?._id}>{sst?.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <div style={{display:'flex', gap:'30px'}}>

                {/* pay column */}
                <div style={{width:'100%'}}>
                    <Form.Item>
                        <label>Pay code</label>
                        <Input 
                            className="generic-input-control" 
                            onChange={(e)=>setPayCode(e.target.value)}
                            value={payCode}
                        />
                    </Form.Item>
                    <Form.Item>
                        <label>Pay column</label>
                        <Select
                            className="custom-select"
                            placeholder="Select pay column"
                            onChange={(e)=>setPayColumn(e)}
                            value={payColumn}
                        >
                            {data?.getPayandBillColumn?.response?.map((col)=>(
                                <Select.Option value={col?._id}>{col.columnName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <label>Pay method</label>
                        <Input className="generic-input-control" 
                            value={payMethod}
                            onChange={(e)=>setPayMethod(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <label>Pay multiplier</label>
                        <Input className="generic-input-control" 
                            value={payMultiplier}
                            onChange={(e)=>setPayMultiplier(e.target.value)}
                        />
                    </Form.Item>
                </div>

                {/* divider */}
                <div style={{borderRight:'1px solid lightgrey', height:'auto', margin:'25px 0 10px 0'}}></div>

                {/* bill column */}
                <div style={{width:'100%'}}>
                    <Form.Item>
                        <label>Bill code</label>
                        <Input 
                            value={billCode}
                            onChange={(e)=>setBillCode(e.target.value)}
                        className="generic-input-control" />
                    </Form.Item>
                    <Form.Item>
                        <label>Bill column</label>
                        <Select
                            className="custom-select"
                            placeholder="Select bill column"
                            value={billColumn}
                            onChange={(e)=>setBillColumn(e)}
                        >
                            {data?.getPayandBillColumn?.response?.map((col)=>(
                                <Select.Option value={col?._id}>{col.columnName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <label>Bill method</label>
                        <Input 
                            onChange={(e)=>setBillMethod(e.target.value)}
                            value={billMethod}
                        className="generic-input-control" />
                    </Form.Item>
                    <Form.Item>
                        <label>Bill multiplier</label>
                        <Input 
                            onChange={(e)=>setBillMultiplier(e.target.value)}
                            value={billMultiplier}
                        className="generic-input-control" />
                    </Form.Item>
                </div>

            </div>

        </Drawer>
    )
}

