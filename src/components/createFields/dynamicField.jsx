import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Modal, Radio, Checkbox, Form, Switch, TreeSelect } from 'antd';
import CheckboxTable from './table';
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faList, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import DraggableTable from '../shuffle/DraggeableTable';
import { useDispatch } from 'react-redux';
import { setLabelValueForField } from '../../middleware/redux/reducers/createField.reducer';
import { useSelector } from 'react-redux';
const { Option } = Select;

const multi=[
    'multiCheckbox',
    'selectDropdown',
    'radioDropdown',
];

const hideinForm = () =>{
    alert();
    const origin = document.querySelector('.ant-drawer');
    const checkBoxes = origin.querySelectorAll('td > button');
    Array.from(checkBoxes).forEach((checkBox)=>{
        checkBox.classList.remove('ant-switch-checked');
    });
};


const showInFrom = () =>{};

export const New = ({selectedKeys, isAnyChecked})=>{
    return(
        <div class='selected-items'>
            <small class='small'> {selectedKeys?.length} selected</small>
            <div class='item' id="showHidebtn" onClick={isAnyChecked ? hideinForm : showInFrom} >
                {isAnyChecked ?<FontAwesomeIcon icon={faEyeSlash}/> :<FontAwesomeIcon style={{marginRight: '4px'}} icon={faEye}/>} 
                <span> {isAnyChecked ? 'Hide in forms' : 'Show in forms'} </span>
            </div>
            <div class='item'>
              {
                <FontAwesomeIcon style={{marginLeft: '10px'}} icon={faTrash}/>
              }
              <span>Delete</span>
            </div>
          </div>
    )
}

