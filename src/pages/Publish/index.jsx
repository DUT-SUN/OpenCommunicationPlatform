import {
  Card,
  Breadcrumb,
  Button
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './index.scss'
import MarkDownDoc from './MarkDownDoc'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'
import PublishForm from './Form'
import PublishStore from '@/store/Publish.Store'
import { useParams } from 'react-router-dom';
const Publish = () => {
  const { id } = useParams();

  return (
    <div className="article-contianer">
      <Card
        title={
          <Breadcrumb separator=">"
            items={[
              { title: <Link to="/admin">后台管理</Link> }
              ,
              {
                title: <Button onClick={PublishStore.showModal}>
                  {id ? '编辑' : '发布'}文章
                </Button>
              }
            ]} />
        }
      >
        <MarkDownDoc />
      </Card>
      <PublishForm />
    </div>
  )
}

export default observer(Publish)