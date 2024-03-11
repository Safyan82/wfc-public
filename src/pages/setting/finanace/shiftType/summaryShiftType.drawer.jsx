
import { LoadingOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Select, Spin } from "antd"
import { newPayLevelMutation, updatePayLevelMutation } from "../../../../util/mutation/paylevel.mutation"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {setNotification} from "@src/middleware/redux/reducers/notification.reducer";


export const SummaryShiftTypeDrawer = ({visible, close}) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [reporthour, setReportHour] = useState("");

    return(
        <Drawer
            open={visible}
            placement="right"
            title={"Add Summary Shift Type"}
            width={600}
            footer={
                <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                    <button  
                        // onClick={handelSubmit}
                        className={false? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                    >
                        { false? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                    </button>
                    <button  className={ false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{close()}}>
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
                    placeholder="Code"
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
                    <Select.Option value={"holiday"}>Holiday</Select.Option>
                    <Select.Option value={"meal_break"}>Meal Break</Select.Option>
                    <Select.Option value={"overtime"}>Overtime</Select.Option>
                    <Select.Option value={"regular"}>Regular</Select.Option>
                </Select>
            </Form.Item>

        </Drawer>
    )
}

