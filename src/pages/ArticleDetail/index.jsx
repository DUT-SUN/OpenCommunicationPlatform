import './index.scss'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { Card, Spin, Tag, Flex, Breadcrumb, Space, message, Input, Button } from 'antd'
import { FloatButton, Divider } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { MdPreview, MdCatalog } from 'md-editor-rt';
import { useLocation } from 'react-router-dom';
import 'md-editor-rt/lib/preview.css';
import { useStore } from '@/store/index'
import { getimgUrl } from '@/utils/img'
import { history } from "@/utils/history";
import { LikeOutlined, MessageOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ReplyCard from './ReplyCard';
import ReplyCardStore from '@/store/ReplyCard.Store'
import { observer } from "mobx-react-lite";

import {
  getfavoriteList,
  getlikeList,
} from '@/utils/userlist'
import { getName } from '@/utils'
import SmoothScroll from 'smooth-scroll';
import { STYLE_PREFIX } from '@ant-design/cssinjs/lib/hooks/useStyleRegister';
import Item from 'antd/es/list/Item';

// 时间格式化
function formatDate(time) {
  // 将输入的时间字符串转换为 "YYYY/MM/DD HH:MM:SS" 格式   - /    - :
  const formattedTime = time.replace(/-/g, '/').substring(0, 10) + ' ' + time.substring(11).replace(/-/g, ':');
  // 将格式化后的时间字符串转换为 Date 对象
  const commentDate = new Date(formattedTime);
  // 获取当前时间
  const now = new Date();
  // 计算时间差，单位为毫秒
  const diff = now - commentDate;
  // 将时间差转换为各种单位
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // 根据时间差返回不同的字符串
  if (diffYears > 0) {
    return `${diffYears}年前`;
  } else if (diffMonths > 0) {
    return `${diffMonths}个月前`;
  } else if (diffWeeks > 0) {
    return `${diffWeeks}周前`;
  } else if (diffDays > 0) {
    return `${diffDays}天前`;
  } else if (diffHours > 0) {
    return `${diffHours}小时前`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`;
  } else {
    return '刚刚';
  }
}


const { TextArea } = Input;
const ArticleDetail = () => {
  //输入框dom元素标记
  const textareaRef = useRef(null);
  const [favoriteList, setFavoriteList] = useState();
  const [likeList, setLikeList] = useState();
  const [favorite, setFavorite] = useState(0);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState(0);
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  const [loading, setLoading] = useState(true);
  const [isFold, setIsFold] = useState(false);
  const { ArticleStore, CommentStore } = useStore()
  const [mode] = useState('preview-only');
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let id = params.get('id');
  const [article, setArticle] = useState(null);
  const [scrollElement] = useState(document.documentElement);
  const toggleFold = () => {
    setIsFold(!isFold);
  };
  const cardStyle = isFold ? { width: "100%", height: "400px", overflowY: 'auto', scrollbarWidth: 'none', /* 针对Firefox */msOverflowStyle: 'none' }
    : { width: "100%" };
  //获取文章数据进行渲染，然后favorite，star，comment是为了动态更新渲染数据存在的
  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await ArticleStore.getArticle(id);
        if (JSON.stringify(res) === JSON.stringify(article)) {
          return;
        }
        setArticle(res);
        setFavorite(res.favorite);
        setStar(res.star);
        setComment(res.comment);
      } catch (error) {
        console.error('Error loading article:', error);
      }
    };

    const loadCommentList = async () => {
      try {
        const res = await CommentStore.getCommentList(id);
        let rootComments = [];
        let subComments = {};

        res.forEach(comment => {
          if (comment.root_id === null) {
            rootComments.push(comment);
          } else {
            if (!subComments[comment.root_id]) {
              subComments[comment.root_id] = [];
            }
            subComments[comment.root_id].push(comment);
          }
        });
        // console.log(rootComments);
        // console.log(subComments)
        setState(prevState => ({
          ...prevState,
          rootComments: rootComments,
          subComments: subComments,
          counters: res.length,
        }));
      } catch (error) {
        console.error('Error loading comment list:', error);
      }
    };

    loadArticle().then(() => {
      loadCommentList().then(() => {
        setLoading(false);
      }).catch(error => {
        console.error('Error in loadCommentList:', error);
      });
    }).catch(error => {
      console.error('Error in loadArticle:', error);
    });

  }, [id, article])
  //我现在需要的是当我点赞数或者收藏数改变的时候需要去重新set likeList。。
  useEffect(() => {
    const fetchData = async () => {
      const res = await ArticleStore.getlikeList();
      setLikeList(res.data)
    };
    fetchData();
  }, [favorite, star]);


  useEffect(() => {
    const fetchData = async () => {
      const res = await ArticleStore.getfavoriteList();
      setFavoriteList(res.data)
    };
    fetchData();
  }, [favorite, star]);

  const IconText = ({ icon, text, id, onClick }) => {
    let color = 'black';
    if (icon === StarOutlined && ((favoriteList && favoriteList.includes(id)) || getfavoriteList().includes(id))) {
      color = 'purple';
    } else if (icon === LikeOutlined && ((likeList && likeList.includes(id)) || getlikeList().includes(id))) {
      color = 'purple';
    }

    return (
      <Space onClick={onClick}>
        {React.createElement(icon, { style: { color } })}
        {text}
      </Space>
    );
  };
  const [state, setState] = useState({
    // hot: 热度排序  time: 时间排序
    tabs: [
      {
        id: 1,
        name: '热度',
        type: 'hot'
      },
      {
        id: 2,
        name: '时间',
        type: 'time'
      }
    ],
    active: 'time',      //排序方式
    rootComments: [],  //根评论数组
    subComments: {},   //子评论数组对象
    comment: '',     //输入框的评论内容
    counters: 0,     //评论数
    replyId: 0,     //回复的评论ID
    rootId: 0,       //回复的根评论ID
    replyContent: '', //回复内容
    replyType: null         //回复对象是主还是子 'root' 'sub'
  })
  const toggleReply = (root_id, reply_id, type) => {
    setState(prevState => ({
      ...prevState,
      rootId: (prevState.rootId === root_id && prevState.replyId === reply_id) ? 0 : root_id,//大脑过载别这么写，reply_id是控制回复框的消失和显现的
      replyId: prevState.replyId = reply_id,
      //rootId是为了后端存储及其插入桶的索引
      replyType: type
    }));
  };

  const handleReplyChange = (event) => {
    setState(prevState => ({
      ...prevState,
      replyContent: event.target.value
    }));
  };

  const switchTab = (type) => {
    setState(prevState => ({
      ...prevState,
      active: type
    }));
  }

  //发往后端的字段
  /*   {
      "uid": "用户ID",  //这个不用发因为token
      "aid": "文章ID",  //这个就是article.id 
      "content": "评论内容", //这个也好搞就是textarea的值 就是state.comment
      "state": "状态值",   //状态值没被阻止或者被封，默认是1就行，但是也要传为后续评论过滤做准备
      "likes": "点赞数",   //点赞数首次添加默认为0就行
      "parent_id": "父评论ID" //这个要发,在这个发送按钮不用发在回复按钮可以发
    } */

  //在提交的时候，因为发表评论的也不能是别人，就是你嘛，然后就是你自己的名字就行，getName（）
  //key在后面是item.id 那么就直接用uuid就行，反正也没啥用
  //添加时间也不用动，后端和前端差不多，而且前端时效性更好
  //这里的attitude要被替换成功点赞数了  错误的 后续维持用户点赞状态也是有用的
  // const getNameLink = () => {
  //   return <a href="#" onClick={(e) => e.preventDefault()}>@{getName()}</a>;
  // };
  const DateFormat = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以要加1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const timeString = `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
    return timeString
  }
  function Comment({ content }) {
    const ref = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (event.target.matches('.jump-link.user')) {
                ReplyCardStore.showDrawer();
                event.preventDefault();
            }
        };

        const element = ref.current;
        element.addEventListener('click', handleClick);

        return () => {
            element.removeEventListener('click', handleClick);
        };
    }, []);

    return <div ref={ref} dangerouslySetInnerHTML={{ __html: content }} />;
}

  const submitComment = async (isCommentBox) => {
    if (isCommentBox) {
      state.rootId = 0;
      state.replyId = 0;
      state.replyContent = '';
    }
    const { replyId, rootId, comment, counters, replyContent, rootComments, subComments, replyType } = state;
    const newComment = {
      id: uuid(),
      username: getName(),
      avater: getimgUrl(),
      content: (rootId === 0) ? comment : (replyType === 'root' ? replyContent : `<a onClick={ReplyCardStore.showDrawer} class="jump-link user" data-user-id="${replyId}">@${state.subComments[state.rootId].find(comment => comment.comment_id === state.replyId).username}</a> ${replyContent}`),
      createtime: DateFormat(),
      attitude: 0
    };
    // console.log(newComment.time)
    if (rootId === 0) {
      // 如果是发表新的主评论
      setState(prevState => ({
        ...prevState,
        counters: counters + 1,
        rootComments: [...rootComments, newComment],
        comment: ''
      }));
    } else {
      // 如果是回复评论
      setState(prevState => ({
        ...prevState,
        counters: counters + 1,
        subComments: {
          ...subComments,
          [rootId]: subComments[rootId] ? [...subComments[rootId], newComment] : [newComment]
        },
        replyContent: ''
      }));
    }

    const rootid = rootId === 0 ? null : rootId;
    const replyid = replyId === 0 ? null : replyId;
    // console.log(111,replyid,rootid);
    setState(prevState => ({
      ...prevState,
      rootId:0,
      replyId :0,
      replyType : null
    }));

    // 这样根评论的回复id和根id就是null了，而子评论就是根ID和根ID，而多级子评论就是根ID和回复评论的ID
    const res = await CommentStore.addComment(article.id, newComment.content, 0, 1, newComment.id, replyid, rootid);
    message.success(res.msg);
  };


  const textareaChange = (e) => {
    setState(prevState => ({
      ...prevState,
      comment: e.target.value
    }));
  }

  const delComment = async (comment_id) => {
    setState(prevState => ({
      ...prevState,
      rootComments: prevState.rootComments.filter(item => item.comment_id !== comment_id),
      counters: prevState.counters - 1
    }));
    //id是上面解析出的文章id
    const res = await CommentStore.delComment(id, comment_id);
    message.success(res.msg)
  }

  const delSubComment = async (root_Id, comment_id) => {
    // 删除子评论
    setState(prevState => ({
      ...prevState,
      subComments: {
        ...prevState.subComments,
        [root_Id]: prevState.subComments[root_Id].filter(item => item.comment_id !== comment_id)
      },
      counters: prevState.counters - 1
    }));
    const res = await CommentStore.delComment(id, comment_id);
    message.success(res.msg)
  }
  // 评论喜爱和不喜爱的处理函数，改变attitude的值，从而动态改变图标的颜色
  // 但是对于评论的点赞数在处理过程中也要分开处理，添加一个starCount字段
  const togglelike = (curItem) => {
    const { attitude, id } = curItem;
    setState(prevState => ({
      ...prevState,
      rootComments: prevState.rootComments.map(item => {
        if (item.id === id) {
          return {
            ...item,
            attitude: attitude === 1 ? -1 : 1
          }
        } else {
          return item;
        }
      })
    }));
  }
  const handleClick = () => {
    // console.log(222)
    textareaRef.current.focus();
  };
  const handleStar = (id) => {
    // console.log(11111)
    const load = async () => {
      let res;
      // console.log(1111,  likeList);
      if (likeList.includes(id)) {
        // 如果已经点赞，那么取消点赞
        res = await ArticleStore.cancelStar(id);
        setStar(star - 1);
      } else {
        // 如果没有点赞，那么添加点赞
        res = await ArticleStore.handleStar(id);
        setStar(star + 1);
      }
      message.success(res.msg)
    }
    load()
  }
  const handleFavorite = (id) => {
    const load = async () => {
      let res;
      if (favoriteList.includes(id)) {
        // 如果已经收藏，那么取消收藏
        res = await ArticleStore.cancelFavorite(id);
        setFavorite(favorite - 1);
      } else {
        // 如果没有收藏，那么添加收藏
        res = await ArticleStore.handleFavorite(id);
        setFavorite(favorite + 1);
      }
      message.success(res.msg)
    }
    load()
  }
  // const handleComment=()=>{

  // }

  return (
    //为了让滚动条在最上层
    <div className="headerRight"   >
      {!loading &&
        <Card
          title={
            <div>
              <Breadcrumb separator=">"
                items={[
                  { title: <a onClick={() => history.push('/list')}>文章列表</a> }
                  ,
                  {
                    title: <>     {article.title}
                      {article && article.type && article.type.split(',').map((tag, index) => (
                        <Tag color={colors[index % colors.length]} key={tag} style={{ margin: '0 5px' }} >
                          {tag}
                        </Tag>
                      ))}</>
                  }
                ]} />
            </div>
          }
          extra={<a href="#" onClick={toggleFold}>{isFold ? 'More' : 'Fold'}</a>}
          style={cardStyle}
        >
          <MdCatalog editorId={`article-${article.id}`} scrollElement={scrollElement} style={{ height: 'auto' }} />
          <MdPreview editorId={`article-${article.id}`} modelValue={article.content} />
          <div className="icon">
            <IconText
              icon={StarOutlined}
              text={favorite}
              onClick={() => handleFavorite(article.id)}
              id={article.id}
              key="list-vertical-star-o"
            />
            <IconText
              icon={LikeOutlined}
              text={star}
              onClick={() => handleStar(article.id)}
              id={article.id}
              key="list-vertical-like-o"
            />
            <IconText
              icon={MessageOutlined}
              text={comment}
              onClick={() => handleClick()}
              id={article.id}
              key="list-vertical-message"
            />

          </div>
        </Card>

      }
      <Card className="commentList">
        <div className="comment-container">
          {/* 评论数 */}
          <div className="comment-head">
            <span>{state.counters} 评论</span>
          </div>
          {/* 排序 */}
          <div className="tabs-order">
            <ul className="sort-container">
              {
                state && state.tabs && state.tabs.map(tab => (
                  <li
                    onClick={() => { switchTab(tab.type) }}
                    key={tab.id}
                    className={tab.type === state.active ? 'on' : ''}
                  >按{tab.name}排序</li>
                ))
              }
            </ul>
          </div>

          {/* 添加评论 */}
          <div className="comment-send">
            <div className="user-face">
              <img className="user-head" src={getimgUrl()} alt="" />
            </div>
            <div className="textarea-container">
              <textarea
                ref={textareaRef}
                cols="80"
                rows="5"
                placeholder="发条友善的评论"
                className="ipt-txt"
                value={state.comment}
                onChange={textareaChange}
              />
              <button className="comment-submit"
                onClick={() => { submitComment(true) }}
              >发表评论</button>
            </div>
            {/* <div className="comment-emoji">
            <i className="face"></i>
              <span>    <Picker data={data} onEmojiSelect={console.log} />  </span>
            </div> */}
          </div>
          {/* 评论列表 */}
          <div className="comment-list">
            {//item.id现在就是数据库的id没啥用其实，当个key也无所谓     
              state && state.rootComments && state.rootComments.map(item => (
                <div className="list-item" key={item.id}>
                  <div className='rootComment'>
                    <div className="user-face">
                      <img className="user-head" src={item.avater} alt="" />
                    </div>
                    <div className="comment">
                      <div className="user">{item.username} <span>IP属地: {item.address?item.address:"中国"}</span></div>
                      <p className="text">{item.content}</p>
                      <div className="info">
                        <span className="time">{formatDate(item.createtime)}</span>
                        <span onClick={() => { togglelike(item) }}
                          className={item.attitude === 1 ? 'like liked' : 'like'}>
                          <i className="icon" />{item.likes}
                        </span>
                        <span onClick={() => { togglelike(item) }} className={item.attitude === -1 ? 'hate hated' : 'hate'}>
                          <i className="icon" />
                        </span>
                        <span className="reply btn-hover" onClick={() => { toggleReply(item.comment_id, item.comment_id, 'root') }}>回复</span>
                        <span className="reply btn-hover" onClick={() => { delComment(item.comment_id) }}>删除</span>
                      </div>
                    </div>
                  </div>
                  {/* 渲染子评论 */}
                  {
                    state.subComments[item.comment_id] && state.subComments[item.comment_id].map((subItem, index, array) => (
                      <div className="reply-input" style={{ paddingLeft: '80px' }} key={subItem.id}>
                        <div className="sub-face">
                          <img className="sub-head" src={item.avater} alt="" />
                        </div>
                        <div className="sub-user">{subItem.username} IP属地: {subItem.address?subItem.address:"中国"}</div>
                        <div className="sub-text">  <Comment content={subItem.content} key={subItem.comment_id} /></div>
                        <div className="info">
                          <span className="time">{formatDate(subItem.createtime)}</span>
                          <span onClick={() => { togglelike(subItem) }}
                            className={subItem.attitude === 1 ? 'like liked' : 'like'}>
                            <i className="icon" />{item.likes}
                          </span>
                          <span onClick={() => { togglelike(subItem) }} className={subItem.attitude === -1 ? 'hate hated' : 'hate'}>
                            <i className="icon" />
                          </span>
                          <span className="reply btn-hover" onClick={() => { toggleReply(item.comment_id, subItem.comment_id, 'sub') }}>回复</span>
                          {subItem.username === getName() ? <span className="reply btn-hover" onClick={() => { delSubComment(item.comment_id, subItem.comment_id) }}>删除</span> : null}
                        </div>
                        {index !== array.length - 1 && <Divider />}
                        {/* ...其他的子评论内容... */}
                      </div>
                    ))
                  }
                  {/* //这里的判断是回复框的显现第一种是满足回复的评论是主评论然后回复的主评论的id就是这个item的id（遍历的item），为了避免你点击一个回复但是每个根评论底下都出现了回复框
                  //第二种情况是 回复是子评论， 回复是子评论的话，但是那显现的逻辑是什么呢，是要满足对应根评论id的子评论桶里包含这个子评论的回复id才显现，
                  //但是如果我回复的id设置成父的id的话，确实是方便后端存储以及前端展示了，但是在这里的判断就会导致父id的桶里因为肯定不存在父id的数据，报错，我现在需要解决的就是这里的判断问题
                  //首先1要满足回复某个子评论的时候，其他父评论底下不会出现回复框，2要满足点击回复可以出现回复框
                    const toggleReply = (id, type) => {
                  //   setState(prevState => ({
                  //     ...prevState,
                  //     replyId: prevState.replyId === id ? 0 : id,
                  //     replyType: prevState.replyId === id ? null : type
                  //   }));
                  // };
                  // 在回复子评论的时候，传来的id我设置成item.id了，意思就是明明是回复对应子评论的id被我改成父评论的id了
                  // const submitComment = async () => {
                  //   const { replyId, comment, counters, replyContent, rootComments, subComments ,replyType} = state;
                  //   const newComment = {
                  //     id: uuid(),
                  //     author: getName(),
                  //     avatar: getimgUrl(),
                  //     comment: (replyId === 0) ? comment : (replyType === 'root' ?replyContent : `${getNameLink()} ${replyContent}`),
                  //     time: new Date(),
                  //     attitude: 0
                  //   };
                  //   if (replyId === 0) {
                  //     // 如果是发表新的主评论
                  //     setState(prevState => ({
                  //       ...prevState,
                  //       counters: counters + 1,
                  //       rootComments: [...rootComments, newComment],
                  //       comment: ''
                  //     }));
                  //   } else {
                  //     // 如果是回复评论
                  //     setState(prevState => ({
                  //       ...prevState,
                  //       counters: counters + 1,
                  //       subComments: {
                  //         ...subComments,
                  //         [replyId]: subComments[replyId] ? [...subComments[replyId], newComment] : [newComment]
                  //       },
                  //       replyContent: ''
                  //     }));
                  //   }
                  //   const parentId = replyId === 0 ? null : replyId;
                  //   const res = await CommentStore.addComment(article.id, newComment.comment, 0, 1, newComment.id, parentId);
                  //   message.success(res.msg);
                  // };
                  //改完之后，就会导致[replyId]: subComments[replyId] 主评论的桶里出现一个新的数据，好像也没啥问题
                  //改完之后，确实state.subComments[item.id].some(comment => comment.id === state.replyId))主评论的桶里确实有啊
                  //为啥不显示呢，可是原来是传的时候不传item.id传subItem.id就能正常显示回复框，但是不显示子评论的子评论，有点懵了 */}
                  {
                    (state.rootId === item.comment_id)
                      ?
                      (
                        /* 当回复按钮被点击时，显示输入框 */
                        <div className="reply-input" style={{ paddingLeft: state.replyType === 'root' ? '80px' : '120px' }}>
                          <TextArea
                            value={state.replyContent}
                            onChange={handleReplyChange}
                            placeholder={state.replyId==item.comment_id ?   '善语结善缘，恶语伤人心 ！'   :  `回复 @${state.subComments[state.rootId].find(comment => comment.comment_id === state.replyId).username}`}
                            //这里在渲染的时候需要动态改变
                            autoSize={{
                              minRows: 3,
                              maxRows: 5,
                            }}
                          />
                          <Button onClick={() => submitComment(false)}>提交回复</Button>
                        </div>
                      ) : null
                  }
                </div>
              ))
            }

          </div>

        </div>

      </Card>
      <ReplyCard />
      {/* <div style={{height:'700px'}}></div> */}
    </div>)
}


export default observer(ArticleDetail)
