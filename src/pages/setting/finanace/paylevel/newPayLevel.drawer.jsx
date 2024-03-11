import { LoadingOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Spin } from "antd"
import { newPayLevelMutation, updatePayLevelMutation } from "../../../../util/mutation/paylevel.mutation"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {setNotification} from "@src/middleware/redux/reducers/notification.reducer";


export const NewPayLevelDrawer = ({editPayLevel, visible, close, refetch}) =>{
    const [newPayLevel, {loading: newPayLevelLoading}] = useMutation(newPayLevelMutation);
    const [updatePayLevel, {loading: updatePayLevelLoading}] = useMutation(updatePayLevelMutation);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    useEffect(()=>{
        if(editPayLevel?._id){
            setName(editPayLevel?.name);
            setCode(editPayLevel?.code);

        }else{
            setName("");
            setCode("");
        }

    },[editPayLevel]);

    const dispatch = useDispatch();

    const handelSubmit = async ()=>{
        try{
            if(editPayLevel?._id){

                
                await updatePayLevel({
                    variables:{
                        input:{
                            _id: editPayLevel?._id, name, code
                        }
                    }
                });
                

                dispatch(setNotification({
                    error: false,
                    notificationState: true,
                    message: "Pay level was updated successfully"
                }));

            }else{
                await newPayLevel({
                    variables:{
                        input:{
                            name, code
                        }
                    }
                });

                dispatch(setNotification({
                    error: false,
                    notificationState: true,
                    message: "Pay Level was added Successfully"
                }));

            }
            close();
            setName("");
            setCode("");
            
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
            title={"Add Pay Level"}
            width={600}
            footer={
            <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                <button  
                    onClick={handelSubmit}
                    className={name?.length<1 || code?.length<1 || newPayLevelLoading || updatePayLevelLoading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                >
                    { newPayLevelLoading || updatePayLevelLoading? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                </button>
                <button  className={ newPayLevelLoading || updatePayLevelLoading? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{close()}}>
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
                <label>Code</label>
                <Input
                    placeholder="Code"
                    className="generic-input-control"
                    value={code}
                    onChange={(e)=>setCode(e.target.value)}
                />
            </Form.Item>

        </Drawer>
    )
}