import { LoadingOutlined } from "@ant-design/icons"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Form, Modal, Select, Spin } from "antd"
import { useMutation, useQuery } from "@apollo/client"
import {skillQuery} from "@src/util/query/skill.query.js"
import { useEffect, useState } from "react"
import "./skill.css";
import { GenerateFields } from "../../../../util/generateFields/generateFields"
import { EmployeeeSkillMutation, UpdateEmployeeSkillMutation } from "../../../../util/mutation/employeeSkill.mutation"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setNotification } from "../../../../middleware/redux/reducers/notification.reducer"
import { useParams } from "react-router-dom"

export const SkillModal = ({visible, onClose, refetchSkill, skillToBeEdit, setSelectedRowKeys})=>{
        
    
    // skill query  
    const {data: skillData, loading: skillDataLoading, refetch: skillRefetch} = useQuery(skillQuery,{
        fetchPolicy: 'network-only'
    });

    
    const [skill, setSkill] = useState({});
    const [field, setField] = useState([]);
   
    // set useEffect for skill edit

    useEffect(()=>{
        if(skillToBeEdit?.skillDetail?.length>0){
            setSkill(JSON.stringify(skillToBeEdit?.skillDetail[0]));
            console.log(JSON.stringify(skillToBeEdit?.skillDetail[0]), "skillToBeEdit?.skillDetail[0]");
            setField([...skillToBeEdit?.fields])
            console.log(skillToBeEdit?.fields, "editfield")
        }
    },[skillToBeEdit]);

    


    const handelDataValue = (event, label, fieldType=false)=>{
        const {name, value} = event;
        if(name && fieldType){

            const file = event?.files?.length>0 ? event?.files[0] : false;
            
            if(value || file){
                const isExist = field?.find((f)=>f.name==name);
                if(isExist){
                    setField(field?.map((f)=>{
                        if(f.name==name){
                            return {
                                ...f,
                                value,
                                label,
                                imgbas64: file,

                            }
                        }else{
                            return f;
                        }
                    }))
                }else{
                    setField([...field, {
                        name, 
                        value, 
                        label,
                        imgbas64: file || "",
                    }])
                }

            }else{
                setField(field?.filter(f=>f.name!==name));
            }
        }
        else if(name){
            
            if(value){
                const isExist = field?.find((f)=>f.name==name);
                if(isExist){
                    setField(field?.map((f)=>{
                        if(f.name==name){
                            return {
                                ...f,
                                value,
                                label,

                            }
                        }else{
                            return f;
                        }
                    }))
                }else{
                    setField([...field, {
                        name, 
                        value, 
                        label,
                    }])
                }
            }else{
                setField(field?.filter(f=>f.name!==name));
            }
        }
    }

    const [isBtnDisabled, setBtnDisabled] = useState(true);

    useEffect(()=>{
        console.log(skill, "fff");
        if(skill && Object.keys(skill)?.length>0){
            if(JSON.parse(skill)?.fields?.length === field?.length){
                setBtnDisabled(false);
            }else{
                setBtnDisabled(true)
            }  
        }
    },[field,skill]);

    const dispatch = useDispatch();

    // console.log(authenticatedUserDetail?.employeeId, "authenticatedUserDetail")
    const [newEmployeeSkill, {loading:newEmpSkillLoading }] = useMutation(EmployeeeSkillMutation)
    const [updateEmpSkill, {loading:updateEmpSkillLoading}] = useMutation(UpdateEmployeeSkillMutation);

    const param = useParams();

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                // The result will be a Base64-encoded string
                resolve(reader.result);
            };
    
            reader.onerror = (error) => {
                reject(error);
            };
    
            reader.readAsDataURL(file);
        });
    }

    const handelEmployeeSkill = async()=>{
        try{
            const skillDetail = JSON.parse(skill);
            const updatedField = await Promise.all(field?.map(async (f)=>{
                if (f.imgbas64) {
                    console.log(f.imgbas64?.name, "64", f.imgbas64)
                    return {
                        ...f,
                        imgbas64: f.imgbas64?.name?   await readFileAsBase64(f.imgbas64) :f.imgbas64 ,
                    }
                }else{
                    return f;
                }
            }));

            if(skillToBeEdit?.skillDetail?.length>0){
                
                await updateEmpSkill({
                    variables:{
                        input:{
                            _id: skillToBeEdit?._id,
                            employeeId: param?.id,
                            skill: skillDetail?._id,
                            categoryId: skillDetail?.categoryId,
                            fields: updatedField
                        }
                    }
                });
                dispatch(setNotification({
                    notificationState: true,
                    error:false,
                    message:"Skill was updated successfully",
                }));
                setSelectedRowKeys([]);
            }else{

                await newEmployeeSkill({
                    variables:{
                        input:{
                            employeeId: param?.id,
                            skill: skillDetail?._id,
                            categoryId: skillDetail?.categoryId,
                            fields: updatedField
                        }
                    }
                });
                dispatch(setNotification({
                    notificationState: true,
                    error:false,
                    message:"Skill was added successfully",
                }))
            }
            await refetchSkill();
            onClose();
        }catch(err){
            dispatch(setNotification({
                notificationState: true,
                error: true,
                message:err.message
            }))
        }
    }

    return(
        <Modal
            open={visible}
            width={600}
            footer={
            <div style={{padding:'6px 40px', paddingBottom:'16px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
                <button  
                    onClick={isBtnDisabled? console.warn("not-allowed") :handelEmployeeSkill}
                    className={newEmpSkillLoading || updateEmpSkillLoading || isBtnDisabled?'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                >
                    {newEmpSkillLoading || updateEmpSkillLoading? <Spin indicator={<LoadingOutlined/>}/> : skillToBeEdit?.skillDetail?.length>0? "Replace" :"Save"}
                </button>
                <button  disabled={newEmpSkillLoading || updateEmpSkillLoading} className={newEmpSkillLoading || updateEmpSkillLoading ? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{onClose();setSkill({})}}>
                    Cancel
                </button>
            </div>
            }
            closable={false}
        >

            <>

                <div className='modal-header-title'>
                    <span style={{letterSpacing:'0.2px'}}> {skillToBeEdit?.skillDetail?.length>0? "Replace ": "Add New "}  Skill</span>
                    <span  onClick={()=>{onClose();setSkill({})}}><FontAwesomeIcon className='close' icon={faClose}/></span>
                </div>
                
                <div className='modal-body'>

                    {/* modal  */}
                    <div className="skillSelect">
                        <Form.Item>
                            <label>Skill</label>
                            <Select
                                placeholder="Select Skill to be add"
                                showSearch
                                className="custom-select"
                                value={skillToBeEdit?.skillDetail?.length>0? skillToBeEdit?.skillDetail[0]?.skill : skill?.length>0?JSON.parse(skill)?.skill:null}
                                onChange={e=>setSkill(e)}
                                disabled={skillToBeEdit?.skillDetail?.length>0}
                            >
                                {skillData?.getSkills?.map((sk)=>(
                                    <Select.Option value={JSON.stringify(sk)}>{sk.skill}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        
                        {
                            skill && Object.keys(skill)?.length>0 ? JSON.parse(skill)?.fields?.map((prop)=> {
                                
                                const label = prop?.label;
                                const name = prop?.label.toLowerCase().replace(/\s/g,"");
                                const fieldType = prop?.fieldType;
                                // const newprop = name=="nationality"? {...prop, options: countryList} : prop;
                                // const {value, imgbas64} = field?.find((f)=>f.name==name) || {value: "", imgbas64: ""};
                                const {value, imgbas64} = {value: "", imgbas64: ""};
                               
                                return GenerateFields(label, name, fieldType, handelDataValue, prop, value, imgbas64);
                            })
                            : null
                        }

                    </div>

                </div>

            </>

        </Modal>
    )
}