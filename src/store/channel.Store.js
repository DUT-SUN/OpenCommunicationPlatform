import { makeAutoObservable } from 'mobx'
import { http } from '@/utils'
import {message} from 'antd'
class ChannelStore {
  channelList = []
  constructor() {
    makeAutoObservable(this)
  }

  loadChannelList = async () => {
    const res = await http.get('/art/channels')
    this.channelList = res.data
  }

}

export default ChannelStore