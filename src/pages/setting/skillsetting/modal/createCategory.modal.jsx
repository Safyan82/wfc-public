import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, Form, Input, Modal } from "antd";
import Spinner from "../../../../components/spinner";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { SkillCategoryMutation } from "../../../../util/mutation/skillCategory.mutation";
import { useDispatch } from "react-redux";
import {setNotification} from "../../../../middleware/redux/reducers/notification.reducer";

export const CreateCategoryModal = ({visible, close, refetch})=>{
    const [category, setCategory] = useState("");
    const [disabled, setDisabled] = useState(true);
    
    const [newSkillCategory, {loading}] = useMutation(SkillCategoryMutation);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(category?.length>1){
            setDisabled(false);
        }else{
            setDisabled(true);
        }
    },[category]);

    const handelCategory= async(addingMore) => {
        try{
            setDisabled(true);
            await newSkillCategory({
                variables:{
                    input:{
                        category
                    }
                }
            });

            setCategory("");

            dispatch(setNotification({error:false, notificationState:true, message: "Skill Category was added successfully"}))
            if(!addingMore){
                close();
            }
            setDisabled(false);
            await refetch();

        }catch(err){
            dispatch(setNotification({error:true, notificationState:true, message: err.message}))
        }
    }

    return(
    <Modal
        visible={visible}
        width={600}
        footer={
          <div className='drawer-footer'>
              <button disabled={disabled} className={disabled ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={()=>handelCategory(false)}>
               {loading? <Spinner color={"#ff7a53"}/> : 'Create'} 
              </button>
              <button onClick={()=>handelCategory(true)} disabled={disabled} className={disabled ? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} >
                {loading? <Spinner color={"#ff7a53"}/> : 'Create and add another'} 
              </button>
              <button disabled={loading} className='drawer-outlined-btn' onClick={close}>Cancel</button>
          </div>
        }
        closable={false}
    >

        <div>

            
            <div className='modal-header-title'>
                <span> Add Skill Category </span>
                <span  onClick={close} ><FontAwesomeIcon className='close' icon={faClose}/></span>
            </div>
            
            <div className='modal-body'>

                <Form.Item>
                    <label >Category Name</label><br/>
                    <Input
                        value={category}
                        onChange={(e)=>setCategory(e.target.value)}
                        placeholder="Category"
                        className="generic-input-control"
                    />
                </Form.Item>

            </div>


        </div>

    </Modal>
    )
}