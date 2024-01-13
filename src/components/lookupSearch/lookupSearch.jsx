import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "antd";
import { useRef, useState, useEffect } from "react";

export const LookupSearch = ({setSelectedOption, data, selectedOption, title, add, addOnTitle, addPopup, disabled=true})=>{
    
    const [parentWidth, setParentWidth] = useState(null);
    const parentRef = useRef(null);
    const [searchPopover, setSearchPopover] = useState(false);
    
    const popoverRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (!event.target.closest('.group-wrapper')) {
            setSearchPopover(false);
          }
        };
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {

        const updateParentWidth = () => {
          if (parentRef.current) {
            const width = parentRef.current.offsetWidth;
            setParentWidth(width);
          }
        };
    
        // Call the update function on initial mount and window resize
        updateParentWidth();
        window.addEventListener('resize', updateParentWidth);
        inputRef?.current?.focus();
    
        // Clean up the event listener on unmount
        return () => {
          window.removeEventListener('resize', updateParentWidth);
        };
    
    }, [searchPopover]);

    const [localData, setLocalData] = useState([]);

    useEffect(()=>{
        setLocalData(data);
    }, [data, searchPopover]);

    const [keyword, setkeyword] = useState("");


    return (
        <div className="group-wrapper"  style={{width: '500px', margin: 'auto', marginTop: '32px'}}>
            <div
                name="groupInput"
                className='generic-input-control groupInput' 
                title={disabled? "You can not update the selected employee" : ""}
                style={disabled? {cursor:'not-allowed', padding:'0 0px'} : {cursor:'pointer', padding:'0 0px'}}
                onClick={()=> disabled ? null : setSearchPopover(!searchPopover)}
            >
                <div style={{fontSize:'14px', fontWeight: 'normal', margin: '9px', display: 'flex', justifyContent: 'space-between'}}>
                    { Object.keys(selectedOption)?.length<1? title : selectedOption?.label== "undefined undefined" ? title : selectedOption?.label }
                    <span onClick={()=>setSearchPopover(!searchPopover)} 
                        style={{
                            // position: 'absolute',
                            // right: '6px',
                        }} className='caret'></span>
                </div>
            </div>

            <div ref={parentRef} className={searchPopover? 'show': 'hide'} style={{width: '500px', margin: 'auto'}}>
                <div className="moveGroupData" style={{width: parentWidth-1.5, zIndex: 111}} >
                    <div className="popover-search" >
                        <Input type="text" 
                            disabled={disabled}
                            ref={inputRef}
                            name='popoverSearch'
                            style={disabled? { width: '-webkit-fill-available', backgroundColor: 'white', cursor: 'not-allowed'  } : { width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                            className='generic-input-control' 
                            placeholder="Search..."
                            autoFocus={searchPopover}
                            onFocus={()=>setkeyword("")}
                            value={keyword}
                            autoComplete="off"
                            onChange={(e)=> {setLocalData(data?.filter((role)=> (role.label)?.toLowerCase()?.includes(e.target.value?.toLowerCase()))); setkeyword(e.target.value)}}
                            suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                        />
                    </div>

                    <div ref={popoverRef}>
                        <div style={{maxHeight: '145px', overflow:'auto'}}>
                            {localData?.length ? localData?.map((data)=>(
                                <div 
                                    className={"popoverdataitem"} 
                                    onClick={(e)=>{setSelectedOption({label:data.label, _id:data._id}); setSearchPopover(false)}}>
                                    {data.label}
                                </div>
                            )):
                            
                            <div 
                                className={"popoverdataitem"} 
                                style={{cursor:'no-drop'}}
                                onClick={(e)=>{ setSearchPopover(false)}}>
                                No results found
                            </div>
                            }
                        </div>
                        {add?
                            <div className="addViewfooter" onClick={()=>addPopup(true)} style={{cursor: "pointer"}}>
                                <span>{addOnTitle}</span>
                            </div>
                        :
                        null
                        }
                    </div>
                </div>

            </div>      
                             
                  
        </div>
    )
}