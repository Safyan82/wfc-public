import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 20,
    }}
    spin
  />
);
const Spinner = ({color}) => <Spin indicator={antIcon} style={{color:color}} />;
export default Spinner;