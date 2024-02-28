import { Image, Modal, Switch, Table } from "antd"
import { SkillModal } from "./addSkillModal";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EmployeeSkillQuery } from "@src/util/query/employeeSkill.query";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTimes, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { DeleteEmployeeSkillMutation } from "@src/util/mutation/employeeSkill.mutation";
import { useDispatch } from "react-redux";
import { setNotification } from "@src/middleware/redux/reducers/notification.reducer";
import Spinner from "@src/components/spinner";

export const SkillTab = ()=>{
    const columns = [
        {
            title: 'Skill',
            dataIndex: 'skill',
            key: 'skill',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'cat'
        },
        {
            title: 'Additional Information',
            dataIndex: 'additionalInfo',
            key:'info'
        },
        {
            title: 'Live Status',
            dataIndex: 'status',
            key:'info'
        }
    ];

    const [visible, setVisible] = useState(false);

    const [selectedSkill, setSelectedSkill] = useState("");


    const param = useParams();

    const {data:employeeSkill, loading:employeeSkillLoading, refetch: refetchSkill} = useQuery(EmployeeSkillQuery,{
        variables:{
            employeeId: param?.id
        },
        fetchPolicy:'network-only'
    });

    const [data, setData] = useState([]);

    useEffect(()=>{
        console.log(employeeSkill?.getEmployeeSkill?.response, "skill");
        if(employeeSkill?.getEmployeeSkill?.response){
            setData(employeeSkill?.getEmployeeSkill?.response?.map((empSkill)=>{
                return {
                    key: empSkill?._id,
                    skill: empSkill?.skillDetail[0]?.skill,
                    category: empSkill?.categoryDetail[0]?.category,
                    additionalInfo: <table style={{textAlign:'left'}}>
                                        {empSkill?.fields?.map((field)=>(
                                        <tr style={{height:'50px'}}>
                                            <th style={{width:'40%'}}>{field?.label}</th>
                                            <td style={{textAlign:'left'}}> {field?.imgbas64?.length>0? <Image src={field?.imgbas64} width={50} height={30} /> : field?.value} </td>
                                        </tr>
                                        ))}
                                    </table>,
                    status: <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        {empSkill?.categoryDetail[0]?.category==="Licence" || empSkill?.categoryDetail[0]?.category==="License"?
                            <><div style={{height: '15px', width: '15px', background: 'rgb(0, 189, 165)', borderRadius: '50%'}}></div> <a href="#">Check Live Status</a></>
                            : "--"
                        }
                    </div>,
                }
            }))
        }
    },[employeeSkill?.getEmployeeSkill?.response]);

    
    const [hoveredRow, setHoveredRow] = useState(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const rowClassName = (record) => {
        return record.key === hoveredRow ? 'hovered-row' : '';
    };
    
    const handleRowMouseEnter = (record) => {
        setHoveredRow(record.key);
        console.log(record.key);
    };


    const handleRowMouseLeave = () => {
        setHoveredRow(null);
    };


    const [deleteEmpSkill, {loading:deleteEmpSkillLoading}] = useMutation(DeleteEmployeeSkillMutation);
    
    const dispatch = useDispatch();

    const deleteSkill = async ()=>{
        try{
            await deleteEmpSkill({
                variables:{
                    input:{
                        id: selectedRowKeys
                    }
                }
            });
            dispatch(setNotification({
                notificationState: true,
                error:false,
                message:"Skill was removed successfully",
            }));
            await refetchSkill();
            setSelectedRowKeys([]);
        }
        catch(err){
            dispatch(setNotification({
                notificationState: true,
                error: true,
                message: err.message
            }))
        }
    }

    const [skillToBeEdit, setSkillToBeEdit] = useState({});

    
    const customHeader =(

        <div className='table-footer' style={{marginLeft:'-30px', backgroundColor: 'rgb(245, 248, 250)'}} id="selection-options">
        

        {selectedRowKeys?.length>0 &&
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            <small class='small-text'> {selectedRowKeys?.length} selected</small>


            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                    
                <span onClick={deleteSkill}>
                    <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}
                    /> <span>Delete</span>
                </span>

                {selectedRowKeys?.length==1?
                 <span onClick={()=>{setVisible(true);setSkillToBeEdit(employeeSkill?.getEmployeeSkill?.response?.find((skill)=>skill?._id==selectedRowKeys[0]))}}> <FontAwesomeIcon icon={faPencil} style={{marginRight:'5px'}}/> <span>Edit</span> </span>
                :null}
            </div>

        </div>
        }
        </div>
    );
    


    return(
        <div style={{padding:'36px 95px', minHeight:'81vh'}}>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
                <div className="tab-header">
                    Skills
                </div> 
                <button className="drawer-filled-btn" onClick={()=>{setVisible(true);setSkillToBeEdit({})}}>Add New Skill</button>
            </div>
            {
                employeeSkillLoading?
                <div style={{display:'table',margin:'auto'}}>
                    <Spinner/>
                </div>

                :

                <Table
                    title={selectedRowKeys?.length>0 ? () => customHeader : null}
                    className="moveGroupTable"
                    dataSource={data}
                    columns={columns}
                    pagination={{pageSize:11}}
                    rowSelection={rowSelection}                
                    onRow={(record) => ({
                        onMouseEnter: () => handleRowMouseEnter(record),
                        onMouseLeave: () => handleRowMouseLeave(),
                    })}
                    rowClassName={rowClassName}
                />
            }

            {visible?
            <SkillModal
                visible={visible}
                onClose={()=>setVisible(false)}
                selectedSkill={selectedSkill}
                setSelectedRowKeys={setSelectedRowKeys}
                refetchSkill={refetchSkill}
                skillToBeEdit={skillToBeEdit}
            />
            :null}


        </div>
    );

}