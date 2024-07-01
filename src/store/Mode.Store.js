import { makeAutoObservable } from 'mobx';
import { http } from '@/utils';
//用来状态提升共享
class ModeStore {
    mode ='preview-only'
    setMode=(mode)=>{
        this.mode=mode
    }
    constructor() {
        makeAutoObservable(this);
    }

}

export default new ModeStore();
