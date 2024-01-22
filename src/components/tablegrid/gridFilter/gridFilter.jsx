import React, { useEffect, useState, useRef } from "react";
import { CaretDownFilled, SaveFilled } from "@ant-design/icons";
import { faClose, faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Popover } from "antd";
import { useDispatch } from "react-redux";
import { resetAdvanceFilter, resetQuickFilter, setQuickFilter } from "../../../middleware/redux/reducers/quickFilter";
import { useSelector } from "react-redux";
import { createdDateList } from "../../../util/date";
import { useMutation } from "@apollo/client";
import { updateBranchView } from "../../../util/mutation/branchView.mutation";
import { setNotification } from "../../../middleware/redux/reducers/notification.reducer";


export const GridFilter = ({openAdvanceFilter, updateView, refetch})=>{
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
    const dispatch = useDispatch();

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

    const {quickFilter, advanceFilter} = useSelector(state=>state.quickFilterReducer)

    const { refetchBranchView } = useSelector(state => state.branchViewReducer);

    const [loading, setLoading] = useState(false);
    
    const handelSaveView = async () =>{
        setLoading(true);
        await updateView({
            variables:{
                input:{
                    _id: sessionStorage.getItem('selectedViewId'),
                    quickFilter,
                    advanceFilter,
                }
            }
        });
        dispatch(setNotification({
            notificationState:true, 
            message:"View saved successfully",
            error: false,
        }));
        await refetch();
        // await refetchBranchView();
        setLoading(false);
    };
    
    const advanceFilterNumber = advanceFilter.reduce((accumulator, currentArray) => {
        return accumulator + currentArray.length;
    }, 0)

    console.log(quickFilter?.createdDate, "quickFilter?.createdDate")
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
                                            onClick={(e)=>{setCreatedDateFilter({name: e.target.innerText,}); 
                                            dispatch(setQuickFilter({createdDate: datalist.value}));
                                            setCreatedDatePop(false)}}>
                                            {datalist.title}
                                            <div 
                                                className="text" 
                                                style={{color: '#516f90',
                                                fontWeight: '200'}}
                                            >
                                                {datalist.subtitle}
                                            </div>
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
                        <div ref={popoverRef} className={quickFilter?.createdDate? 'selectedText' : 'grid-text-btn selectedTextpadding'}
                            onClick={(e)=>{
                                setCreatedDatePop(!createdDatePop);
                                setactivityProp(false);
                            }}
                        >
                            <span>
                                {quickFilter?.createdDate? createdDate?.find((date)=>date.value==quickFilter?.createdDate)?.title  : "Create date "} &nbsp;
                                <CaretDownFilled style={{color:'#0091ae'}} />
                            </span>
                            {quickFilter?.createdDate? 
                            <FontAwesomeIcon className="selectedTextCloseIcon" onClick={()=>{setCreatedDatePop(false);dispatch(setQuickFilter({createdDate: null}))}} icon={faClose}/>
                            : null}
                        </div>
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
                                        onClick={(e)=>{
                                            setCreatedDateFilter({name: e.target.innerText,}); 
                                            setCreatedDatePop(false);
                                            dispatch(setQuickFilter({updatedDate: datalist.value}));
                                        }}>
                                        {datalist.title}
                                        <div className="text" style={{color: '#516f90',
                                            fontWeight: '200'}}>{datalist.subtitle}</div>
                                        </div>
                                        
                                    ))}
                                </div>

                            </div>
                            : null
                        }
                        trigger="click"
                        placement='bottom'
                    >
                            
                            <div ref={popoverRef} className={quickFilter?.updatedDate? 'selectedText' : 'grid-text-btn selectedTextpadding'}
                                onClick={()=>{
                                    setactivityProp(!activityProp);setCreatedDatePop(false)
                                }}
                                >
                                <span>
                                    {quickFilter?.updatedDate? createdDate?.find((date)=>date.value==quickFilter?.updatedDate)?.title  :"Last activity date "} &nbsp;
                                    <CaretDownFilled/>
                                </span>
                                            
                            {quickFilter?.updatedDate? 
                                <FontAwesomeIcon className="selectedTextCloseIcon" onClick={()=>{setactivityProp(false); setCreatedDatePop(false); dispatch(setQuickFilter({updatedDate: null}))}} icon={faClose}/>
                                : null}
                            </div>
                            
                    </Popover>


                    <span onClick={openAdvanceFilter}> 
                        <FontAwesomeIcon color='#0091ae' icon={faSliders} />&nbsp;<span className='grid-text-btn'>  Advance filters ({advanceFilterNumber}) </span>
                    </span>
                    <span type='text' className='grid-text-btn'
                        onClick={()=>{
                            dispatch(resetAdvanceFilter());
                            dispatch(resetQuickFilter());  
                        }}
                    > Clear All </span>

                </div>
                <Button className='grid-head-right-btn' onClick={handelSaveView}>
                    <SaveFilled /> Save view
                </Button>
            </div>
    )
}