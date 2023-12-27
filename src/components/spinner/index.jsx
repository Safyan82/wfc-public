import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const Spinner = ({color, fontSize = 20}) => {
  
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: fontSize ,
      }}
      spin
    />
  );

  return <Spin indicator={antIcon} style={{color:color}} />;
}
export default Spinner;