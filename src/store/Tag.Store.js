import { makeAutoObservable } from "mobx";
import { http } from "@/utils/http";
import { message } from "antd";
class TagStore {
    selectedTags=[]
    total= 0
    blogDocs=[]
    constructor() {
        makeAutoObservable(this);
    }
    setTotal =(total)=>{
        this.total=total;
    }
    setBlogDocs =(blogDocs)=>{
        this.blogDocs=blogDocs;
    }
    setSelectedTags=(tags)=>{
        this.selectedTags=tags
    }
//获取获得的tag列表数据
    getTagList = async () => {
        const res = await http.get("/art/tagList");
        if (res.code === 200) {
            this.setSelectedTags(res.data)
            return ;
        } else {
            message.error("获取标签数据错误");
        }
    };
    //获取指定tag的数据 ES
    getTagRelated  = async (keyword) => {
        const res = await http.get(`/blog/tags/${keyword}`);
        if (res.code === 200) {
            this.setTotal(res.data.total)
            this.setBlogDocs(res.data.blogDocs)
            return
        } else {
            message.error("获取标签数据错误");
        }
    };

}

export default TagStore;
