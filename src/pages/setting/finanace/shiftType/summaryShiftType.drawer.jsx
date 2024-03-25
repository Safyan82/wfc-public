
import { LoadingOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {setNotification} from "@src/middleware/redux/reducers/notification.reducer";
import { newSummaryShiftTypeMutation, updateSummaryShiftTypeMutation } from "../../../../util/mutation/summaryshiftType.mutation"


export const SummaryShiftTypeDrawer = ({visible, close, refetchSummaryShiftType, summaryShiftTypeEdit}) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [reporthour, setReportHour] = useState("");
    
    useEffect(()=>{
        
        setName("");
        setDescription("");
        setReportHour("");
    },[visible]);


    const [newSummaryShiftType, { loading:newSummaryShiftTypeLoading }] = useMutation(newSummaryShiftTypeMutation);
    const [updateSummaryShiftType, { loading: updateSummaryShiftTypeLoading }] = useMutation(updateSummaryShiftTypeMutation);
    const dispatch = useDispatch();
    
    const handelSubmit = async()=>{
        try{

            if(summaryShiftTypeEdit?._id){


                await updateSummaryShiftType({
                    variables: {
                        input: {
                            _id:summaryShiftTypeEdit?._id,  name, description, reporthour
                        }
                    }
                });
                
                dispatch(setNotification({
                    error: false,
                    notificationState: true,
                    message: "Summary Hour Type was updated successfully",
                }));

            }else{

                await newSummaryShiftType({
                    variables: {
                        input: {
                            name, description, reporthour
                        }
                    }
                });
                dispatch(setNotification({
                    error: false,
                    notificationState: true,
                    message: "Summary Hour Type was added successfully",
                }));
            }

            
            setName("");
            setDescription("");
            setReportHour("");

            close();
            await refetchSummaryShiftType();

        }catch(err){
            dispatch(setNotification({
                error: true,
                notificationState: true,
                message: err.message
            }));
        }
    };

    // set ShiftTypeSummary to edit

    useEffect(()=>{
        if(summaryShiftTypeEdit?._id){
            const {name, description, reporthour} = summaryShiftTypeEdit;
            setName(name);
            setDescription(description);
            setReportHour(reporthour);
        }else{
            setName("");
            setDescription("");
            setReportHour("");
        }
    }, [summaryShiftTypeEdit]);


    return(
        <Drawer
            open={visible}
            placement="right"
            title={summaryShiftTypeEdit?._id? "Update Summary Hour Type" : "Add Summary Hour Type"}
            width={600}
            footer={
                <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                    <button  
                        onClick={handelSubmit}
                        className={newSummaryShiftTypeLoading || updateSummaryShiftTypeLoading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                    >
                        { newSummaryShiftTypeLoading || updateSummaryShiftTypeLoading? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                    </button>
                    <button  className={ newSummaryShiftTypeLoading || updateSummaryShiftTypeLoading? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{close()}}>
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
                <label>Reporting Hour</label>
                <Select
                    placeholder="Select Reporting Hour"
                    value={reporthour?.length>0 ? reporthour: "Select Reporting Hour"}
                    onChange={(e)=>setReportHour(e)}
                    className="custom-select"
                >
                    <Select.Option value={"Holiday"}>Holiday</Select.Option>
                    <Select.Option value={"Meal Break"}>Meal Break</Select.Option>
                    <Select.Option value={"Overtime"}>Overtime</Select.Option>
                    <Select.Option value={"Regular"}>Regular</Select.Option>
                </Select>
            </Form.Item>

        </Drawer>
    )
}

