import { Radio, Select } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCalendar, faChevronLeft, faClose, faExternalLink, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CaretDownFilled } from "@ant-design/icons";


export const PlainFilter = ({
    handelFilter, clearFilter, 
    handelOption, setFilterValueSearch, 
    filtervalues, filterValueSearch, handelChange, 
    setFilterValues, selectedFilter, singleFilter,
    setFilterEnable,
})=>{
    return(
        <>
        <div className='back-btn' onClick={clearFilter}> <FontAwesomeIcon style={{fontSize: '8px'}} icon={faChevronLeft}/> <span>Back</span> </div>
        <div className="h5">{selectedFilter}</div>
        <div className="text">All filters are in the account's time zone (EDT)</div>
        <Radio.Group onChange={(e)=>handelFilter(e)} className='advanceFilterRadio'>
            <Radio value={"containExactly"}>contains exactly</Radio>
            {singleFilter=="containExactly" ? <TagString
                handelOption={handelOption} handelChange={handelChange} setFilterValues={setFilterValues}
                setFilterValueSearch={setFilterValueSearch} filtervalues={filtervalues} filterValueSearch={filterValueSearch}
            /> : null}
            <Radio value={"notcontain"}>doesn't contain exactly</Radio>
            {singleFilter=="notcontain" ? <TagString 
                handelOption={handelOption} handelChange={handelChange} setFilterValues={setFilterValues}
                setFilterValueSearch={setFilterValueSearch} filtervalues={filtervalues} filterValueSearch={filterValueSearch}/> : null}
            <Radio value={"exist"}>is known</Radio>
            <Radio value={"notExist"}>is unknown</Radio>
        </Radio.Group>
        <button className='filter-btn' style={{marginTop:'10%'}} onClick={()=>setFilterEnable(true)}>
          Apply filter
        </button>
        </>
    )
}

const TagString = ({handelOption, handelChange, setFilterValues, setFilterValueSearch, filtervalues, filterValueSearch})=>{
    return(
        <span style={{marginBottom:'1%'}}>
            <Select 
                mode='tags' 
                className='custom-select ' 
                style={{width:'100%',marginTop:"1%", marginBottom:"2%",}} 
                value={filtervalues}
                onSearch={(e)=>setFilterValueSearch(e)}
                onInputKeyDown={(e)=>{if(e.key==="Enter"){setFilterValues([...filtervalues, filterValueSearch]);setFilterValueSearch("")}}}
                open={false}
                suffixIcon={<CaretDownFilled style={{color:'#0091ae'}} />}
                onChange={handelChange}
            />
            {
                filterValueSearch ?
                <div className='createOption text'  style={{marginBottom:'0',marginTop:'-0.6%', color: ""}}>
                    <span onClick={handelOption}> Create option as "{filterValueSearch}"  </span><FontAwesomeIcon icon={faClose} onClick={()=>setFilterValueSearch(null)}/>
                </div> : null
            }
        </span>
    );
}