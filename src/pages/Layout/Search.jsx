import React, { useState } from 'react'
import { Input, Row } from 'antd'
import {  useLocation } from 'react-router-dom'
import useMount from '@/hooks/useMount'
import { decodeQuery } from '@/utils'
import { SearchOutlined } from '@ant-design/icons'
import {history} from '@/utils/history'
import _ from 'lodash';
import './index.scss'
import { useStore } from '@/store'
import { useEffect } from 'react'
import { AutoComplete } from 'antd';
const SearchButton = (props) => {
  const { ArticleStore } = useStore();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(false);
  const debouncedAutoComplete = _.debounce(ArticleStore.getSuggestion, 300);

  useMount(() => {
    const { keyword } = decodeQuery(location.search);
    keyword && setKeyword(keyword);
  });

  const handleChange = (value) => {
    setKeyword(value);
    debouncedAutoComplete(value);
  };

  useEffect(() => {
    // console.log(ArticleStore.suggestions);
  }, [ArticleStore.suggestions]);

  const handlePress = (e) => {
    // console.log(e);
    setKeyword(e)
    setSelected(!selected)
  };
  useEffect(() => {
    //当标志位改变，意味着发送请求
    if (keyword) history.push(`/list?keyword=${decodeURIComponent(keyword)}`)//这个函数不能放到set之后直接去调用，因为set是异步的
  },[selected])

  return (
    <div className='search-box'>
<SearchOutlined className='search-icon' onClick=
      {e => keyword==''?history.push('/list'):history.push(`/list?keyword=${decodeURIComponent(keyword)}`)} />
      <AutoComplete
        value={keyword}
        options={ArticleStore.suggestions.map((suggestion) => ({ value: suggestion }))}
        onChange={handleChange}
        onSelect={handlePress}
        className='search-input'
        placeholder='搜索文章'
        style={{ width: 400 }}
      />
    </div>
  );
};


export default SearchButton
