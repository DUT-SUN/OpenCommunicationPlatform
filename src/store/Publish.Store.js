import { makeAutoObservable } from "mobx";
import { http } from "@/utils/http";
import { message } from "antd";
class PublishStore {
    // 文章内容
    content =
        '## <img src="https://cdn.jsdelivr.net/gh/DUT-SUN/myImg/img/202404061538098.png" width="40" height="40">要不写点东西 <img src="https://cdn.jsdelivr.net/gh/DUT-SUN/myImg/img/202404061538364.png"  width="40" height="40"/>   ';
    // 控制modal
    visible = false;
    constructor() {
        makeAutoObservable(this);
    }

    setVisible = (visible) => {
        this.visible = visible;
    };
    setContent = (content) => {
        this.content = content;
    };
    showModal = () => {
        // console.log(11111)
        this.setVisible(true);
    };

    handleOk = () => {
        this.setVisible(false);
    };

    handleCancel = () => {
        this.setVisible(false);
    };

    addArticle = async (title, content, description, selectedTags, avatars) => {
        const res = await http.post("/art/add", {
            title,
            content,
            description,
            selectedTags,
            avatars,
        });
        return res
        // let mes = res.msg;
        // message.success(mes);
    };
    updateArticle  = async (aid,title, content, description, selectedTags, avatars) =>{
        const res = await http.put("/art/update", {
            aid,
            title,
            content,
            description,
            selectedTags,
            avatars,
        });
    }
}

export default new PublishStore();
