import { Input, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import "./skill.setting.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { CreateCategoryModal } from "./modal/createCategory.modal";
import { CreateSkillModal } from "./modal/createSkill.modal";
import { CategoryGrid } from "./categoryGrid/category.grid";
import { SkillCategoryQuery } from "../../util/query/skillCategory.query";
import { useQuery } from "@apollo/client";


export const SkillSetting = ()=>{

    const [search, setSearch] = useState("");
    
    const handelSearch = ()=>{

    };


    const [categoryModal, setCategoryModal] = useState(false);
    const [skillModal, setSkillModal] = useState(false);
    const {data: categoryData, loading:categoryLoading, refetch:refetchCategory} = useQuery(SkillCategoryQuery,{
        fetchPolicy:'network-only'
    });



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
                                />
                            </div>

                        </TabPane>



                    </Tabs>


                </div> 

                             
            </div>

            <CreateCategoryModal
              refetch={refetchCategory}
              visible={categoryModal}
              close={()=>setCategoryModal(false)}
                                            
            />


            <CreateSkillModal
                visible={skillModal}
                categories = {categoryData?.getSkillCategories?.map((category)=>({_id:category?._id, label: category?.category})) || []}
                close={()=>setSkillModal(false)}
                openSkillCategoryModal={()=>{setCategoryModal(true);}}
            />


        </div>
    );
}