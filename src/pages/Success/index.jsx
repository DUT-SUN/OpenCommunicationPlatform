import React from 'react';
import { Button, Result ,Card} from 'antd';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();
    return (
    <Card  style={{ marginBottom: 20, width: '1200px', position: 'absolute', top: '93px', height: '614px', left: '305px' }}>
  <Result
    status="success"
    title="文章发布成功!"
    subTitle="文章大概需要1~3秒提交完毕"
    extra={[
      <Button type="primary" key="console" onClick={() => navigate('/list')}>
        查看详情
      </Button>,
      <Button key="buy">继续发布</Button>,
    ]}
  />
</Card>
    )

};
export default Success;