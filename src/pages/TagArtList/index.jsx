import React from 'react';
import { Timeline, Card, message, Spin, Tag ,Skeleton } from 'antd';
import { useStore } from '@/store/index'
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.scss'
const TagArtList = () => {
    let { tag } = useParams();
    const { TagStore, ArticleStore } = useStore()
    const [Loading, setLoading] = useState(true)
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    const [colorIndex, setColorIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex((colorIndex + 1) % colors.length);
        }, 5000); // 每秒变化一次颜色

        return () => clearInterval(interval); // 组件卸载时清除定时器
    }, [colorIndex, colors.length]);
    // console.log(tag);
    useEffect(() => {
        const loadtagList = async (tag) => {
            if (tag != null) {
                TagStore.getTagRelated(tag)
                setLoading(false)
            } else {
                message.fail("tag不能为空")
            }
        }
        setLoading(true)
        loadtagList(tag)
    }, [tag])
    const increaseRount = (id) => {
        ArticleStore.increaseRount(id)
    }

    if (Loading) {
        return <Spin />
    }
    return (
        <div className="tagList">
            <Card style={{ marginBottom: 20, width: '1200px', position: 'absolute', top: '93px', height: '614px', left: '305px' }}>
                <h1 style={{ fontSize: '50px', marginBottom: '20px' }}>TAG </h1>
                <Timeline>
                    <Timeline.Item >
                        <Tag color={colors[colorIndex]} style={{ fontSize: '13px', padding: '5px' }}>{tag}</Tag>
                    </Timeline.Item>
                    {TagStore.blogDocs.map(item => (
                        <Timeline.Item key={item.id}>
                            <Link to={`/list/detail?id=${item.id}`} onClick={()=>{increaseRount(item.id)}}>
                                {item.title}
                            </Link>
                            {' '}
                            {new Date(item.createtime).toLocaleDateString()}
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Card>
        </div>
    )
};
export default TagArtList;