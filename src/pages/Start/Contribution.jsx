import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
// components
import { Divider} from 'antd'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import {http} from '@/utils/http'
import useAjaxLoading from '@/hooks/useAjaxLoading'
import './index.scss'
const title = 'github contribution'

const ContributionChart = props => {
  const { showTitle = true } = props
  const [contributions, setContributions] = useState([])
  const [loading, withLoading] = useAjaxLoading()
  useEffect(() => {
    http.get(`/user/github/contributions`)
      .then(res => {
        setContributions(res.data)
      })
      .catch(e => {
        ;
      })
  }, [])
  const isGreaterThan1300 = useMediaQuery({ query: '(min-width: 1300px)' })
  return (
    contributions.length > 0 && isGreaterThan1300 ? <ul className='github'>
      {showTitle && <Divider>{title}</Divider>}
      <CalendarHeatmap
        startDate={contributions.length > 0 ? new Date(contributions[0].date) : new Date('2021-01-01')}
        endDate={contributions.length > 0 ? new Date(contributions[contributions.length - 1].date) : new Date('2021-12-31')}
        values={contributions.length > 0 ? contributions : []}
        classForValue={value => {
          if (!value) {
            return 'color-empty'
          }
          return `color-github-${value.count}`
        }}
      />
    </ul> : null
  )
}

export default ContributionChart
