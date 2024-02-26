import { Input, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import "./skill.setting.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { CreateCategoryModal } from "./modal/createCategory.modal";
import { CreateSkillModal } from "./modal/createSkill.modal";
import { CategoryGrid } from "./categoryGrid/category.grid";
import { SkillCategoryQuery } from "../../../util/query/skillCategory.query";
import { useQuery } from "@apollo/client";
import { skillQuery } from "../../../util/query/skill.query";
import { SkillGrid } from "./categoryGrid/skill.grid";


export const SkillSetting = ()=>{

    const [search, setSearch] = useState("");
    
    const handelSearch = ()=>{

    };


    const [categoryModal, setCategoryModal] = useState(false);
    const [skillModal, setSkillModal] = useState(false);
    const {data: categoryData, loading:categoryLoading, refetch:refetchCategory} = useQuery(SkillCategoryQuery,{
        fetchPolicy:'network-only'
    });

    const {data: skillData, loading: skillDataLoading, refetch: refetchSkill} = useQuery(skillQuery,{
        fetchPolicy: 'network-only'
    });



    const [skillCategoryToBeEdit, setSkillCategoryToBeEdit] = useState(null);

    useEffect(()=>{
        console.log(skillCategoryToBeEdit, "selectedSkillCategory");
    },[skillCategoryToBeEdit]);

    // category grid selectedRow
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Manage Skills
                        </div>
                    </div>
                    <div className="text">
                        Efficiently track and optimize employee competencies for enhanced productivity and resource allocation.
                    </div>


                    {/* body */}


                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1">


                        <TabPane tab={'Skills'} key="1">
                            <div className="skill-btn-section">
                                    <Input type="text" 
                                        style={{width:'250px'}} 
                                        className='generic-input-control' 
                                        placeholder="Search skill"
                                        onChange={(e)=>setSearch(e.target.value)}
                                        value={search}
                                        autoComplete="off"
                                        suffix={search? 
                                        <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setSearch("")}} icon={faClose}/> : 
                                        <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                                    />
                                    <button className='drawer-filled-btn' onClick={()=>setSkillModal(true)} style={{height:'40px'}}> Create Skill </button>
                            </div>

                            <div className="setting-grid">
                                <SkillGrid
                                    skill={skillData?.getSkills}
                                    loading={skillDataLoading}
                                    refetchSkill={refetchSkill}
                                />
                            </div>

                        </TabPane>



                        <TabPane tab={'Categories'} key="2">

                            <div className="skill-btn-section">
                                    <Input type="text" 
                                        style={{width:'250px'}} 
                                        className='generic-input-control' 
                                        placeholder="Search category"
                                        onChange={(e)=>setSearch(e.target.value)}
                                        value={search}
                                        autoComplete="off"
                                        suffix={search? 
                                        <FontAwesomeIcon style={{color:'#7c98b6', cursor:'pointer', fontSize: '20px'}} onClick={()=>{setSearch("")}} icon={faClose}/> : 
                                        <FontAwesomeIcon style={{color:'#0091ae'}} icon={faSearch}/> }
                                    />
                                    <button className='drawer-filled-btn' onClick={()=>setCategoryModal(true)} style={{height:'40px'}}> Create Category </button>
                            </div>

                            <div className="setting-grid">
                                <CategoryGrid 
                                    categoryData={categoryData}
                                    categoryLoading={categoryLoading}
                                    refetchCategory={refetchCategory}
                                    setCategoryModal={setCategoryModal}
                                    setSkillCategoryToBeEdit={setSkillCategoryToBeEdit}
                                    selectedRowKeys={selectedRowKeys}
                                    setSelectedRowKeys={setSelectedRowKeys}
                                />
                            </div>

                        </TabPane>



                    </Tabs>


                </div> 

                             
            </div>

            <CreateCategoryModal
              refetch={refetchCategory}
              visible={categoryModal}
              close={()=>{setCategoryModal(false); setSkillCategoryToBeEdit(null);}}
              skillCategoryToBeEdit={skillCategoryToBeEdit}
              setSelectedRowKeys={setSelectedRowKeys}
                                            
            />


            <CreateSkillModal
                visible={skillModal}
                categories = {categoryData?.getSkillCategories?.map((category)=>({_id:category?._id, label: category?.category})) || []}
                close={()=>{setSkillModal(false); setSkillCategoryToBeEdit(null);}}
                openSkillCategoryModal={()=>{setCategoryModal(true);}}
                refetchSkill={refetchSkill}
            />


        </div>
    );
}