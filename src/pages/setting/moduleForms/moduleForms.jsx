import { faLock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Select } from "antd"
import { objectType } from "../../../util/types/object.types"
import { useState } from "react"
import { EditForm } from "../../editBranchForm/editForm.page"
import { EditEmployeeForm } from "../../employee/editEmployeeForm/editEmployeeForm"

export const ModuleForms = () =>{

    const [objectTypelocal, setObjectType] = useState("Branch");

    return(
        
        <div className="setting-body">
            <div className="setting-body-inner">
                <div className='setting-body-inner'>
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Module Forms
                        </div>

                        {/* <div className='btn-group'>
                            <button className='btn-transparent'>
                                <FontAwesomeIcon icon={faLock}/> &nbsp; <span className='text-decore'>Data Quality</span>
                            </button>
                            <Button className='setting-filled-btn'>
                                Export all data fields
                            </Button>
                        </div> */}
                    </div>
                    <div className="text">
                        Module forms are used to collect and store information about your records in WorkForce City. For example, a branch might have data fields like Branch Name or Status.
                    </div>
                    {/* object selection box */}
                    <div className="object-selection-box">
                        <div className="objects">

                            <div className='left-selection-box'>
                                <div className='object-item'>
                                    Selected module:
                                </div>
                                <div className="object-item">
                                    <Select
                                        className='custom-select'
                                        style={{width:'250px'}}
                                        suffixIcon={<span className="dropdowncaret"></span>}
                                        defaultValue={"Branch"}
                                        value={objectTypelocal}
                                        onChange={(e)=>setObjectType(e)}
                                        // disabled
                                    >
                                        {
                                            Object.keys(objectType).slice(0,4)?.map((object)=>(

                                                <Select.Option value={objectType[object]}>{objectType[object]}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="right-selection-box"style={{pointer:'not-allowed'}}>
                                <div className='object-item object-text text-decore' >Go to {objectTypelocal} settings</div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    {
                        objectTypelocal=="Branch"?
                            <EditForm/>
                        :
                        objectTypelocal=="Employee"?
                            <EditEmployeeForm/>
                        :null
                    }
                    {/* Body terminated */}

                </div>
            </div>
        </div>
    )
}