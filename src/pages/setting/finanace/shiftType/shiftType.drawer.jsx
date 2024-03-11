
import { LoadingOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@apollo/client"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Select, Spin } from "antd"
import { newPayLevelMutation, updatePayLevelMutation } from "../../../../util/mutation/paylevel.mutation"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {setNotification} from "@src/middleware/redux/reducers/notification.reducer";
import { getPayandBillColumnQuery } from "@src/util/query/payandbillColumn.query";


export const ShiftTypeDrawer = ({visible, close}) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [summaryShiftType, setSummaryShiftType] = useState("");

    const {data, loading:getPayandBillColumnLoading, refetch} = useQuery(getPayandBillColumnQuery);



    return(
        <Drawer
            open={visible}
            placement="right"
            title={"Add Summary Shift Type"}
            width={800}
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
                <label>Summary shift type</label>
                <Select
                    placeholder="Select summary shift type"
                    value={summaryShiftType}
                    onChange={(e)=>setSummaryShiftType(e)}
                    className="custom-select"
                >
                    <Select.Option>Holiday</Select.Option>
                    <Select.Option>Meal Break</Select.Option>
                    <Select.Option>Overtime</Select.Option>
                    <Select.Option>Regular</Select.Option>
                </Select>
            </Form.Item>

            <div style={{display:'flex', gap:'30px'}}>

                {/* pay column */}
                <div style={{width:'100%'}}>
                    <Form.Item>
                        <label>Pay code</label>
                        <Input className="generic-input-control" />
                    </Form.Item>
                    <Form.Item>
                        <label>Pay column</label>
                        <Select
                            className="custom-select"
                            placeholder="Select pay column"
                        >
                            {data?.getPayandBillColumn?.response?.map((col)=>(
                                <Select.Option>{col.columnName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <label>Pay method</label>
                        <Input className="generic-input-control" />
                    </Form.Item>
                    <Form.Item>
                        <label>Pay multiplier</label>
                        <Input className="generic-input-control" />
                    </Form.Item>
                </div>

                {/* divider */}
                <div style={{borderRight:'1px solid lightgrey', height:'auto', margin:'25px 0 10px 0'}}></div>

                {/* bill column */}
                <div style={{width:'100%'}}>
                    <Form.Item>
                        <label>Bill code</label>
                        <Input className="generic-input-control" />
                    </Form.Item>
                    <Form.Item>
                        <label>Bill column</label>
                        <Select
                            className="custom-select"
                            placeholder="Select bill column"
                        >
                            {data?.getPayandBillColumn?.response?.map((col)=>(
                                <Select.Option>{col.columnName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <label>Bill method</label>
                        <Input className="generic-input-control" />
                    </Form.Item>
                    <Form.Item>
                        <label>Bill multiplier</label>
                        <Input className="generic-input-control" />
                    </Form.Item>
                </div>

            </div>

        </Drawer>
    )
}

