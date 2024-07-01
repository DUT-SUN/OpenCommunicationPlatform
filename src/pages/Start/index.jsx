import { LikeOutlined, MessageOutlined, StarOutlined,UserOutlined } from "@ant-design/icons";
import { Avatar, List, Space,message, Tag } from "antd";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { SIDEBAR } from "@/config";
import { Card, Breadcrumb, Spin,Swith } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/index"
import { getimgUrl } from "@/utils/img";
import ListIcon from '@/assets/list.png'
import 'md-editor-rt/lib/preview.css';
import {
  getfavoriteList,
  getlikeList,
}from '@/utils/userlist'
import { useSearchParams } from 'react-router-dom';


const StartList = () => {
  const { ArticleStore } = useStore();
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  ArticleStore.setKeyword(keyword)
  const [searchCount,setSearchCount]=useState(0)
  // console.log(keyword);
  const [isLoading, setIsLoading] = useState(true);
  // 分页代码
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1)
  const size=  5;
  const imgUrl = getimgUrl() || SIDEBAR.avatar
  useEffect(() => {
    const fetchData = async () => {
      const data = await ArticleStore.getArticleList();
      setSearchCount(data.length)

      // console.log(data)
      if (JSON.stringify(ArticleStore.ArticleList) === JSON.stringify(data)) {
        setIsLoading(false);
        return
      }
      ArticleStore.setArticleList(data);
      setIsLoading(false);
    };
    //这里去发送请求到后端服务器返回es查询的文档
    const getKeywordList =async()=>{
      const data = await ArticleStore.getKeywordList(ArticleStore.keyword,page,size);
      setSearchCount(data.total)
      if (JSON.stringify(ArticleStore.ArticleList) === JSON.stringify(data.blogDocs))  {
        setIsLoading(false);
        return
      }
      ArticleStore.setArticleList(data.blogDocs);
      setIsLoading(false);
    }
    // console.log(ArticleStore.keyword)
    if(ArticleStore.keyword){
      getKeywordList()
    }else{
      fetchData();
    }
    // 初始化时获取数据
  }, [ArticleStore.ArticleList,ArticleStore.keyword]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await ArticleStore.getlikeList();
      // console.log(res)
      // message.success(res.msg)
    };
    // 初始化时获取数据
    fetchData();
  }, [getlikeList()]);


  useEffect(() => {
    const fetchData = async () => {
      const res = await ArticleStore.getfavoriteList();
      // console.log(res)
      // message.success(res.msg)
    };
    // 初始化时获取数据
    fetchData();
  }, [getfavoriteList()]);
  const IconText = ({ icon, text, id }) => {
    let color = 'black';
    if (icon === StarOutlined &&  getfavoriteList().includes(id)) {
      color = 'purple';
    } else if (icon === LikeOutlined &&  getlikeList().includes(id)) {
      color = 'purple';
    }
  
    return (
      <Space>
        {React.createElement(icon, { style: { color } })}
        {text}
      </Space>
    );
  };
  // const handlePageChange = (page, pageSize) => {
  //   setCurrentPage(page);
  //   ArticleStore.getPageArticles(page, pageSize)
  //     .then(() => {
  //       message.success('数据加载成功');
  //     })
  //     .catch(() => {
  //       message.error('数据加载失败');
  //     });
  // };
  // 默认拿第一页的数据
  // useEffect(() => {
  //   handlePageChange(1,pageSize);
  // }, []);
const increaseRount=(id)=>{
  ArticleStore.increaseRount(id)
}

  return (
    <div
      style={{
        position: "relative",
        left: "305px",
        top: "29px",
        width: "100%",
      }}
    >
      <Card
        title={
            <Breadcrumb separator=">" items={[{ title: <><img src={ListIcon} style={{ width: "20px", height: "20px", bottom: '2px', position: 'relative', right: '3px' }} /> 文章列表</> },{title:"文章数："+searchCount}]} />
        }
      >
        <div style={{ height: "560px", width: "1170px", overflow: "auto", scrollbarWidth: "none" }}>
          {isLoading ?
            <Spin tip="Loading" size="large"
              style={{
                position: 'absolute',
                top: '150px',
                left: '49.4%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px'
              }}
            >
              <div className="content" />
            </Spin>
            : <List
              bordered="true"
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: {},//这里调用分页获取数据的函数
                pageSize: 5,
              }}
              dataSource={ArticleStore.ArticleList}
              renderItem={(item) => (
                <List.Item
                  className="withBorder"
                  key={item.id}
                  actions={[
                    <IconText
                      icon={StarOutlined}
                      text={item.favorite}
                      key="list-vertical-star-o"
                      id={item.id}
                    />,
                    <IconText
                      icon={LikeOutlined}
                      text={item.star}
                      key="list-vertical-like-o"
                      id={item.id}
                    />,
                    <IconText
                      icon={MessageOutlined}
                      text={item.comment}
                      key="list-vertical-message"
                      id={item.id}
                    />,
                    <IconText
                    icon={UserOutlined}
                    text={item.username}
                    key="list-vertical-message"
                    id={item.id}
                  />,
                  ]}
                  extra={
                    <img
                    style={{maxHeight: '210px', width: 'auto'}}
                      width={272}
                      alt="logo"
                      src={item.avatar?item.avatar:"https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
                    />
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar src={imgUrl} />}
                    title={<a href={`/list/detail?id=${item.id}`} onClick={()=>{increaseRount(item.id)}}>    
                    <div>
                      {item.title}
                      {item && item.type && item.type.split(',').map((tag, index) => (
                        <Tag color={colors[index % colors.length]} key={tag} style={{ margin: '0 5px' }} >
                          {tag}
                        </Tag>
                      ))}

                    </div></a>}
                    description={item.description}
                  />
                  <div className="content">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </List.Item>
              )}
            />}
        </div>
      </Card>
    </div>
  );
};

export default  observer(StartList);
