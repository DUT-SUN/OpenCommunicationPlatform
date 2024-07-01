import React from 'react';
import { Button, Result ,Card} from 'antd';
import { useNavigate } from 'react-router-dom';


const Page404 = () => {

 const navigate = useNavigate();
return(
<Card  style={{ marginBottom: 20, width: '1200px', position: 'absolute', top: '93px', height: '614px', left: '305px' }}>
<Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary"onClick={() =>  navigate('/list')}>回到主页</Button>}
  />
</Card>
)


}
;
export default Page404;