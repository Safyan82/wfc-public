import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GenericTable } from "../../../components/genericTable/genericTable"
import { UserAccessLogQuery } from '../../../util/query/userAccess.query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComputer, faLaptop, faMobileAndroid } from '@fortawesome/free-solid-svg-icons';
import { browserName, engineName, useDeviceData } from 'react-device-detect';
import { deactiveSessionMutation } from '../../../util/mutation/userAccess.mutation';

export const UserAccess = ()=>{
    
    const column = [
        {
            title: 'NAME',
            key: 'name',
            dataIndex: 'name'
        }, 
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email'
        }, 
        {
            title: 'IP Address',
            key: 'ip',
            dataIndex: 'ip'
        },  
        {
            title: 'Location',
            key: 'location',
            dataIndex: 'location'
        },  
        {
            title: 'Device',
            key: 'device',
            dataIndex: 'platform'
        }, 
        {
            title: 'Login Time',
            key: 'accessedAt',
            dataIndex: 'accessedAt'
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status'
        }, 

    ];

    const {data, loading, refetch} = useQuery(UserAccessLogQuery, {
        fetchPolicy: 'network-only',
    });

    const [dataSource, setDataSource] = useState([]);

    const [DeactiveuserSession] = useMutation(deactiveSessionMutation)

    useEffect(()=>{
        if(data?.getUsersAccessLog){
            setDataSource(data?.getUsersAccessLog.reverse()?.map((log, id)=>{
                return {
                    key: id,
                    name: log?.employee[0]?.firstname + " " + log?.employee[0]?.lastname,
                    email: log?.employee[0]?.metadata?.email,
                    ip: log?.ip,
                    location: log?.location,
                    accessedAt: log?.accessedAt,
                    platform: log?.platform?.isMobile?<FontAwesomeIcon icon={faMobileAndroid} /> : 
                    <div style={{display:'flex', gap: '4px', flexDirection: 'column', alignItems:'center'}}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        version="1.1"
                        viewBox="0 0 26 26"
                        xmlSpace="preserve"
                    >
                        <g fill="#00ADEF">
                        <path d="M12.811 8.52l1.061-3.658c-.933-.631-1.967-1.136-4.119-.244L8.691 8.291c.855-.354 1.53-.515 2.096-.51.859.006 1.463.361 2.024.739z"></path>
                        <path d="M8.518 8.965l-.013.006-1.05 3.652c2.155-.892 3.17-.374 4.104.254l1.074-3.692c-.931-.631-1.969-1.103-4.115-.22zM14.432 5.246l-1.061 3.679c.93.631 2.053 1.147 4.115.226l1.059-3.665c-2.15.887-3.184.389-4.113-.24z"></path>
                        <path d="M13.195 9.541l-1.063 3.652c.934.633 1.968 1.137 4.117.246l1.024-3.56c-2.191.751-3.146.29-4.078-.338z"></path>
                        <path d="M23 0H3C1.344 0 0 1.344 0 3v14c0 1.656 1.344 3 3 3h7v1c0 .551.449 1 1 1h4c.551 0 1-.516 1-1v-1h7c1.656 0 3-1.344 3-3V3c0-1.656-1.344-3-3-3zm.275 18.725a.726.726 0 11.001-1.451.726.726 0 01-.001 1.451zM24 15c0 .551-.449 1-1 1H3c-.551 0-1-.449-1-1V3c0-.551.449-1 1-1h20c.551 0 1 .449 1 1v12zM17.877 23H8.124a2.09 2.09 0 00-2.09 2.09V26h13.934v-.91A2.092 2.092 0 0017.877 23z"></path>
                        </g>
                        </svg>
                        {log?.platform?.browser}
                    </div>,
                    status: log?.isActive? <div onClick={async()=> {await DeactiveuserSession({
                        variables:{
                            deactiveSessionId: log?._id
                        }
                    }); await refetch()}} style={{cursor:'pointer' ,margin: 'auto', height:'20px', width:'20px', borderRadius:'50%', background:'green'}}></div> :
                    <div style={{margin: 'auto', cursor:'not-allowed', height:'20px', width:'20px', borderRadius:'50%', background:'rgba(0,0,0,0.2)'}}></div>
                }
            }))
        }
    }, [data?.getUsersAccessLog]);

    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(()=>{
      if(searchKeyword?.length>0){
        console.log(searchKeyword, "s")
      }
    },[searchKeyword]);

    const handleRowMouseEnter = (record) => {
      setHoveredRow(record.key);
      sessionStorage.setItem('RolehoverItem', record.key);
    };
    const [hoveredRow, setHoveredRow] = useState(null);

    return(
        <div className='setting-body userRoleModal'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner"></div> 
                <div className="setting-body-title">
                    <div className='setting-body-inner-title'>
                        User Access Log 
                    </div>
                </div>
                {/* descriptive text */}
                <div className="text">
                User Access Log is crucial tool for security monitoring, compliance adherence, and troubleshooting. This log ensures transparency, enabling timely response to incidents and maintaining system integrity.
                </div>
                <div className='tableView site-layout'>
                    <GenericTable 
                        dataSource={dataSource} 
                        column={column} 
                        hoveredRow={hoveredRow}
                        setHoveredRow={setHoveredRow}
                        handleRowMouseEnter={handleRowMouseEnter} 
                        setSearchKeyword={setSearchKeyword} 
                        
                    />
                </div>
            </div>
        </div>
    );
}