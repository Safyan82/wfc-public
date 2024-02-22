import { faAdd, faClose, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, Drawer, Form, Input, Popover } from "antd";
import Spinner from "../../../components/spinner";
import {LookupSearch} from "../../../components/lookupSearch/lookupSearch";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../../../middleware/redux/reducers/notification.reducer";

export const CreateSkillModal = ({visible, close, openSkillCategoryModal, categories})=>{

    const [selectedCategory, setSelectedCategory] = useState({label:'Please select or add new category', _id:''});

    const [description, setDescription] = useState("");
    const [skill, setSkill] = useState("");
    const [anyDate, setDate] = useState(false);
    const [dateFields, setDateFields] = useState([{id:0, label:'', name:''}]);
    const [hardSkill, setHardSkill] = useState(false);

    const [digitalCertificate, setDigitalCertificate] = useState(false);
    const [digitalFields, setDigitalFields] = useState([{id:0, label:'', name:''}]);


    const [disabled, setDisabled] = useState(true);

    // handel btn enable disabled
    useEffect(()=>{
        console.log(skill, selectedCategory, "skill, selectedCategory", skill?.length>0 && selectedCategory?._id);
        if(skill?.length>0 && selectedCategory?._id!==''){
            setDisabled(false);
        }else{
            setDisabled(true);
        }
    },[skill, selectedCategory]);

    // handel to add and update new date fields
    const handelDateFields = (field)=>{
        const isFieldExist = dateFields?.find((f)=>f.id==field.id);
        if(isFieldExist){
            setDateFields(
                dateFields?.map((dateField)=>{
                    if(dateField?.id==field.id){
                        return field;
                    }else{
                        return dateField;
                    }
                })
            )
        }else{
            setDateFields([...dateFields, field]);
        }
    }

    // handel digital fields to add and update new date fields
    const handelDigtalFields = (field)=>{
        const isFieldExist = digitalFields?.find((f)=>f.id==field.id);
        if(isFieldExist){
            setDigitalFields(
                digitalFields?.map((digitalField)=>{
                    if(digitalField?.id==field.id){
                        return field;
                    }else{
                        return digitalField;
                    }
                })
            )
        }else{
            setDigitalFields([...digitalFields, field]);
        }
    };

    const dispatch = useDispatch();

    const handelSubmit = (isAdding)=>{
        const skillInput = {
            category:selectedCategory, skill, description, anyDate, dateFields: anyDate? dateFields: null, digitalCertificate: digitalCertificate? digitalFields: null,
        };

        try{
            
            dispatch(setNotification({
                notificationState:true,
                error:false,
                message: "Skill was added successfully",
            }));
        }
        catch(err){

            dispatch(setNotification({
                notificationState:true,
                error:false,
                message: "An error encountered while adding the skill"+err.message,
            }));
        }
        if(!isAdding){
            close();
        }
    }

    return(
    <Drawer
        title={"Add Skill"}
        placement="right"
        closable={true}
        onClose={close}
        closeIcon={<FontAwesomeIcon icon={faClose} onClick={close} className='close-icon'/>}
        visible={visible}
        width={600}
        
        maskClosable={false}
        mask={false}
        footer={
          <div className='drawer-footer'>
              <button disabled={disabled} className={disabled ? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} onClick={()=>console.log(true)}>
               {false? <Spinner color={"#ff7a53"}/> : 'Create'} 
              </button>
              <button disabled={disabled} className={disabled ? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'} >
                {false? <Spinner color={"#ff7a53"}/> : 'Create and add another'} 
              </button>
              <button disabled={false} className='drawer-outlined-btn' onClick={close}>Cancel</button>
          </div>
        }
    >
        <div>
            <Form.Item className="mb32">
                <label>Category</label>

                <LookupSearch
                    
                    setSelectedOption={setSelectedCategory}
                    selectedOption={selectedCategory}
                    title={"Select or add a skill category"}
                    add
                    disabled={false}
                    addOnTitle={"Create a new category"}
                    addPopup={()=>openSkillCategoryModal(true)}
                    data={categories}
                
                />
                
            </Form.Item>

            <Form.Item className="mb32">
                <label>Skill Name</label>
                <Input
                    value={skill}
                    onChange={(e)=>setSkill(e.target.value)}
                    placeholder="Skill Name"
                    className="generic-input-control"
                />
            </Form.Item>

            <Form.Item className="mb32">
                <label>Description</label>
                <Input.TextArea
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    placeholder="Description"
                    className="generic-input-control"
                />
            </Form.Item>

            <Form.Item className="mb32">
                <Checkbox onChange={(e)=>setHardSkill(e.target.checked)}> Hard Skill </Checkbox>
            </Form.Item>

            {/* Date Field Start */}
            
            <Form.Item className="mb32">
                <Checkbox onChange={(e)=>setDate(e.target.checked)}> Date Field </Checkbox>
            </Form.Item>

            {anyDate?
            <div style={{padding:'0 16px'}}>
                {dateFields?.map((field, index)=>(

                    <Form.Item>
                        <Input className="generic-input-control" placeholder="Date field label e.g; Issue date, Expiry date" value={field.label}  onChange={(e)=>handelDateFields({id:index, label:e.target.value, name:e.target.value.toLowerCase().replace(/\s/g, '')})}/>
                    </Form.Item>
                ))}
                
                
                <Form.Item className="mb32" onClick={()=>setDateFields([...dateFields, {id:dateFields?.length, label:'', name:''}])}>
                    
                    <FontAwesomeIcon icon={faAdd} /> <span className="otherOption">Add another date field</span>
                    
                </Form.Item>
            </div>
            :null}

            {/* Date Fields end */}

            {/* digital certificate start */}

            <Form.Item className="mb32">
                <Checkbox onChange={(e)=>setDigitalCertificate(e.target.checked)}> Digital Certificate/ License/ Badge </Checkbox>
            </Form.Item>
            
            {digitalCertificate?
            <div style={{padding:'0 16px'}}>
                {digitalFields?.map((field, index)=>(

                    <Form.Item>
                        <Input className="generic-input-control" placeholder="Digital Certificate/ License/ Badge field label" value={field.label}  onChange={(e)=>handelDigtalFields({id:index, label:e.target.value, name:e.target.value.toLowerCase().replace(/\s/g, '')})}/>
                    </Form.Item>
                ))}
                
                
                <Form.Item className="mb32" onClick={()=>setDigitalFields([...digitalFields, {id:digitalFields?.length, label:'', name:''}])}>
                    
                    <FontAwesomeIcon icon={faAdd} /> <span className="otherOption">Add another field</span>
                    
                </Form.Item>
            </div>
            :null}

            {/* digital certificate end */}
            
        </div>

    </Drawer>
    )
}