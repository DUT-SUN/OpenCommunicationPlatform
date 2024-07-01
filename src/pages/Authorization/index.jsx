import React from 'react';
import { Button, Result ,Card} from 'antd';
const Authorization = () => (
    <Card  style={{ marginBottom: 20, width: '1220px', position: 'absolute', top: '93px', height: '614px', left: '305px' }}>
    <Result
        status="403"
        title="403"
        subTitle="抱歉，未授权，请登录"
    />
</Card>

);
export default Authorization;