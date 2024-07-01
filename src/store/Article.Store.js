import { makeAutoObservable, reaction } from "mobx";
import { http } from "@/utils";
import { message } from "antd";
import {
    setfavoriteList,
    setlikeList,
}from '@/utils/userlist'
class ArticleStore {
    // 全部文章，这是放到旁边看的
    ArticleList = [];
    // 搜索后显示的分页文章列表，添加原因是后端接口有分页，然后前端如果直接修改上面的文章列表会导致左侧文章栏页跟着改变了
    suggestions = [];
    PageArticleList = [];
    keyword=''
    
    constructor() {
        makeAutoObservable(this);
    }
    setKeyword =(keyword)=>[
        this.keyword=keyword
    ]
    setArticleList = (list) => {
        this.ArticleList = list;
    };
    setSuggestions = (suggestions) => {
        this.suggestions = suggestions;
    };
    setPageArticleList = (list) => {
        this.PageArticleList = list;
    };
    getlikeList=async()=>{
        const res = await http.get(`/art/likeList`);
        if (res.code === 200) {
            setlikeList(res.data)
            return res;
        } else {
            message.error("点赞列表异常错误");
        }
    }
    getfavoriteList=async()=>{
        const res = await http.get(`/art/favoriteList`);
        if (res.code === 200) {
            setfavoriteList(res.data)
            return res;
        } else {
            message.error("收藏异常错误");
        }
    }
    //点赞
    handleStar = async (articleid) => {
        // console.log(articleid)
        const res = await http.get(`/art/${articleid}/like`);
        if (res.code === 200) {
            return res;
        } else {
            message.error("点赞异常错误");
        }
    };
    cancelStar= async (articleid) => {
        // console.log(articleid)
        const res = await http.delete(`/art/${articleid}/like`);
        if (res.code === 200) {
            return res;
        } else {
            message.error("取消点赞错误");
        }
    };
    increaseRount = async (id) => {
        const res = await http.get(`/art/incr-rcount?id=${id}`);
        if (res.code === 200) {
            return;
        }
    }
    cancelFavorite= async (articleid) => {
        const res = await http.delete(`/art/${articleid}/favorite`);
        if (res.code === 200) {
            return res;
        } else {
            message.error("取消收藏错误");
        }
    };


    handleFavorite = async (articleid) => {
        const res = await http.get(`/art/${articleid}/favorite`);
        if (res.code === 200) {
            return res;
        } else {
            message.error("收藏异常错误");
        }
    };

    getArticleList = async () => {
        const res = await http.get("/art/mylist");
        if (res.code === 200) {
            return res.data; // 返回后端返回的数组
        } else {
            message.error("Failed to get Article list");
        }
    };
    getKeywordList=async(keyword,page,size)=>{
        const json = {
            key:keyword,
            page:page,
            size:size        
            };
        const res = await http.post("/blog/filters",json);
        if (res.code === 200) {
            return res.data; 
        } else {
            message.error("Failed to get Article list");
        }
    }

    //获取分页搜索的key文章列表
    getPageArticles = async (keyword, page, pageSize) => {
        const res = await http.get(
            `"/blog/filter?key=${keyword}&page=${page}&size=${pageSize}"`
        );
        if (res.code === 200) {
            return res.data; // 返回后端返回的数组
        } else {
            message.error("Failed to get Article list");
        }
    };
    getArticle = async (id) => {
        const res = await http.get(`/art/detail?id=${id}`);
        if (res.code === 200) {
            return res.data;
        } else {
            message.error("Failed to get Article list");
        }
    };
    delArticle = async (aid) => {
        const res = await http.delete(`/art/del?aid=${aid}`);
        if (res.code === 200) {
            return res;
        } else {
            message.error("失败删除文章");
        }
    };
    // {
    //     "code": 200,
    //     "msg": "成功",
    //     "data": [
    //         "第5篇",
    //         "第6篇",
    //         "第8篇",
    //         "第9篇"
    //     ]
    // }
    //获取ES的自动补全结果
    getSuggestion = async (keyword) => {
        const res = await http.get(`/blog/suggestion?key=${keyword}`);
        if (res.code === 200) {
            this.setSuggestions(res.data);
        } else {
            message.error("Failed to get Article list");
        }
    };
}
export default ArticleStore;
