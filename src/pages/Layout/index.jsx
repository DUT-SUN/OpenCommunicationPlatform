import {
  Layout,
  Divider,
  Menu,
  Alert,
  Modal,
  Avatar,
} from "antd";
import React, { useEffect, useState } from "react";
import "./index.scss";
import LoginStore from '@/store/login.Store'
// import screenfull from "screenfull";
import { Link, Outlet } from "react-router-dom";
import { HomeFilled, SettingOutlined,LogoutOutlined  } from "@ant-design/icons";
import { SIDEBAR } from "@/config";
import Href from "@/components/Href";
import { history } from "@/utils/history";
import SearchButton from "@/pages/Layout/Search";
import { observer } from "mobx-react-lite";
import {useStore} from "@/store/index"
import { useSearchParams } from 'react-router-dom';
import TagBar from './TagBar';

import {
  BarChartOutlined,
  DiffOutlined,
  EditOutlined,
  SketchOutlined,
  QqOutlined,
} from "@ant-design/icons";
// import { useStore } from "@/store";
import LoginRegister from "./LoginRegister";
import StartList from "../Start/index";
import { getToken, getName } from "@/utils";
import UserDefaultIcon from "@/assets/default.png";
import Uploadx from "./Uploadx";
import { getimgUrl } from "@/utils/img";
const { Header, Footer, Sider, Content } = Layout;
const imgUrl=getimgUrl()||''
// const style = {
//   height: 40,
//   width: 40,
//   lineHeight: "40px",
//   borderRadius: 4,
//   backgroundColor: "#1088e9",
//   color: "#fff",
//   textAlign: "center",
//   fontSize: 14,
// };
const Start = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const loginstore=new LoginStore()
  const {ArticleStore}=useStore()
  const {loginOut}=loginstore;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const styles = {
  //   headerRight: {
  //     float: "right",
  //     display: "flex",
  //     height: 64,
  //     marginRight: 50,
  //   },
  //   headerItem: {
  //     display: "flex",
  //     alignItems: "center",
  //     padding: "0 20px",
  //   },
  //   avatarBox: {
  //     display: "flex",
  //     alignItems: "center",
  //   },
  // };
  // const isFullscreen = false;
  // const toggleFullscreen = () => {
  //   if (screenfull.enabled) {
  //     screenfull.toggle().then(() => {
  //       this.setState({
  //         isFullscreen: screenfull.isFullscreen,
  //       });
  //     });
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      

      const data = await ArticleStore.getArticleList();
      // console.log(data)
      //在没keyword的时候确实可以通过比较获取的和现在的，相同就return，在每次articleStore.articleList值改变的时候渲染一次
      //有keyword的时候就不应该重新获取set了，所以keyword需要进行一个状态提升，mobx
      if(JSON.stringify(ArticleStore.ArticleList) === JSON.stringify(data)){
        return
      }
      if(ArticleStore.keyword==''){//这个判断是为了当我去搜索的时候，有keyword请求回来的列表肯定和现在去获取自己的全部的不相同
        ArticleStore.setArticleList(data)
      }
    };
    // 初始化时获取数据
    fetchData();
  }, [ArticleStore.ArticleList]);
  const items = [
    {
      key: 'mail',
      icon: <HomeFilled />,
      onClick: () => history.push("/list"),
      label: '首页',
    },
    {
      key: 'SubMenu',
      label: '后台管理',
      icon: <SettingOutlined />,
      children: [
        {
          icon: <BarChartOutlined />,
          key: '/',
          label: <Link to="/admin">数据概览</Link>
        },
        {
          icon: <DiffOutlined />,
          key: '/article',
          label: <Link to="/admin/article">内容管理</Link>
        },
        {
          icon: <EditOutlined />,
          key: '/publish',
          label: <Link to="/admin/publish">发布文章</Link>
        },
      ],
    },
    {
      key: 'chat',
      icon: <QqOutlined />,
      onClick: () => history.push("/list"),
      label: '聊天室'
    },
    {
      key: 'about',
      icon: <SketchOutlined />,
      onClick: () => history.push("/about"),
      label: '关于'
    },
    {
      key: 'search',
      label: <SearchButton />
    },
    getToken() ? {
      key: 'login-register',
      className: 'header-right',
      icon: <Avatar size={32} icon={<img src={imgUrl !== 'undefined' ? imgUrl : UserDefaultIcon} alt="用户头像" style={{ width: "100%" }} />} />,
      children: [
        {
          icon:  <DiffOutlined />,
          key: '/list1',
          label: <Uploadx />
        },
        {
          icon: <LogoutOutlined />,
          key: '/list2',
          label: <Link to="/list" onClick={() => loginOut()}>退出登录</Link>
        },
      ],
    } : {
      key: 'search-login',
      className: 'header',
      label: <LoginRegister />
    }
  ];
  return (
    <div className="app-cntainer">
      <Layout>
        <Header>
          <Menu mode="horizontal" defaultSelectedKeys={["home"]} items={items} selectedKeys={[items.key]}>
          </Menu>
          <Outlet />
        </Header>
        <div style={{ height: "30px" }}></div>
        <Layout>
          <Sider height="500px" width="252.8px">
            <aside className="app-sidebar">
            <div style={{ height: "50px" }}></div>
            <img src={(getimgUrl() !== 'undefined' && getimgUrl() !== null) ? getimgUrl() : UserDefaultIcon} className="sider-avatar" alt="" />
              <h2 className="title">{getName()}</h2>
              <ul className="home-pages">
                {Object.entries(SIDEBAR.homepages).map(([linkName, item]) =>
                  linkName === "email" ? (
                    <span key={linkName} onMouseDown={showModal}>
                      {item.icon}
                      <Href href={item.link}>{linkName}</Href>
                      <Divider type="vertical" />
                      <Modal
                        wrapClassName={"email-modal"}
                        title="邮箱"
                        centered="true"
                        style={{
                          top: 20,
                        }}
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                      >
                        <p className="message">163邮箱:SUN030920@163.com</p>
                        <p className="message"> qq邮箱:3115483067@qq.com</p>
                      </Modal>
                    </span>
                  ) : (
                    <span key={linkName}>
                      <Divider type="vertical" />
                      {item.icon}
                      <Href href={item.link}>{linkName}</Href>
                      <Divider type="vertical" />
                    </span>
                  )
                )}
              </ul>

              {<Alert message={"欢迎来到博客系统"} type="info" />}

              <Divider orientation="center"> 文章列表</Divider>
              {Object.entries(ArticleStore.ArticleList).map(([key, article]) => (
                <div key={key}>
                    <Link to={`/list/detail?id=${article.id}`}>{ article.title}</Link>
                </div>
            ))}
            <Divider orientation="center">Tag</Divider>
            <TagBar/>
            </aside>
          </Sider>
        </Layout>
        <Content>
        </Content>
        <Footer></Footer>
      </Layout>
    </div>
  );
};
export default observer(Start);
