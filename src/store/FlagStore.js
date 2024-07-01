import { makeAutoObservable } from 'mobx';

class FlagStore {
    flag = true;

    constructor() {
        makeAutoObservable(this);
    }

    Setflag = () => {
        this.flag = !this.flag;
    };
}

export default new FlagStore();
