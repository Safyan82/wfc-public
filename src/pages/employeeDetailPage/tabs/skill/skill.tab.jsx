import { Switch, Table } from "antd"
import { SkillModal } from "./addSkillModal";
import { useState } from "react";

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
            title: 'Status',
            dataIndex: 'status',
            key:'status'
        },
        {
            title: 'On/Of',
            dataIndex:'toggle',
            key:'switch'
        }
    ];

    const [visible, setVisible] = useState(false);

    const [selectedSkill, setSelectedSkill] = useState("");

    const handelSkillSwitch = (action, state) => {
       if(state){
        setVisible(true);
        setSelectedSkill(action);
       }
    };

    const dataSource = [
        {
            skill: 'Security guarding',
            category: 'SIA licenses',
            additionalInfo: '',
            status: '',
            toggle: <Switch onChange={(e)=>handelSkillSwitch("Security Guarding", e)}/>
        },
        {
            skill: 'Door supervision',
            category: 'SIA licenses',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'CCTV license',
            category: 'SIA licenses',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'Close protection',
            category: 'SIA licenses',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'SIA Licenced Staff',
            category: 'SIA licenses',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        
        {
            skill: 'HMCT trained',
            category: 'HMCT courts',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'EL1 clearnce',
            category: 'HMPPS',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'Stewarding',
            category: 'HMPPS',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        
        {
            skill: 'Fire warden',
            category: 'Fire warden training',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'First aid',
            category: 'Health & Safety',
            additionalInfo: '',
            status: '',
            toggle: <Switch/>
        },
        {
            skill: 'Mental Health Awareness',
            category: 'Health & Safety',
            additionalInfo: '',
            status: '',
            toggle: <Switch onChange={(e)=>console.log(e)}/>
        },
    ];


    return(
        <div style={{padding:'36px 95px', minHeight:'81vh'}}>

            <div className="tab-header">
                Skills
            </div>

            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{pageSize:11}}
            />

            <SkillModal
                visible={visible}
                onClose={()=>setVisible(false)}
                selectedSkill={selectedSkill}
            />

        </div>
    );

}