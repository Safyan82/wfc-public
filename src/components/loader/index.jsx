import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export const Loader=()=>{
    return(
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', verticalAlign:'center', height:'inherit'}}>
              <Spin size='large' style={{color:'#0091ae'}}  indicator={<LoadingOutlined />} />
        </div>
    )
}