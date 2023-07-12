import { Input } from "antd"

export const PopoverSearch = ()=>{
    return(
        <Input type="text" 
                    name="popoverSearch"
                    id={"popoverSearch"} 
                    style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                    className='generic-input-control' 
                    placeholder="Search..."
                    autoFocus={true}
                    // onChange={(e)=> setLocalGroup(groupList?.filter((group)=> (group.name)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                    // suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                />
    )
}