import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare } from '@fortawesome/pro-regular-svg-icons/faPenSquare'
export default class FARPenSquare extends React.Component {
  render () {
    return (<FontAwesomeIcon {...this.props} icon={faPenSquare} />)
  }
}
