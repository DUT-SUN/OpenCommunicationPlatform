import React from 'react'
import withRouter from '@/utils/withRouter'
import PropTypes from 'prop-types'
import {  Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Tag, Divider } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { FolderOutlined } from '@ant-design/icons'

function getColor(name, colorList) {
  const target = colorList.find(c => c.name === name)
  return target ? target.color : ''
}

const ArticleTag = props => {
  const tagColorList = useSelector(state => state.article.tagList) // 相当于 connect(state => state.article.tagList)(ArticleTag)
  const { tagList, categoryList } = props

  return (
    <>
      {tagList.length > 0 && (
        <>
          <Divider type='vertical' style={{ marginRight: 7 }} />
          <SvgIcon type='icontags' style={{ marginRight: 7 }} />
          {tagList.map((tag, i) => (
            <Tag key={i} color={getColor(tag.name, tagColorList)}>
              <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
            </Tag>
          ))}
        </>
      )}
      {categoryList.length > 0 && (
        <>
          <Divider type='vertical' style={{ marginRight: 7 }} />
          <FolderOutlined style={{ marginRight: 7 }} />
          {categoryList.map((cate, i) => (
            <Tag key={i} color='#2db7f5'>
              <Link to={`/categories/${cate.name}`}>{cate.name}</Link>
            </Tag>
          ))}
        </>
      )}
    </>
  )
}

ArticleTag.propTypes = {
  tagList: PropTypes.array.isRequired,
  categoryList: PropTypes.array.isRequired
}

export default withRouter(ArticleTag)
