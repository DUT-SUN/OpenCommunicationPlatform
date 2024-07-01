import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Page500 = () => {
    const navigate = useNavigate();
    return <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={() => navigate('/list')}>回到主页</Button>}


    />
};
export default Page500;