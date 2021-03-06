import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '../../buttons'
import { Pane } from '../../layers'
import { Heading } from '../../typography'
import OptionsList from './OptionsList'
import OptionShapePropType from './OptionShapePropType'

export default class SelectMenuContent extends PureComponent {
  static propTypes = {
    close: PropTypes.func,
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    options: PropTypes.arrayOf(OptionShapePropType),
    hasTitle: PropTypes.bool,
    hasFilter: PropTypes.bool,
    listProps: PropTypes.shape(OptionsList.propTypes),

    /**
     * Node that is placed right next to the options.
     */
    detailView: PropTypes.node
  }

  static defaultProps = {
    options: [],
    hasTitle: true,
    hasFilter: true
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyUp = e => {
    if (e.keyCode === 38) {
      this.handleArrowUp()
    }

    if (e.keyCode === 40) {
      this.handleArrowDown()
    }

    if (e.keyCode === 13) {
      this.handleEnter()
    }
  }

  getCurrentIndex() {
    const { options, listProps } = this.props
    const { selected } = listProps

    return options.findIndex(option => option.value === selected[0])
  }

  handleArrowUp() {
    const { options, listProps } = this.props
    const { onSelect } = listProps

    let nextIndex = this.getCurrentIndex() - 1

    if (nextIndex < 0) {
      nextIndex = options.length - 1
    }

    onSelect(options[nextIndex])
  }

  handleArrowDown() {
    const { options, listProps } = this.props
    const { onSelect } = listProps

    let nextIndex = this.getCurrentIndex() + 1

    if (nextIndex === options.length) {
      nextIndex = 0
    }

    onSelect(options[nextIndex])
  }

  handleEnter() {
    const isSelected = this.getCurrentIndex() === -1

    if (isSelected) {
      this.props.close()
    }
  }

  render() {
    const {
      width,
      height,
      options,
      hasTitle,
      hasFilter,
      close,
      title,
      listProps,
      detailView
    } = this.props

    const headerHeight = 40
    const optionsListHeight = hasTitle ? height - headerHeight : height
    const hasDetailView = Boolean(detailView)

    return (
      <Pane display="flex" height={height}>
        <Pane
          width={width}
          height={height}
          display="flex"
          flexDirection="column"
          {...(hasDetailView
            ? {
                borderRight: 'muted'
              }
            : {})}
        >
          {hasTitle && (
            <Pane
              display="flex"
              alignItems="center"
              borderBottom="muted"
              padding={8}
              height={headerHeight}
              boxSizing="border-box"
            >
              <Pane flex="1">
                <Heading size={400}>{title}</Heading>
              </Pane>
              <IconButton
                icon="close"
                appearance="ghost"
                height={24}
                onClick={close}
              />
            </Pane>
          )}
          <OptionsList
            height={optionsListHeight}
            hasFilter={hasFilter}
            options={options}
            {...listProps}
          />
        </Pane>
        {hasDetailView && detailView}
      </Pane>
    )
  }
}
