import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

import { useMediaQuery } from 'react-responsive'

// components
import { Divider, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

const title = '快速导航'

const List = props => {
  const { list, showTitle = true } = props
  return (
    <ul className='preview'>
      {showTitle && <Divider>{title}</Divider>}
      {list.map(item => (
        <li key={item.id}>
          <Link to={`/article/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * article quick link
 */
const QuickLink = props => {
  const isGreaterThan1300 = useMediaQuery({ query: '(min-width: 1300px)' })
  const { list } = props

  const [drawerVisible, setDrawerVisible] = useState(false)

  return isGreaterThan1300 ? <List list={list} /> : (
    <>
      <div className='drawer-btn' onClick={e => setDrawerVisible(true)}>
        <MenuOutlined className='nav-phone-icon' />
      </div>
      <Drawer
        title={title}
        placement='right'
        closable={false}
        onClose={e => setDrawerVisible(false)}
        visible={drawerVisible}
        getContainer={() => document.querySelector('.app-home')}>
        <List list={list} showTitle={false} />
      </Drawer>
    </>
  )
}

export default QuickLink

