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
import "./gridFilter.css";
import { setTogglenewCreateView } from "../../../middleware/redux/reducers/newView.reducer";

export const GridFilter = ({openAdvanceFilter, updateView, refetch, viewList})=>{
    const [createdDate, setCreatedDate] = useState([...createdDateList]);
    const [createdDateSearch, setCreatedDateSearch] = useState();
    const [createdDatePop, setCreatedDatePop] = useState();
    const [createdDateFilter, setCreatedDateFilter] = useState();

    const [activityProp, setactivityProp] = useState(false);
    const [activityDateFilter, setActivityDateFilter] = useState();
    const [activityDateList, setActivityDateList] = useState([...createdDateList]);
    const [activityDateSearch, setActivityDateSearch] = useState();
    
    // get id of user who created this view to check it is allowed to edit or not

    const [viewCreatedBy, setViewCreatedBy] = useState(null);
    
    useEffect(()=>{
        if(viewList?.length>0){
            const viewDetail = viewList.find((view)=>view?._id==sessionStorage.getItem('selectedViewId'));
            if(viewDetail?.createdBy){
                setViewCreatedBy(viewDetail?.createdBy);
            }else{
                setViewCreatedBy(null)
            }
        }
    },[sessionStorage.getItem('selectedViewId')]);


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
    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);
    console.log(viewCreatedBy,authenticatedUserDetail?._id, "viewCreatedBy==authenticatedUserDetail?._id?")
    const handelSaveView = async () =>{
        setLoading(true);
        await updateView({
            variables:{
                input:{
                    _id: sessionStorage.getItem('selectedViewId'),
                    quickFilter,
                    advanceFilter,
                    updatedBy: authenticatedUserDetail?._id
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

    const [openSaveView, setOpenSaveView] = useState(false);
    const {togglenewCreateView} = useSelector(state=>state.newViewReducer)

    useEffect(()=>{
        setOpenSaveView(false);
    },[togglenewCreateView]);

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

                <Popover
                    open={openSaveView}
                    content={
                        <div className="saveView-inner">
                            <h4 style={{color:'#33475B'}}>
                               { viewCreatedBy==authenticatedUserDetail?._id? "Editable view" : "Read-only view" }
                            </h4>
                            {
                                viewCreatedBy==authenticatedUserDetail?._id?
                            
                                <div className="text">
                                    This view was created by you. You can save filters, sort, and column edits to this view.
                                </div>
                                :
                                <div className="text">
                                    This is a standard view or created by someone else. Save as new view to keep your changes.
                                </div>
                            }
                            <div style={{display:'flex', gap:'16px'}}>
                                <button className={viewCreatedBy!==authenticatedUserDetail?._id?'filter-btn disabled-btn':"filter-btn"} disabled={viewCreatedBy!==authenticatedUserDetail?._id}
                                    onClick={viewCreatedBy!==authenticatedUserDetail?._id? console.warn("method not allowed") :handelSaveView}
                                >Save</button>
                                <button className="reset-btn"
                                onClick={()=>{
                                    dispatch(resetAdvanceFilter());
                                    dispatch(resetQuickFilter());  
                                }}
                                >Reset</button>
                            </div>

                            <div className="text-deco mt16" onClick={()=>dispatch(setTogglenewCreateView(true))}>Save as new view</div>
                        </div>
                    }
                    overlayClassName='saveView'
                    placement="bottom"
                    trigger={"click"}
                >
                    {/* onClick={handelSaveView} */}
                    <Button className='grid-head-right-btn' onClick={()=>setOpenSaveView(!openSaveView)}>
                        <SaveFilled /> Save view
                    </Button>
                </Popover>

            </div>
    )
}