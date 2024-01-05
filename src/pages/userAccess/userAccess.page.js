import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GenericTable } from "../../components/genericTable/genericTable"
import { UserAccessLogQuery } from '../../util/query/userAccess.query';

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
            title: 'Login Time',
            key: 'accessedAt',
            dataIndex: 'accessedAt'
        }, 

    ];

    const {data, loading} = useQuery(UserAccessLogQuery, {
        fetchPolicy: 'network-only',
    });

    const [dataSource, setDataSource] = useState([]);
    useEffect(()=>{
        if(data?.getUsersAccessLog){
            setDataSource(data?.getUsersAccessLog?.map((log, id)=>{
                return {
                    key: id,
                    name: log?.employee[0]?.firstname + " " + log?.employee[0]?.lastname,
                    email: log?.employee[0]?.metadata?.email,
                    ip: log?.ip,
                    location: log?.location,
                    accessedAt: log?.accessedAt
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