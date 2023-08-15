import React, { useEffect, useState, useRef } from "react";
import { CaretDownFilled, SaveFilled } from "@ant-design/icons";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Popover } from "antd";
const createdDateList = [
    {
        title: 'Today',
        subtitle: 'Today from midnight until the current time',
    },
    {
        title: 'Yesterday',
        subtitle: 'The previous 24 hours day',
    },
    {
        title: 'Tomorrow',
        subtitle: 'The next 24 hours day',
    },
    {
        title: 'This week',
        subtitle: 'The current calendar week',
    },
    {
        title: 'This week so far',
        subtitle: 'The current calendar week up to now',
    },
    {
        title: 'Last Week',
        subtitle: 'The previous calendar week',
    },
    {
        title: 'Next Week',
        subtitle: 'The next calendar week',
    },
    {
        title: 'This month',
        subtitle: 'The current calendar month',
    },
    {
        title: 'This month so far',
        subtitle: 'The current calendar month up to now',
    },
    {
        title: 'Last month',
        subtitle: 'The previous calendar month up to now',
    },
    {
        title: 'Next month',
        subtitle: 'The next calendar month',
    },
    {
        title: 'This quarter',
        subtitle: 'The current quarter',
    },
    {
        title: 'This fiscal quarter',
        subtitle: 'The current fiscal quarter',
    },
    {
        title: 'This quarter so far',
        subtitle: 'The current quarter up to now',
    },
    {
        title: 'This fiscal quarter so far',
        subtitle: 'The current fiscal quarter up to now',
    },
    {
        title: 'Last quarter',
        subtitle: 'The previous full quarter',
    },
    {
        title: 'Last fiscal quarter',
        subtitle: 'The previous full fiscal quarter',
    },
    {
        title: 'Next quarter',
        subtitle: 'The next full quarter',
    },
    {
        title: 'Next fiscal quarter',
        subtitle: 'The next full fiscal quarter',
    },
    {
        title: 'This year',
        subtitle: 'The current calendar year',
    },
    {
        title: 'This fiscal year',
        subtitle: 'The current fiscal year',
    },
    {
        title: 'This year so far',
        subtitle: 'The current calendar year up to now',
    },
    {
        title: 'This fiscal year so far',
        subtitle: 'The current fiscal year up to now',
    },
    {
        title: 'Last year',
        subtitle: 'The previous calendar year',
    },
    {
        title: 'Last fiscal year',
        subtitle: 'The previous fiscal year',
    },
    {
        title: 'Last 7 days',
        subtitle: 'The previous 7 days before today',
    },
    {
        title: 'Last 14 days',
        subtitle: 'The previous 14 days before today',
    },
    {
        title: 'Last 30 days',
        subtitle: 'The previous 30 days before today',
    },
    {
        title: 'Last 60 days',
        subtitle: 'The previous 60 days before today',
    },
    {
        title: 'Last 90 days',
        subtitle: 'The previous 90 days before today',
    },
    {
        title: 'Last 180 days',
        subtitle: 'The previous 180 days before today',
    },
    {
        title: 'Last 365 days',
        subtitle: 'The previous 365 days before today',
    },
]

