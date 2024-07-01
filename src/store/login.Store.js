// login module
import { makeAutoObservable, set } from 'mobx'
import { http, setToken, getToken, removeToken, removeName ,setName} from '@/utils'
import { message } from 'antd'
import CaptchaStore from './Captcha.Store'
import { removeimgUrl,setimgUrl } from '@/utils/img'
import { history } from '@/utils/history'

class LoginStore {
  token = getToken() || ''
  constructor() {
    // 响应式
    makeAutoObservable(this)
  }
  getReg = async ({ username, password }) => {
    console.log(username,password)
    // 调用注册接口
    const res = await http.post('/user/reg', {
      username, password
    })
    let mes = res.msg;
    // console.log(mes)
    // this.token = res.data.token
    // setToken(this.token)
    // console.log(res.code)
    //当用户名相同的时候
    if(res.code === 409){
      message.error(mes)
      return
    }
    message.success(mes)
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
  getToken = async ({ username, password, captcha }) => {
    console.log(username, password, captcha);
    // 创建一个URLSearchParams对象
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('code', captcha);
    params.append('userKey',CaptchaStore.userKey)
    console.log(CaptchaStore.userKey)
    // 调用登录接口
    const res = await http.post('/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    let mes = res.msg;
    this.token = res.data.token
    setToken(this.token)
    message.success(mes);
    await this.getUserByToken()
    await this.sleep(2000)
    history.push('/list'); // 在这里跳转到/list页面
    window.location.reload();
  };
  getUserByToken= async()=>{
    const res = await http.get('/user/getUserByToken');
    // console.log(res)
    let address=res.data.address
    // console.log(address)
    setName(res.data.username)
    setimgUrl(res.data.avater)
    if(address!=null){
      message.success('上一次登录地址为:'+address)
    }
  }
  
  
  // 退出登录
  loginOut = () => {
    this.token = ''
    this.name = ''
    removeToken()
    removeName()
    removeimgUrl()
  }

}

export default LoginStore