import "../tab.css";
import { useQuery } from "@apollo/client";
import { GROUPLIST } from "../../../../util/query/group.query";
import { useEffect, useState } from "react";
import { GenerateFields } from "../../../../util/generateFields/generateFields";
import { countries } from "../../../../util/datalist/countries";
import { setNotification } from "../../../../middleware/redux/reducers/notification.reducer";
import { useDispatch } from "react-redux";
import { ImplementedGroupList } from "../../../../util/types/groups";
import { moduleTabs } from "../../../../util/tabs/employee.tab";

export const AbsenseTab = ()=>{

    const {data, loading} = useQuery(GROUPLIST ,{
        variables:{
            objectType: 'Employee'
        },
        fetchPolicy:'network-only'
    });

    // these are the filtered group in which current tab is included.
    const [filteredGroup, setFilteredGroup] = useState([]);

    // this is the selected group from the left sidebar where the filtered grps are listed
    const [selectedGrp, setSelectedGrp] = useState("");

    // this is the clicked selected grp props that need to be render here
    const [selectedGroupProp, setSelectedGroupProp] = useState([]);

    useEffect(()=>{
        if(data?.groupList){
            const {groupList} = data;
            setFilteredGroup(groupList?.filter((list)=>list?.tabs?.includes(moduleTabs.Employee[3])))

        }
    },[data]);

    useEffect(()=>{
        if(filteredGroup){
            setSelectedGrp(filteredGroup[0]?.name);
        }
    },[filteredGroup]);


    useEffect(()=>{
        if(selectedGrp){
            const props = filteredGroup?.find((grp)=> grp.name==selectedGrp)

            setSelectedGroupProp(props?.propertyList);

        }
    },[selectedGrp])

    const [field, setField] = useState([]);

    const handelDataValue = ({name, value})=>{
        if(name){
            if(value){
                const isExist = field?.find((f)=>f.name==name);
                if(isExist){
                    setField(field?.map((f)=>{
                        if(f.name==name){
                            return {
                                ...f,
                                value
                            }
                        }else{
                            return f;
                        }
                    }))
                }else{
                    setField([...field, {name, value}])
                }
            }else{
                setField(field?.filter(f=>f.name!==name));
            }
        }
    }

    const [countryList, setCountryList] = useState();

    useEffect(()=>{
        setCountryList(
            countries?.map((c, i)=>({
                id: i,
                key: c,
                value: c,
                showFormIn: true
            }))
        );
    }, [countries]);

    const dispatch = useDispatch();

    return(
        <>
            <div className="tab-body">

                <div className="tab-grp">
                    <div className="tab-header">
                        Absense Details
                    </div>


                    {filteredGroup?.map((group)=>(
                        <li onClick={()=>setSelectedGrp(group?.name)} className={selectedGrp===group?.name? "activeTab" : ""}>{group?.name}</li>
                    ))}
                </div>


                
                <div className="hr-section">
                        <div className="hr-info">
                            <h3> {selectedGrp} </h3>
                            {
                                selectedGroupProp?.map((prop)=> {
                                    const label = prop?.label;
                                    const name = prop?.label.toLowerCase().replace(/\s/g,"");
                                    const fieldType = prop?.fieldType;
                                    const newprop = name=="nationality"? {...prop, options: countryList} : prop;
                                    const {value} = field?.find((f)=>f.name==name) || {value: ""};
                                    return GenerateFields(label, name, fieldType, handelDataValue, newprop, value);
                                })
                            }
                        </div>

                    
                </div>

                
            </div>


            {/* control btn */}
            {
                field?.length>0?
                    <div className='hr-action-footer'>

                        <button className={'drawer-filled-btn'} onClick={()=>{dispatch(setNotification({error:true, notificationState: true, message: "Apologize we are not currently handling this data !"})); setField([])}} >Save</button>
                        <button onClick={()=>setField([])} className={'drawer-outlined-btn'} >Cancel</button>
                    
                        <span className='text' style={{margin: 0}}>You've changed {field?.length} properties</span>
                        
                    </div>
                :null
            }
        </>
        
    );
};