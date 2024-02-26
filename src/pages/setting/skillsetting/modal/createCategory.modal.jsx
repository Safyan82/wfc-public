import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, Form, Input, Modal } from "antd";
import Spinner from "../../../../components/spinner";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { SkillCategoryMutation, UpdateSkillCategoryMutation } from "../../../../util/mutation/skillCategory.mutation";
import { useDispatch } from "react-redux";
import {setNotification} from "../../../../middleware/redux/reducers/notification.reducer";

export const CreateCategoryModal = ({visible, close, refetch, skillCategoryToBeEdit, setSelectedRowKeys})=>{
    const [category, setCategory] = useState("");
    const [disabled, setDisabled] = useState(true);

    useEffect(()=>{
        if(skillCategoryToBeEdit && Object.keys(skillCategoryToBeEdit)?.length>0){
            setCategory(skillCategoryToBeEdit?.category);
            setDisabled(true);
        }else{
            setCategory("");
        }
    },[skillCategoryToBeEdit]);
    
    // create mutation
    const [newSkillCategory, {loading}] = useMutation(SkillCategoryMutation);
    // update mutation
    const [updateSkillCategory,{loading: updateSkillLoading}]  = useMutation(UpdateSkillCategoryMutation);

    const dispatch = useDispatch();

    useEffect(()=>{
        if(category?.length>1){
            if(skillCategoryToBeEdit?.hasOwnProperty('_id')){
                if(skillCategoryToBeEdit?.category!==category){
                    setDisabled(false);
                    return
                }
            }
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

    const updateCategory= async(addingMore) => {
        try{
            setDisabled(true);
            await updateSkillCategory({
                variables:{
                    input:{
                        _id: skillCategoryToBeEdit?._id,
                        category
                    }
                }
            });

            setCategory("");
            setSelectedRowKeys([]);
            
            dispatch(setNotification({error:false, notificationState:true, message: "Skill Category was updated successfully"}))
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
              <button disabled={disabled} className={disabled ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={()=> skillCategoryToBeEdit?.hasOwnProperty('_id')? updateCategory(false) :handelCategory(false)}>
               {loading? <Spinner color={"#ff7a53"}/> : skillCategoryToBeEdit?.hasOwnProperty('_id')? 'Update ':'Create'} 
              </button>
              {
                skillCategoryToBeEdit?.hasOwnProperty('_id')? null :
                <button onClick={()=>handelCategory(true)} disabled={disabled} className={disabled ? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} >
                    {loading? <Spinner color={"#ff7a53"}/> : 'Create and add another'} 
                </button>
               }
              <button disabled={loading} className='drawer-outlined-btn' onClick={close}>Cancel</button>
          </div>
        }
        closable={false}
    >

        <div>

            
            <div className='modal-header-title'>
                <span> {skillCategoryToBeEdit?.hasOwnProperty('_id')?'Edit ': 'Add '} Skill Category </span>
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