export function CreateField({sortType,fieldType,label,search}){
    const [fields, setFields] = useState([]);
    const [singleInput, setSingleInput] = useState([
    'text',
    'multilineText',
    'singlelineNumber',
    'password',
    'number','email','date','time','datetime-local']);
    const [multiInput, setMutiInput] = useState(['multiCheckbox', 'selectDropdown', 'radioDropdown']);

    const [labelValue, setLabelValue] = useState([{id:0}]);
    const [selectedId, setSelectedId] = useState();
    const [visible, setVisible] = useState(false);
    const [inputTypeDefaultValue, setinputTypeDefaultValue] = useState("none");
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
    const dispatch = useDispatch();
    const {propertyToBeEdit} = useSelector(state => state.createFieldReducer);

    useEffect(()=>{
        console.log(propertyToBeEdit, "propertyToBeEditpropertyToBeEdit");
        if(propertyToBeEdit?.options){
            setLabelValue([...propertyToBeEdit.options]);
        }
    },[propertyToBeEdit?.options]);

    useEffect(()=>{
        if(fieldType){
            handelChange(fieldType);
        }
    },[fieldType]);

    // sort values based on the option
    useEffect(()=>{
        if(sortType == "alphabetical"){
            const l = labelValue.sort((a, b) => a?.key?.localeCompare(b?.key));
            setLabelValue(l);
        }
    },[sortType]);


    // search

    useEffect(()=>{
        if(search?.length>0){
            
            setTableData(
                (labelValue?.filter((lv, i)=>( lv?.key?.toLocaleLowerCase().includes(search?.toLocaleLowerCase()))).map((lv,i)=>{
                    return{
                        key: i,
                        label: <Input id={"key"+i} className='generic-input-control' value={lv.key}  placeholder='Enter label' name="key" onChange={(e) => handelValue(e, i)} />,
                        value: <Input className='generic-input-control' value={lv.value} onBlur={sort} placeholder='Enter value' name="value" onChange={(e) => handelValue(e, i)} />,
                        toggle: <Switch defaultChecked  checked={lv.showFormIn} onClick={syncFormVisibility}  onChange={(e) => handelValue(e, i, 'showInForm')}  id={"switch-"+i} />
                    }
                }))
            ); 
        }else{
            setTableData(labelValue?.map((lv, i)=>{
                return{
                    key: i,
                    label: <Input id={"key"+i} className='generic-input-control' value={lv.key}  placeholder='Enter label' name="key" onChange={(e) => handelValue(e, i)} />,
                    value: <Input className='generic-input-control' value={lv.value} onBlur={sort} placeholder='Enter value' name="value" onChange={(e) => handelValue(e, i)} />,
                    toggle: <Switch defaultChecked checked={lv.showFormIn} onClick={syncFormVisibility}  onChange={(e) => handelValue(e, i, 'showInForm')}   id={"switch-"+i} />
                };
            }));
        }
    },[search]);


    const sort = () =>{
        if(sortType == "alphabetical"){
            const l = labelValue.sort((a, b) => a.key.localeCompare(b.key));
            setLabelValue([...l]);
        }
    }



    const handelChange=(e)=>{
        
        const id= new Date().getMilliseconds();
        switch(e){
            case 'singlelineText':
                setFields([{id: new Date().getMilliseconds(), type: 'text', label}]);
                break;
            case 'multilineText':
                setFields([{id: new Date().getMilliseconds(), type: 'multilineText', label}]);
                break;
            case 'email':
                setFields([{id: new Date().getMilliseconds(), type: 'email', label}]);
                
            break;
            case 'phone':
                setFields([{id: new Date().getMilliseconds(), type: 'text', label}]);  
            break;
            case 'password':
                setFields([{id: new Date().getMilliseconds(), type: 'password', label}]);
                
            break;
            case 'number':
                setFields([{id: new Date().getMilliseconds(), type: 'number', label}]);
                
                break;
            case 'date':
                setFields([{id: new Date().getMilliseconds(), type: 'date', label}]);
                
                break;
            case 'time':
                setFields([{id: new Date().getMilliseconds(), type: 'time', label}]);
                
                break;
            case 'datetime-local':
                setFields([{id: new Date().getMilliseconds(), type: 'datetime-local', label}]);
                
                break;

            case 'singleCheckbox':
                setFields([{id, type: 'singleCheckbox' , group:'singleCheckbox' , label}]);
                setSelectedId(id)
                break;
            case 'radioDropdown':
                setFields([{id, type: 'select' , group:'radioDropdown' , label}]);
                setSelectedId(id)
                break;

            case 'selectDropdown':
                setFields([{id, type: 'select', group:'selectDropdown' , label}]);
                setSelectedId(id)
                break;

            case 'multiCheckbox':
                setFields([{id, type: 'select', group:'multiCheckbox' , label}]);
                setSelectedId(id)
                
                break;
                
        }
        setinputTypeDefaultValue("none");
    }

    const [sameKeyId, setSameKeyId] = useState(null);
    // handel all on change value for choice option type from field type

    const handelValue=(e, index, name, BulkOpertion)=>{
        if(BulkOpertion){
            setLabelValue(prevState => labelValue?.map((lv, index)=>{
                if(lv.id==index){
                        return {
                            ...prevState[index],
                            'showFormIn': e,
                        }
                }else{
                    return lv;
                }
            }))
        }else{   
            setLabelValue(labelValue?.map((lv)=>{
                if(lv.id==index){
                    if(e.target?.name=="key" && lv.override!=1){
                        return {
                            ...lv,
                            key: e.target.value,
                            value: e.target.value,
                            showFormIn: true,
                        }

                    }else if(e?.target?.name){

                        return {
                            ...lv,
                            [e.target.name]: e.target.value,
                            override:1
                        }
                    }else{
                        return {
                            ...lv,
                            [name]: e,
                        }
                    }
                }else{
                    return lv;
                }
            }))
        }

        if(e.target?.name=="key"){

                const isLabelExist = labelValue.find((label)=>(label?.key)?.toLocaleLowerCase()==(e.target.value).toLocaleLowerCase())
                const ismsgExist = document.querySelectorAll('.warning-msg');
                const msgs = Array.from(ismsgExist).filter((msg)=> msg.id.split('-')[1]!=isLabelExist?.id && msg.id.split('-')[1]!=index)
                msgs.forEach((msg)=>{
                    msg.remove();
                });

                  // remove outline from input
                const msgsIds = Array.from(ismsgExist).map((msg)=>{
                    if(msg.id.split('-')[1]!=isLabelExist?.id && msg.id.split('-')[1]!=index){
                        return msg.id.split('-')[1];
                    }
                });
                msgsIds.forEach((msgId)=>{
                    document.getElementById('key'+msgId)?.classList.remove('fieldWarning');
                });

                if(isLabelExist?.key){

                    const isPrevSiblingExist = document.getElementById("msg-"+isLabelExist?.id);
                    if(!isPrevSiblingExist){
                        const prevsiblingElement = document.createElement('div');
                        prevsiblingElement.id="msg-"+isLabelExist?.id;
                        prevsiblingElement.style.color="#f2545b";
                        prevsiblingElement.classList.add("warning-msg");
                        prevsiblingElement.textContent = `An option named " ${e.target.value} " already exists.`;
                        const prevsiblingElementField =document.getElementById('key'+isLabelExist?.id);
                        prevsiblingElementField.insertAdjacentElement('afterend', prevsiblingElement)
                        prevsiblingElementField.classList.add('fieldWarning');
                    }
                    const newMsg = document.getElementById("msg-"+index);
                    if(!newMsg){

                        const siblingElement = document.createElement('div');
                        siblingElement.id="msg-"+index;
                        siblingElement.classList.add("warning-msg");
                        siblingElement.style.color="#f2545b";
                        siblingElement.textContent = `An option named " ${e.target.value} " already exists.`;
                        const siblingElementField = document.getElementById('key'+index);
                        siblingElementField.insertAdjacentElement('afterend', siblingElement)
                        siblingElementField.classList.add('fieldWarning');
                    }
                    setSameKeyId(isLabelExist?.id);
                }else{
                    const ismsgExist = document.getElementById('msg-'+index);
                    const ismsgExistField = document.getElementById('key'+index);
                  
                    if(ismsgExist){
                        ismsgExist.remove();
                        ismsgExistField.classList.remove('fieldWarning');
                    }
                    const isPrevmsgExist = document.getElementById('msg-'+sameKeyId);
                    const isPrevmsgExistField = document.getElementById('key'+sameKeyId);
                    
                    if(isPrevmsgExist){
                        isPrevmsgExist.remove();
                        isPrevmsgExistField.classList.remove('fieldWarning');
                    }
                }
        }
        
        
        if(e.target?.name=="value"){

            // remove existing msgs
            const isLabelExist = labelValue.find((label)=>(label?.value)?.toLocaleLowerCase()==(e.target.value).toLocaleLowerCase())
            const ismsgExist = document.querySelectorAll('.warning-val-msg');
            const msgs = Array.from(ismsgExist).filter((msg)=> msg.id.split('-')[2]!=isLabelExist?.id && msg.id.split('-')[2]!=index)
            
            msgs.forEach((msg)=>{
                msg.remove();
            });

            // remove outline from input
            const msgsIds = Array.from(ismsgExist).map((msg)=>{
                if(msg.id.split('-')[2]!=isLabelExist?.id && msg.id.split('-')[1]!=index){
                    return msg.id.split('-')[2];
                }
            });

            msgsIds.forEach((msgId)=>{
                document.getElementById('value'+msgId)?.classList.remove('fieldWarning');
            });

            if(isLabelExist?.key){

                const isPrevSiblingExist = document.getElementById("msg-val-"+isLabelExist?.id);
                if(!isPrevSiblingExist){
                    const prevsiblingElement = document.createElement('div');
                    prevsiblingElement.id="msg-val-"+isLabelExist?.id;
                    prevsiblingElement.style.color="#f2545b";
                    prevsiblingElement.classList.add("warning-val-msg");
                    prevsiblingElement.textContent = `Value named " ${e.target.value} " already exists.`;
                    const prevfield = document.getElementById('value'+isLabelExist?.id);
                    prevfield.insertAdjacentElement('afterend', prevsiblingElement)
                    prevfield.classList.add('fieldWarning');
                }
                const newMsg = document.getElementById("msg-val-"+index);
                if(!newMsg){

                const siblingElement = document.createElement('div');
                siblingElement.id="msg-val-"+index;
                siblingElement.classList.add("warning-val-msg");
                siblingElement.style.color="#f2545b";
                siblingElement.textContent = `Value named " ${e.target.value} " already exists.`;
                const siblingElementField = document.getElementById('value'+index);
                siblingElementField.insertAdjacentElement('afterend', siblingElement);
                siblingElementField.classList.add('fieldWarning')
                }
                setSameKeyId(isLabelExist?.id);
            }else{
                const ismsgExist = document.getElementById('msg-val-'+index);
                const ismsgExistField = document.getElementById('value'+index);
                if(ismsgExist){
                    ismsgExist.remove();
                    ismsgExistField.classList.remove('fieldWarning')
                }
                const isPrevmsgExist = document.getElementById('msg-val-'+sameKeyId);
                const isPrevmsgExistField = document.getElementById('value'+sameKeyId);
                
                if(isPrevmsgExist){
                    isPrevmsgExist.remove();
                    isPrevmsgExistField.classList.remove('fieldWarning');
                }
            }
        }
        
    }

    // check if label exist 
    // const [disableOption, setDisabledOption] = useState(false);
    const checkLabelBlur = (e)=>{
        const isLabelExist = labelValue.filter((label)=>(label?.key)?.toLocaleLowerCase()==(e?.target?.value).toLocaleLowerCase());
        const isValueExist = labelValue.filter((label)=>(label?.value)?.toLocaleLowerCase()==(e?.target?.value).toLocaleLowerCase());
        
        if(isLabelExist?.length>1){
            // setDisabledOption(true);
            e.target.focus();
        }else if(isValueExist?.length>1){
            e.target.focus();
            // setDisabledOption(false);
        }
    }

    const [tableData, setTableData] = useState([]);

    useEffect(()=>{
        
        setTableData(labelValue?.map((lv, i)=>{
            return{
                key: i,
                label: <Input id={"key"+i} className='generic-input-control' value={lv.key} placeholder='Enter label' name="key" onBlur={(e)=>checkLabelBlur(e)} onChange={(e) => handelValue(e, i)} />,
                value: <Input id={"value"+i} className='generic-input-control' value={lv.value} onBlur={(e)=>{sort();checkLabelBlur(e); }} placeholder='Enter value' name="value" onChange={(e) => handelValue(e, i)} />,
                toggle: <Switch defaultChecked onClick={syncFormVisibility} checked={lv.showFormIn} name="showFormIn"  id={"switch-"+i}  onChange={(e) => handelValue(e, i, 'showFormIn')}  />
            }}));

    },[labelValue, sortType]);


    const createOption=()=>{
        setLabelValue([...labelValue, {id:labelValue.length}]);
            setTimeout(()=>{

                const nextField = document.getElementById(`key${(labelValue.length)}`);
                nextField.focus();
            },100)
    }

    // row selection

    const onSelectChange = (selectedKeys) => {
        setSelectedRowKeys(selectedKeys);
    };

    const [isAnyChecked,setisAnyChecked] = useState(null);
    
    const syncFormVisibility =()=>{
        const selected = JSON.parse(sessionStorage.getItem('selectedRowKeys'));
        const origin = document.querySelector('.ant-drawer');
        if(selected.length>0){
          
          setTimeout(()=>{
            const checkBoxes = origin.querySelectorAll('td > button');
            const checkBoxesFiltered =  Array.from(checkBoxes).filter((checkBox)=> selected?.includes(Number(checkBox.id.split("-")[1])));
            if(checkBoxesFiltered?.length){

                const isAnyCheckedLocal = Array.from(checkBoxesFiltered).some((checkbox)=>(Array.from(checkbox?.classList)?.includes("ant-switch-checked")));
            
                setisAnyChecked(isAnyCheckedLocal);
            }
          },1);

        }
    }

    const formFieldDelete = () => {
        setLabelValue(labelValue.filter((lv)=> !selectedRowKeys.includes(lv.id)));
    }

    useEffect(()=>{
        if(labelValue?.length ===0){
            setLabelValue([{id:0}]);
            setSelectedRowKeys([]);
        }
        dispatch(setLabelValueForField(labelValue));

    }, [labelValue]);

    useEffect(()=>{
        sessionStorage.setItem('selectedRowKeys', JSON.stringify(selectedRowKeys));
        syncFormVisibility();
    }, [selectedRowKeys]);


    const hideInForm = ()=>{
        const origin = document.querySelector('.ant-drawer');
        const checkBoxes = origin.querySelectorAll('td > button');
        const checkBoxesFiltered =  Array.from(checkBoxes).filter((checkBox)=> selectedRowKeys?.includes(Number(checkBox.id.split("-")[1])));

        Array.from(checkBoxesFiltered).forEach((checkbox, index)=>{
            checkbox?.classList.remove("ant-switch-checked");
            handelValue(false, index, 'showFormIn', true);

        });
        syncFormVisibility();
    }

    const showInForm = async()=>{
        const origin = document.querySelector('.ant-drawer');
        const checkBoxes = origin.querySelectorAll('td > button');
        const checkBoxesFiltered =  Array.from(checkBoxes).filter((checkBox)=> selectedRowKeys?.includes(Number(checkBox.id.split("-")[1])));
        
        Array.from(checkBoxesFiltered).forEach(async(checkbox,index)=>{
            checkbox?.classList.add("ant-switch-checked");
            await handelValue(true, index, 'showFormIn', true);
        });
        syncFormVisibility();
    }

    // row selection terminates

    const footerContent = ()=>{
        return(

          <div className='table-footer' id="selection-options">
            

            {selectedRowKeys?.length>0 ?
            <>
                <small class='small'> {selectedRowKeys?.length} selected</small>

                <div onClick={createOption} >
                    <FontAwesomeIcon icon={faPlus}/> <span>Add an option</span>
                </div>

                <div>
                    {isAnyChecked ?<FontAwesomeIcon icon={faEyeSlash}/> :<FontAwesomeIcon style={{marginRight: '4px'}} icon={faEye}/>} 
                     {isAnyChecked ? <span onClick={hideInForm}> Hide in forms</span> : <span onClick={showInForm}> Show in forms</span>} 
                </div>

                <div>
                    <FontAwesomeIcon style={{marginLeft: '10px'}} icon={faTrash}/>
                    <span onClick={formFieldDelete}> Delete</span>
                </div>
            </>
          :
          <>
          
            <div onClick={createOption}>
                <FontAwesomeIcon icon={faPlus}/> <span>Add an option</span>
            </div>

            <div>
              <FontAwesomeIcon icon={faList}/> <span>Load options</span>
            </div>

            <div onClick={
                async()=>{
                    await setLabelValue([{id:0}]); 
                    document.getElementById("key0").value=null;
            }}>
              <FontAwesomeIcon icon={faTrash}/> <span>Clear all</span>
            </div>
         </>
        }
          </div>
        )
      }


    return(

        <>
            
            {multi.includes(fieldType) &&  sortType!="custom" &&
                <CheckboxTable tableData={tableData}
                selectedRowKeys={selectedRowKeys}
                onSelectChange={onSelectChange} 
                 footerContent={footerContent} />
            }

            {multi.includes(fieldType) && sortType=="custom" &&
                <DraggableTable tableData={tableData}
                 selectedRowKeys={selectedRowKeys}
                 onSelectChange={onSelectChange} 
                 footerContent={footerContent} 
                />
            }
        
            <Form.Item>
                <label>Preview</label>
                <div className='preview-box'>
                    {fields?.length > 0 &&
                        fields?.map((field)=>{
                            return (
                            <> 
                            {singleInput.includes(field?.type) ? 
                                field?.type=="multilineText" ?
                                
                                <>
                                    <label>{label}</label>
                                    <Input.TextArea rows={4} placeholder={field?.type[0].toLocaleUpperCase() + field?.type?.slice(1)} className='generic-input-control'/> 
                                    
                                </>

                                :
                                <>
                                    <label>{label}</label>
                                    <Input type={field?.type} placeholder={field?.type[0].toLocaleUpperCase() + field?.type?.slice(1)} className='generic-input-control'/> 
                                    
                                </>
                                :
                                field?.type=="singleCheckbox" ?
                                <Select>
                                    <Option value="yes">Yes</Option>
                                    <Option value="no">No</Option>
                                </Select>
                                :
                                field?.type=='select' &&
                                <>
                                    <label>{label}</label>
                                    {field?.group != "multiCheckbox"? 
                                        <Select 
                                            
                                        >
                                            {labelValue && labelValue?.length && labelValue?.map((option)=>(<Option value={option.value}> {option.key} </Option>))}
                                        </Select>
                                    :
                                        <TreeSelect 
                                            showSearch
                                            allowClear
                                            multiple
                                            treeCheckable
                                        >
                                            {labelValue && labelValue?.length && labelValue?.map((option)=>(
                                                option?.value?.length > 0 && option?.showFormIn && <TreeSelect.TreeNode value={option.value} title={option.key}/>
                                            ))}
                                        </TreeSelect>
                                    }
                                </>
                            }
                            
                            </>
                            )
                        })
                    }
                </div>
            </Form.Item>
        </>
    )
}