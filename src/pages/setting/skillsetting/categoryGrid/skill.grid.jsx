import { useMutation, useQuery } from "@apollo/client";
import { Table } from "antd"
import Spinner from "../../../../components/spinner";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faPlus, faTimes, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setNotification } from "../../../../middleware/redux/reducers/notification.reducer";
import { SkillDeleteMutation } from "../../../../util/mutation/skill.mutation";
import { EmployeeSkillQuery } from "../../../../util/query/employeeSkill.query";

export const SkillGrid = ({skill, loading, refetchSkill})=>{
    const columns = [
        {title:'Skill', dataIndex: 'skill'}, 
        // {title:'Description', dataIndex:'description'}, 
        {title:'Category', dataIndex:'categoryName'},
        {title:'Required Fields', dataIndex:'fields'},
        {title:'Created By', dataIndex:'createdBy'},
        {title:'Created At', dataIndex:'createdAt'},
        // {title:'Digital Fields', dataIndex:'digitalFields'},
    ];

    
   


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

    const dispatch = useDispatch();

    const [deleteSkill, {loading:deleteSkillLoading}] = useMutation(SkillDeleteMutation)

    const handelSkillDelete = async()=>{
        try{

            await deleteSkill({
                variables:{
                    deleteSkills:{
                        id: selectedRowKeys?.map((key)=>key.toString())
                    }
                }
            });

            await refetchSkill();
            setSelectedRowKeys([]);

            dispatch(setNotification({
                notificationState: true,
                error: false,
                message: "Skill was Delete Successfully",
            }));

        }catch(err){
            dispatch(setNotification({
                notificationState: true,
                error: true,
                message:err.message
            }));
        }
    }

    
  const customHeader =(

    <div className='table-footer' style={{marginLeft:'-23px', backgroundColor: 'rgb(245, 248, 250)'}} id="selection-options">
      

    {selectedRowKeys?.length>0 &&
      <>
          <small class='small-text'> {selectedRowKeys?.length} selected</small>


          <div onClick={()=>handelSkillDelete()}>
              <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}/> <span>Delete</span>
          </div>

      </>
    }
    </div>
);
    
    return(
        
        <div style={{textAlign:'center', margin:'auto'}}>
            {loading ?
                <Spinner/>
    
                :
    
                <Table
                    title={selectedRowKeys?.length>0 ? () => customHeader : null}
                    className="moveGroupTable"
                    dataSource={skill?.map((data)=>({
                        ...data, 
                        key: data?._id, 
                        fields: data?.fields?.map((field)=>field.label).join(" , "),
                        hardSkill: data?.hardSkill? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> ,
                        anyDate: data?.anyDate? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> ,
                        digitalCertificate: data?.digitalCertificate? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> ,
                    }))}
                    
                    columns={columns}
                    rowSelection={rowSelection}                
                    onRow={(record) => ({
                        onMouseEnter: () => handleRowMouseEnter(record),
                        onMouseLeave: () => handleRowMouseLeave(),
                    })}
                    rowClassName={rowClassName}
                />
            }
        </div>

        
    )
}