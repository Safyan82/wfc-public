import { LoadingOutlined } from "@ant-design/icons"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Spin } from "antd"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {setNotification} from "@src/middleware/redux/reducers/notification.reducer";
import { useMutation } from "@apollo/client"
import { newPayandBillColumnMutation, updatePayandBillColumnMutation } from "../../../../util/mutation/payandbillColumn.mutation"

export const NewPayBillColumnDrawer = ({visible, close, refetch, editColumn, setEditColumn}) =>{
    
    const [columnName, setColumnName] = useState("");
    const [columnOrder, setColumnOrder] = useState("");

    useEffect(()=>{
        if(Object.keys(editColumn)?.length>0){
            setColumnName(editColumn?.columnName);
            setColumnOrder(editColumn?.columnOrder)
        }else{
            setColumnName("");
            setColumnOrder("");
        }
    },[editColumn]);

    const dispatch = useDispatch();

    const [newPayandBillColumn, {loading:newPayandBillColumnLoading}] = useMutation(newPayandBillColumnMutation)
    
    const handelSubmit = async ()=>{
        try{
            await newPayandBillColumn({
                variables:{
                    input: {
                        columnName, columnOrder: Number(columnOrder)
                    }
                }
            });
            dispatch(setNotification({
                error: false,
                notificationState: true,
                message: "Pay and Bill Column was added successfully",
            }));
            close();
            await refetch();
        }catch(err){

            dispatch(setNotification({
                error: true,
                notificationState: true,
                message: err.message
            }));

        }
    }


    const [updatePayandBillColumn, {loading:updatePayandBillColumnLoading}] = useMutation(updatePayandBillColumnMutation)

    const updatePayandBill = async ()=>{
        try{
            await updatePayandBillColumn({
                variables:{
                    input: {
                        columnName, columnOrder: Number(columnOrder), _id: editColumn?._id
                    }
                }
            });
            dispatch(setNotification({
                error: false,
                notificationState: true,
                message: "Pay and Bill Column was updated successfully",
            }));
            close();
            setEditColumn({});
            await refetch();
        }catch(err){

            dispatch(setNotification({
                error: true,
                notificationState: true,
                message: err.message
            }));

            close();

        }
    }

    return(
        <Drawer
            open={visible}
            placement="right"
            title={"Add pay & bill column"}
            width={600}
            footer={
            <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                <button  
                    onClick={editColumn?._id? updatePayandBill :handelSubmit}
                    className={newPayandBillColumnLoading || updatePayandBillColumnLoading || columnName?.length<1 || columnOrder?.length<1 ?'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                    
                >
                    {newPayandBillColumnLoading || updatePayandBillColumnLoading ? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                </button>
                <button  className={newPayandBillColumnLoading || updatePayandBillColumnLoading ? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{close()}}>
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
                    value={columnName}
                    onChange={(e)=>setColumnName(e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <label>Column order</label>
                <Input
                    type="number"
                    placeholder="Column order"
                    className="generic-input-control"
                    value={columnOrder}
                    onChange={(e)=>setColumnOrder(e.target.value)}

                />
            </Form.Item>

        </Drawer>
    )
}