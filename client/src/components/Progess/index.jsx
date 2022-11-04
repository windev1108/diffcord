import { Progress } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const Progess = ({ percent }) => {
  return (
    <div className="fixed top-[-4px] left-0 right-0 z-50">
        <Progress
         strokeColor={{
             "0%": "#108ee9",
             "100%": "#87d068",
           }}
        showInfo={false} percent={percent} />
    </div>
  )
}

export default Progess

Progess.propTypes = {
    percent: PropTypes.number.isRequired
}

