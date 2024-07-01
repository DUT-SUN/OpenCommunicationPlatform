import { makeAutoObservable } from 'mobx';
import { http } from '@/utils';

class CaptchaStore {
    captchaImg = '';
    userKey = '';

    constructor() {
        makeAutoObservable(this);
    }

    getCaptcha = async () => {
        // 调用接口获取验证码图片和用户密钥
        const res = await http.get('/user/captcha');
        console.log( res.data.captcherImg)
        this.captchaImg = res.data.captcherImg;
        this.userKey = res.data.userKey;
    };
}

export default new CaptchaStore();
