import { Close } from '@mui/icons-material'
import { Fade, Zoom, styled } from '@mui/material'
import Iconfont from 'components/Iconfont'
import React, { FC } from 'react'
import {
  ActiveCss,
  ModalBody,
  ModalHead,
  ModalMask,
  ModalPanel,
  ModalWrap,
} from 'styles'
import { transientOptions } from 'styles/TransientOptions'

const ButtonClose = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  padding: 13px 16px 13px 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 16px;

  ${ActiveCss}
`
const ModalHeadStyle = styled(ModalHead, transientOptions)<{
  $isTheme: boolean
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  .active-svg {
    display: none;
  }
  color: ${(props) => (props.$isTheme ? props.theme.color.text90 : '#FFFFFF')};
  &:hover {
    svg {
      display: none;
      &.active-svg {
        display: flex;
      }
    }
  }
`
const SvgWrap = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 50%;
  overflow: hidden;
  color: ${(props) => props.theme.color.text90};
  .iconfont {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    color: ${(props) => props.theme.color.bg};
    background-color: ${(props) => props.theme.color.primary30};
  }
`

const ModalLink: FC<{
  isIn: boolean
  width?: string
  onClose?: () => void
  header?: string | null | React.ReactElement
  footer?: null | React.ReactElement
  onHeaderClick?: () => void
  isStartTop?: boolean
  hideCloseBtn?: boolean
  isTheme?: boolean
  children?: React.ReactNode
}> = ({
  isIn,
  width = '420px',
  onClose,
  header,
  children,
  footer = null,
  onHeaderClick,
  isStartTop = false,
  hideCloseBtn = false,
  isTheme = true,
}) => {
  if (!isIn) {
    return null
  }
  return (
    <Fade in={isIn} timeout={200}>
      <ModalWrap $isStartTop={isStartTop}>
        <ModalMask onClick={onClose}></ModalMask>

        <Zoom in={isIn} timeout={100}>
          <ModalPanel
            $width={width}
            $isTheme={isTheme}
            onClick={(event) => event.stopPropagation()}>
            {header ? (
              <ModalHeadStyle
                $isTheme={isTheme}
                onClick={() => onHeaderClick && onHeaderClick()}>
                {onHeaderClick ? (
                  <SvgWrap>
                    <Iconfont name="icon-Back" size={20} />
                  </SvgWrap>
                ) : null}
                {header}
              </ModalHeadStyle>
            ) : null}
            {!hideCloseBtn && (
              <ButtonClose onClick={onClose}>
                <Close
                  sx={{
                    width: 24,
                    height: 24,
                    color: '#9199B1',
                    verticalAlign: 'top',
                  }}
                />
              </ButtonClose>
            )}
            <ModalBody>{children}</ModalBody>
            {footer}
          </ModalPanel>
        </Zoom>
      </ModalWrap>
    </Fade>
  )
}

export default ModalLink
