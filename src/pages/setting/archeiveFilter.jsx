
import './setting.css';
import '../../components/createFields/createFieldDrawer.css';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Col, DatePicker, Input, Popover, Row, Select, Tabs, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCalendarAlt, faCalendarDays, faCalendarWeek, faChevronLeft, faChevronRight, faLock, faLongArrowRight, faRightLong, faSearch } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { ArchivePropertyFilter } from '../../util/query/properties.query';
import { useDispatch } from 'react-redux';
import { setArchivePropertyFilter, setArchivePropertyFilteredData, setArchivePropertyLoading, setRefetchFilteredProperty } from '../../middleware/redux/reducers/archiveProperty.reducer';
import { useSelector } from 'react-redux';

export const ArcheiveFilter = ({archive, setArchive, setArchivePopover, archivePopover})=>{
    
    const popoverRef = useRef(null);

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().endOf('day');
    };

    const {isFilterActive} = useSelector(state=>state.archiveReducer);

    const [startDate, setStartDate] = useState((dayjs().subtract(3, 'month')).startOf('day').add(1, 'day').valueOf());
    const [endDate, setEndDate] = useState(dayjs().endOf('day').valueOf());
    useEffect(()=>{
        if(!isFilterActive){
            setStartDate((dayjs().subtract(3, 'month')).startOf('day').add(1, 'day').valueOf());
            setEndDate(dayjs().endOf('day').valueOf());
        }
    },[isFilterActive])


    const {data:archivePropertyFilter, loading, refetch} = useQuery(ArchivePropertyFilter,{
        variables:{
            startDate: startDate.toString(),
            endDate: endDate.toString()
        },
        skip: !startDate && !endDate,
        fetchPolicy: 'network-only'
    });

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setArchivePropertyLoading(loading))
    },[loading])

    useEffect(()=>{
        if(archivePropertyFilter?.archivePropertyFilter){
            dispatch(setArchivePropertyFilteredData(archivePropertyFilter?.archivePropertyFilter));
            dispatch(setArchivePropertyFilter(true));
            dispatch(setRefetchFilteredProperty(refetch))
        }
    },[archivePropertyFilter?.archivePropertyFilter]);

    const dateFormat = 'MM/DD/YYYY';

    return(
        <div className="filter"  >
            <div className="filter-inner">

                <div className='left-filter-inner'>
                    <div className="">Filter by:</div>
                    
                    <div className='filter-item archeiveFilter' ref={popoverRef}>
                        <Popover
                            visible={archivePopover}
                            overlayClassName='settingArchiveCustomPopover'
                            content={
                                <div ref={popoverRef}>
                                    <div className="popover-data"  ref={popoverRef}>
                                        <div className="popoverdataitem" onClick={(e)=>{setArchive(e.target.innerText); setArchivePopover(false)}}>
                                            All
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setArchive(e.target.innerText); setArchivePopover(false)}}>
                                            Custom
                                        </div>
                                        <div className="popoverdataitem" onClick={(e)=>{setArchive(e.target.innerText); setArchivePopover(false)}}>
                                            Work force city
                                        </div>
                                    </div>

                                </div>
                            }
                            trigger="click"
                            placement='bottom'
                        >
                            <span ref={popoverRef} onClick={()=>setArchivePopover(!archivePopover)}>{archive? archive :"All"}
                            <span className='caret'></span>
                            </span>
                        </Popover>

                    </div>

                    <div className="filter-item"
                        style={{
                            display: 'flex',
                            gap: '20px',
                            width: '60%',
                            alignItems: 'center'
                        }}
                    >
                        <DatePicker
                            className='generic-input-control'
                            onChange={(e, dateString)=>setStartDate(dayjs(dateString).startOf('day').valueOf())}
                            disabledDate={disabledDate}
                            dateFormat={dateFormat}
                            defaultValue={(dayjs().subtract(3, 'month')).startOf('day').add(1, 'day')}
                            suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                        />
                        
                        <FontAwesomeIcon icon={faLongArrowRight} style={{color:'black'}} />

                        <DatePicker
                            className='generic-input-control'
                            onChange={(e, dateString)=>setEndDate(dayjs(dateString).endOf('day').valueOf())}
                            disabledDate={disabledDate}
                            
                            suffixIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                            defaultValue={dayjs()}
                        />
                    </div>
                    
                   

                </div>

            </div>
        </div>
    )
}