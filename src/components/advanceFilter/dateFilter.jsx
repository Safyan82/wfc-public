import { DatePicker, Input, Popover, Radio, Select } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCalendar, faChevronLeft, faClose, faExternalLink, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CaretDownFilled } from "@ant-design/icons";
import { useRef, useState } from "react";


export const DateFilter = ({
    handelFilter, clearFilter, 
    handelOption, setValueSearch, 
    values, valueSearch, handelChange, 
    setValues, selectedFilter, singleFilter,
    setFilterEnable,
})=>{
    return(
        <>
        <div className='back-btn' onClick={clearFilter}> <FontAwesomeIcon style={{fontSize: '8px'}} icon={faChevronLeft}/> <span>Back</span> </div>
        <div className="h5">{selectedFilter}</div>
        <div className="text">All filters are in the account's time zone (EDT)</div>
        <Radio.Group onChange={(e)=>handelFilter(e)} className='advanceFilterRadio'>
            {/* <Radio value={"is"}>is</Radio>
            {singleFilter=="is" ? <TagString
                handelOption={handelOption} handelChange={handelChange} setValues={setValues}
                setValueSearch={setValueSearch} values={values} valueSearch={valueSearch}
            /> : null} */}
            <Radio value={"equal"}>is equal to</Radio>
            {singleFilter=='equal' &&
                <DatePicker 
                className="generic-input-control"
                suffixIcon={null}
                placeholder="DD/MM/YYYY"
                format={'DD/MM/YYYY'}
                />
            }

            <Radio value={"before"}>is before</Radio>
            {singleFilter=='before' &&
                <DatePicker 
                    className="generic-input-control"
                    suffixIcon={null}
                    placeholder="DD/MM/YYYY"
                    format={'DD/MM/YYYY'}
                />
            }
            
            <Radio value={"after"}>is after</Radio>
            {
                singleFilter=='after' &&
                <DatePicker 
                    className="generic-input-control"
                    suffixIcon={null}
                    placeholder="DD/MM/YYYY"
                    format={'DD/MM/YYYY'}
                    style={{marginBottom:'1%'}}
                />
            }

            <Radio value={"between"}>is between</Radio>
            {
                singleFilter=='between' &&
                <>
                    <DatePicker 
                        className="generic-input-control"
                        suffixIcon={null}
                        placeholder="DD/MM/YYYY"
                        format={'DD/MM/YYYY'}
                    />
                    <TagString/>
                    <DatePicker 
                        className="generic-input-control"
                        suffixIcon={null}
                        placeholder="DD/MM/YYYY"
                        format={'DD/MM/YYYY'}
                    />
                </>
            }

            <Radio value={"morethan"}>is more than</Radio>
            {singleFilter=="morethan" &&
                <Days/>                
            }
            <Radio value={"lessthan"}>is less than</Radio>
            {singleFilter=="lessthan" &&
                <Days/>                
            }
            <Radio value={"known"}>is known</Radio>
            <Radio value={"unknown"}>is unknown</Radio>
        </Radio.Group>
        <button className='filter-btn' style={{marginTop:'10%'}} onClick={()=>setFilterEnable(true)}>
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


const Days = ({handelOption, handelChange, setValues, setValueSearch, values, valueSearch})=>{
    const popoverRef = useRef(null);
    
    const [day, setDay] = useState();
    const [dayPopover, setDayPopover] = useState(false)

    return(
        <span style={{marginBottom:'1%', marginTop:'1%'}}>
            
                <div style={{marginBottom:'0',marginTop:'-0.6%', 
                    display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Input className="generic-input-control" />
                    <Popover
                        open={dayPopover}
                        overlayClassName='settingArchiveCustomPopover'
                        style={{flexGrow:'2'}}
                        content={
                            <div ref={popoverRef}>
                                <div className="popover-data"  ref={popoverRef}>
                                    <div className="popoverdataitem" onClick={(e)=>{setDay(e.target.innerText); setDayPopover(false)}}>
                                        day(s) ago
                                    </div>
                                    <div className="popoverdataitem" onClick={(e)=>{setDay(e.target.innerText); setDayPopover(false)}}>
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