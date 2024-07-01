import { Descriptions ,Badge,Divider} from 'antd';
import React from 'react';
import './index.scss'
const About = () => {

  return (
    <div style={{position:'absolute', left:'500px' ,top:'150px'}}>
    <Descriptions title="" bordered>
    <Descriptions.Item label="姓名">孙嘉锐</Descriptions.Item>
    <Descriptions.Item label="年龄">19</Descriptions.Item>
    <Descriptions.Item label="存活">YES</Descriptions.Item>
    <Descriptions.Item label="出生日期">9月20日</Descriptions.Item>
    <Descriptions.Item label="博客更新日期" span={2}>
      2022—7—31
    </Descriptions.Item>
    <Descriptions.Item label="博客状态" span={3}>
      <Badge status="processing" text="Running" />
    </Descriptions.Item>
    <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
    <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
    <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
    <Descriptions.Item label="Config Info">
      Data disk type: Mysql 
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1<br />
    </Descriptions.Item>
  </Descriptions>
  <Divider></Divider>
    </div>
  )
}

export default About
