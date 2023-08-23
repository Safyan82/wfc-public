import { DatePicker, Input, Popover, Radio, Select } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCalendar, faChevronLeft, faClose, faExternalLink, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CaretDownFilled } from "@ant-design/icons";
import { useRef, useState } from "react";


export const DateFilter = ({
    handelFilter, clearFilter, 
    handelOption, setFilterValueSearch, 
    filtervalues, filterValueSearch, handelChange, 
    setFilterValues, selectedFilter, singleFilter,
    setFilterEnable, upsertFilter
})=>{
    const [dateString, setDateString] = useState("");
    const [dateStringBetween, setDateStringBetween] = useState("");

    return(
        <>
        <div className='back-btn' onClick={clearFilter}> <FontAwesomeIcon style={{fontSize: '8px'}} icon={faChevronLeft}/> <span>Back</span> </div>
        <div className="h5">{selectedFilter.label}</div>
        <div className="text">All filters are in the account's time zone (EDT)</div>
        <Radio.Group onChange={(e)=>handelFilter(e)} className='advanceFilterRadio'>
            
            <Radio value={"is_equal"}>is equal to</Radio>
            {singleFilter=='is_equal' &&
                <DatePicker 
                    className="generic-input-control"
                    suffixIcon={null}
                    placeholder="YYYY-MM-DD"
                    format={'YYYY-MM-DD'}
                    onChange={(e,date)=>setDateString(date)}
                />
            }

            <Radio value={"is_before"}>is before</Radio>
            {singleFilter=='is_before' &&
                <DatePicker 
                    className="generic-input-control"
                    suffixIcon={null}
                    placeholder="YYYY-MM-DD"
                    format={'YYYY-MM-DD'}
                    onChange={(e,date)=>setDateString(date)}
                />
            }
            
            <Radio value={"is_after"}>is after</Radio>
            {
                singleFilter=='is_after' &&
                <DatePicker 
                    className="generic-input-control"
                    suffixIcon={null}
                    placeholder="YYYY-MM-DD"
                    format={'YYYY-MM-DD'}
                    style={{marginBottom:'1%'}}
                    onChange={(e,date)=>setDateString(date)}
                />
            }

            <Radio value={"is_between"}>is between</Radio>
            {
                singleFilter=='is_between' &&
                <>
                    <DatePicker 
                        className="generic-input-control"
                        suffixIcon={null}
                        placeholder="YYYY-MM-DD"
                        format={'YYYY-MM-DD'}
                        onChange={(e,date)=>setDateString(date)}
                    />
                    <TagString/>
                    <DatePicker 
                        className="generic-input-control"
                        suffixIcon={null}
                        placeholder="YYYY-MM-DD"
                        format={'YYYY-MM-DD'}
                        onChange={(e,date)=>setDateStringBetween(date)}
                    />
                </>
            }

            <Radio value={"is_more_than"}>is more than</Radio>
            {singleFilter=="is_more_than" &&
                <Days 
                    setDateString={setDateString}
                    setDateStringBetween={setDateStringBetween}
                />                
            }
            <Radio value={"is_less_than"}>is less than</Radio>
            {singleFilter=="is_less_than" &&
                <Days
                    setDateString={setDateString}
                    setDateStringBetween={setDateStringBetween}
                />                
            }
            <Radio value={"is_known"}>is known</Radio>
            <Radio value={"is_unknown"}>is unknown</Radio>
        </Radio.Group>
        <button disabled={!singleFilter?.includes("known") && dateString?.length<1} 
            className={!singleFilter?.includes("known") && dateString?.length<1? 'filter-btn disabledFilterBtn' : 'filter-btn'}
            style={{marginTop:'10%'}} 
            onClick={()=>{upsertFilter({
                operator: selectedFilter.label,
                propId: selectedFilter.id, 
                filter:singleFilter, 
                filterValue: dateString, 
                filterValue1:dateStringBetween});
            setFilterEnable(false); clearFilter();}}>
          Apply filter
        </button>
        </>
    )
}

const TagString = ()=>{
    return(
        <span style={{marginBottom:'1%', marginTop:'1%'}}>
            
                <div className='text'  style={{marginBottom:'0',marginTop:'-0.6%', color: ""}}>
                    <span> and </span>
                </div> 
            
        </span>
    );
}


const Days = ({setDateString, setDateStringBetween})=>{
    const popoverRef = useRef(null);
    
    const [day, setDay] = useState();
    const [dayPopover, setDayPopover] = useState(false)

    return(
        <span style={{marginBottom:'1%', marginTop:'1%'}}>
            
                <div style={{marginBottom:'0',marginTop:'-0.6%', 
                    display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Input className="generic-input-control" onChange={(e)=>{setDateString(e.target.value);setDateStringBetween("days ago")}}/>
                    <Popover
                        open={dayPopover}
                        overlayClassName='settingArchiveCustomPopover'
                        style={{flexGrow:'2'}}
                        content={
                            <div ref={popoverRef}>
                                <div className="popover-data"  ref={popoverRef}>
                                    <div className="popoverdataitem" onClick={(e)=>{setDay(e.target.innerText); setDateStringBetween(e.target.value); setDayPopover(false)}}>
                                        day(s) ago
                                    </div>
                                    <div className="popoverdataitem" onClick={(e)=>{setDay(e.target.innerText); setDateStringBetween(e.target.value); setDayPopover(false)}}>
                                        day(s) from now
                                    </div>
                                </div>

                            </div>
                        }
                        trigger="click"
                        placement='bottom'
                    >
                        <span ref={popoverRef} className="dayPopHead" onClick={()=>setDayPopover(!dayPopover)}>{day? day :"day(s) ago"}
                        <span className='caret'></span>
                        </span>
                    </Popover>

                </div> 
            
        </span>
    );
}