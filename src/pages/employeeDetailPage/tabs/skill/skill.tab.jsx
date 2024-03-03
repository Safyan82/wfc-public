import { Image, Modal, Popover, Switch, Table, Tabs } from "antd"
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
import TabPane from "antd/es/tabs/TabPane";

function truncateText(text, maxWords) {
    // Split the text into an array of words
    const words = text?.split(' ');
  
    if(words && words[0]?.length >15){maxWords=1}

    // If the number of words is less than or equal to the maximum allowed, return the original text
    if (words?.length <= maxWords) {
      return text;
    }
  
    // Otherwise, join the first "maxWords" words and add ellipsis at the end
    return words?.slice(0, maxWords).join(' ') + '...';
}

export const SkillTab = ()=>{
    const columns = [
        {
            title: 'Skill',
            dataIndex: 'skill',
            key: 'skill',
            width:400,
            render: (_, record) => {
                const showActions = hoveredRow === record.key;
                return (          
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    
                    <div className='record-title' style={{width:'fit-content'}}>{showActions?truncateText(record.skill,3):truncateText(record.skill,4)}</div>
                    
                    {showActions && selectedRowKeys?.length===0 &&
                    
                    <div style={{display:'flex', alignItems:'center', columnGap:'10px'}}>
                    
                        <button  className={"grid-sm-btn"} type="link" onClick={()=>{setVisible(true);setSkillToBeEdit(employeeSkill?.getEmployeeSkill?.response?.find((skill)=>skill?._id==record?.key))}}>
                            Replace
                        </button>
                        
                        <button className={"grid-sm-btn"}  type="link" onClick={() => {}}>
                            Archive
                        </button>
            
            
                    </div>

                    }

                    
                </div>

                );
              },
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'cat'
        },
        {
            title: 'Description',
            dataIndex: 'additionalInfo',
            key:'info'
        },
        {
            title: 'Issue Date',
            dataIndex: 'issueDate',
            key:'info'
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
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
                    issueDate: empSkill?.fields?.find((field)=> field?.label?.toLowerCase()?.includes('issue') || field?.label?.toLowerCase()?.includes('issuance') || field?.label?.toLowerCase()?.includes('issued') )?.value || "--",
                    expiryDate: empSkill?.fields?.find((field)=> field?.label?.toLowerCase()?.includes('expiry') || field?.label?.toLowerCase()?.includes('expired') || field?.label?.toLowerCase()?.includes('renewal')  || field?.label?.toLowerCase()?.includes('renewal'))?.value || "--",
                    additionalInfo: <table style={{textAlign:'left',}}>

                                        <tr>                                            
                                            {empSkill?.fields?.filter((field)=>(
                                                !field?.label?.toLowerCase()?.includes('issue') && !field?.label?.toLowerCase()?.includes('issuance') && !field?.label?.toLowerCase()?.includes('issued') && !field?.label?.toLowerCase()?.includes('expiry') && !field?.label?.toLowerCase()?.includes('expired') && !field?.label?.toLowerCase()?.includes('renewal')  && !field?.label?.toLowerCase()?.includes('renewal')
                                            )).map((field)=>
                                                <td style={{textAlign:'left', width:'50px'}}> 
                                                    {field?.imgbas64?.length>0?
                                                    //  <Image src={field?.imgbas64} width={50} height={30} /> 
                                                    null
                                                    : 
                                                    <Popover
                                                        content={field?.label}
                                                    >
                                                        {field?.value || "--"} 
                                                    </Popover>
                                                    } 
                                                </td>
                                            )}
                                        </tr>
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
                    /> <span>Archive</span>
                </span>

                {/* {selectedRowKeys?.length==1?
                 <span onClick={()=>{setVisible(true);setSkillToBeEdit(employeeSkill?.getEmployeeSkill?.response?.find((skill)=>skill?._id==selectedRowKeys[0]))}}> <FontAwesomeIcon icon={faPencil} style={{marginRight:'5px'}}/> <span>Edit</span> </span>
                :null} */}
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
                <div className="setting-body-inner">
                    {/* <div className="propertyTab"></div> */}
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={`Skill`} key="1">
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
                        </TabPane>

                        <TabPane tab={"Skills Group"} key="2">

                        </TabPane>

                        <TabPane tab={"Archived Skills"} key={"3"}>

                        </TabPane>
                    </Tabs>
                </div>

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