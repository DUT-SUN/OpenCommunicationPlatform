import { message } from "antd";
import { makeAutoObservable } from "mobx";
import {http} from '@/utils/http'
class CommentStore {
    constructor() {
        makeAutoObservable(this);
    }
    //获取评论列表
    getCommentList = async(aid) =>{
        const res = await http.get(`/comment/list/${aid}`);
        if (res.code === 200) {
            return res.data;
        } else {
            message.error("评论异常错误");
        }
    }
    //添加评论
    addComment= async(aid,content,likes,state, comment_id,reply_id,root_id)=>{
        // console.log(reply_id,1111)
        const commentData = {
            aid:  aid,
            content: content,
            state: state,
            likes: likes,
            comment_id:comment_id,
            reply_id: reply_id,
            root_id : root_id
            };
        const res = await http.post(`/comment/add`,commentData);
        if (res.code === 200) {
            return res;
        } else {
            message.error("评论异常错误");
        }
    }
    //删除评论
    delComment= async(aid,comment_id)=>{
        const res = await http.delete(`/comment/${aid}/${comment_id}`);
        if (res.code === 200) {
            return res;
        } else {
            message.error("评论异常错误");
        }
    }
}

export default CommentStore;
