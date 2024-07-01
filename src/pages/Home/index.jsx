import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';
import 'zrender/lib/svg/svg';
import './index.scss'
import Bar from '@/components/Bar'
import { Card, Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const chartRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id'); // 获取id查询参数
  // console.log(id)
  useEffect(() => {
    if (chartRef.current) {
      var mychart = echarts.init(chartRef.current);
      var option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 3, name: 'JAVA' },
              { value: 2, name: 'React' },
              { value: 2, name: '数据库' },
              { value: 2, name: 'Redis' },
              { value: 2, name: '一致性' },
              { value: 2, name: 'Token' },
              { value: 2, name: '前端' }
            ]
          }
        ]
      };
      option && mychart.setOption(option);
    }
  }, []);
  
  return (
    <Card
      title={
        <Breadcrumb separator=">"  items={[
            {title: "数据分析" }
    
        ]}/>
      
      }
      style={{ marginBottom: 20, width: '1200px', position: 'absolute', top: '93px', height: '614px', left: '305px' }}
    >
      <div ref={chartRef} id='main' style={{ position: 'absolute', width: '600px', height: '400px', left: '600px', top: '190px', }} />
      <div style={{ position: 'absolute', bottom: '40px' }}>
        {/* 渲染Bar组件 */}
        <Bar
          title='文章点击量'
          xData={['Token + redis 的原因', '一致性保证', '评论表的设计迭代']}
          yData={[100, 1000, 500]}
          style={{ width: '600px', height: '400px' }} />
      </div>
    </Card>
  )
}

export default Home;