export const GridFilter = ({openAdvanceFilter})=>{
    const [createdDate, setCreatedDate] = useState([...createdDateList]);
    const [createdDateSearch, setCreatedDateSearch] = useState();
    const [createdDatePop, setCreatedDatePop] = useState();
    const [createdDateFilter, setCreatedDateFilter] = useState();

    const [activityProp, setactivityProp] = useState(false);
    const [activityDateFilter, setActivityDateFilter] = useState();
    const [activityDateList, setActivityDateList] = useState([...createdDateList]);
    const [activityDateSearch, setActivityDateSearch] = useState();

    const popoverRef = useRef(null);
    const inputRef = useRef(null);


    useEffect(() => {
        // Function to handle clicks outside the box
        const handleClickOutside = (event) => {
          if(event.target.name==="popoverSearch" || event.target.name==="popoverCheckboxes"){ return; }
          if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            // Perform your desired action here
            setCreatedDatePop(false);
            setactivityProp(false);
          }
        };
    
        // Attach the event listener when the component mounts
        document.addEventListener('click', handleClickOutside);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);
    
    return(
        <div className='grid-head-section' style={{paddingTop:'0px', paddingBottom:'10px'}}>
                <div className='grid-head-left-btn-section'>

                    <Popover
                        open={createdDatePop}
                        overlayClassName='settingCustomPopover tableGridPopover'
                        afterOpenChange={()=>{inputRef.current.focus();}}
                        content={
                            createdDatePop?
                            <div ref={popoverRef}>
                                <div className="popover-search" ref={popoverRef}>
                                    <Input type="text" 
                                        ref={inputRef}
                                        id="inputSearch"
                                        name='popoverSearch'
                                        style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                        className='generic-input-control' 
                                        placeholder="Search..."
                                        autoFocus={createdDatePop}
                                        autoComplete="off"
                                        value={createdDateSearch}
                                        onChange={(e)=> {
                                            setCreatedDate(createdDateList?.filter((date)=> (date.title)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))
                                            setCreatedDateSearch(e.target.value);
                                        }}
                                        suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                    />
                                </div>

                                <div className="popover-data "  ref={popoverRef}>
                                    
                                    {createdDate && createdDate?.map((datalist)=>(

                                        <div 
                                            className={createdDateFilter==datalist.title? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                            onClick={(e)=>{setCreatedDateFilter({name: e.target.innerText,}); setCreatedDatePop(false)}}>
                                            {datalist.title}
                                            <div className="text" style={{color: '#516f90',
                                                fontWeight: '50'}}>{datalist.subtitle}</div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                            :
                            null
                        }
                        trigger="click"
                        placement='bottom'
                    >
                        <span ref={popoverRef} className=' grid-text-btn'
                            onClick={()=>{setCreatedDatePop(!createdDatePop);setactivityProp(false)}}
                        >{"Create date "}
                        <CaretDownFilled style={{color:'#0091ae'}} />
                        </span>
                    </Popover>
                    
                    <Popover
                        open={activityProp}
                        overlayClassName='settingCustomPopover tableGridPopover'
                        afterOpenChange={()=>{inputRef.current.focus();}}
                        content={
                            activityProp ?
                            <div ref={popoverRef}>
                                <div className="popover-search" ref={popoverRef}>
                                    <Input type="text" 
                                        ref={inputRef}
                                        id="inputSearch"
                                        name='popoverSearch'
                                        style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                        className='generic-input-control' 
                                        placeholder="Search..."
                                        autoFocus={activityProp}
                                        autoComplete="off"
                                        value={activityDateSearch}
                                        onChange={(e)=> {
                                            setActivityDateList(createdDateList?.filter((date)=> (date.title)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))
                                            setActivityDateSearch(e.target.value);
                                        }}
                                        suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                    />
                                </div>

                                <div className="popover-data"  ref={popoverRef}>
                                    
                                    {activityDateList && activityDateList?.map((datalist)=>(

                                        <div 
                                        className={createdDateFilter==datalist.title? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                        onClick={(e)=>{setCreatedDateFilter({name: e.target.innerText,}); setCreatedDatePop(false)}}>
                                        {datalist.title}
                                        <div className="text" style={{color: '#516f90',
                                            fontWeight: '50'}}>{datalist.subtitle}</div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                            : null
                        }
                        trigger="click"
                        placement='bottom'
                    >
                        <span ref={popoverRef} className=' grid-text-btn'
                            onClick={()=>{setactivityProp(!activityProp);setCreatedDatePop(false)}}
                        >{"Last activity date "}
                        <CaretDownFilled/>
                        </span>
                    </Popover>


                    <span onClick={openAdvanceFilter}> 
                        <FontAwesomeIcon color='#0091ae' icon={faSliders} />&nbsp;<span className='grid-text-btn'>  Advance filters</span>
                    </span>
                    <span type='text' className='grid-text-btn'> Clear All </span>

                </div>
                <Button className='grid-head-right-btn'>
                    <SaveFilled /> Save view
                </Button>
            </div>
    )
}