import { makeAutoObservable } from "mobx";
import { http } from "@/utils/http";
import {message} from 'antd'
class ReplyCardStore {
    open=false
    setOpen =(open)=>{
        this.open=open
    }
    showDrawer = () => {
        this.setOpen(true);
    };
    onClose = () => {
        this.setOpen(false);
    };
    constructor() {
        makeAutoObservable(this);
    }
}

export default new ReplyCardStore();
