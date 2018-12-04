import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { ListSubheader } from '@material-ui/core'
import ThemeTools from 'wbui/Themes/ThemeTools'

const styles = (theme) => ({
  root: {
    backgroundColor: ThemeTools.getValue(theme, 'wavebox.popover.section.subheading.backgroundColor'),
    color: ThemeTools.getValue(theme, 'wavebox.popover.section.subheading.color'),
    lineHeight: '40px',
    fontSize: '14px'
  }
})

@withStyles(styles, { withTheme: true })
class TooltipSectionListSubheading extends React.Component {
  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const {
      classes,
      className,
      theme,
      children,
      ...passProps
    } = this.props

    return (
      <ListSubheader
        className={classNames(className, classes.root)}
        {...passProps}>
        {children}
      </ListSubheader>
    )
  }
}

export default TooltipSectionListSubheading
