import React, { useState, useEffect } from 'react';
import { Spin, Tag, Skeleton } from 'antd';
import { useStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import './index.scss'
//这个类的作用是去渲染layout的tag列表
const TagBar = () => {
    const { TagStore } = useStore()
    //每一个tag我需要点击跳转，渲染标签
    //后端获取标签列表，就是字符串数组
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    // const selectedTags = ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Express', 'MongoDB', 'Redux', 'TypeScript', 'Webpack'];
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        TagStore.getTagList().then(() => setLoading(false));
    }, []);
    const handleClick = (tag) => {
        navigate(`/tags/${tag}`); // 点击标签后导航到对应的路径
    }
    if (loading) {
        return (

            <Skeleton
                title={false}
                paragraph={{ rows: 4, width: ['80%', '80%', '80%', '80%'] }}
            />

        )


    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {TagStore.selectedTags.map((tag, index) => (
                <Tag color={colors[index % colors.length]} key={tag} style={{ margin: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => handleClick(tag)}>
                    {tag}
                </Tag>
            ))}
        </div>
    );


};

export default TagBar;
