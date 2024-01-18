import { css, styled } from '@mui/material'
import { MuiThemeType, themeValue } from './Themes'

export const Flex = styled('div')`
  display: flex;
`
export const FlexItem = styled('div')`
  flex: 1;
`
export const FlexColumn = styled(Flex)`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
`
export const FlexStart = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
`
export const FlexEnd = styled(Flex)`
  align-items: center;
  justify-content: flex-end;
`
export const FlexCenter = styled(Flex)`
  align-items: center;
  justify-content: center;
`
export const FlexBetween = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`
export const FlexAround = styled(Flex)`
  align-items: center;
  justify-content: space-around;
`
export const FlexAlignCenter = styled('div')`
  display: flex;
  align-items: center;
`
export const FlexAlignEnd = styled(FlexColumn)`
  align-items: flex-end;
`

export const Space4 = styled('div')`
  height: 4px;
  line-height: 4px;
  font-size: 0;
`
export const Space6 = styled('div')`
  height: 6px;
  line-height: 6px;
  font-size: 0;
`
export const Space8 = styled('div')`
  height: 8px;
  line-height: 8px;
  font-size: 0;
`
export const Space12 = styled('div')`
  height: 12px;
  line-height: 12px;
  font-size: 0;
`
export const Space16 = styled('div')`
  height: 16px;
  line-height: 16px;
  font-size: 0;
`
export const Space24 = styled('div')`
  height: 24px;
  line-height: 24px;
  font-size: 0;
`
export const Space10 = styled('div')`
  height: 10px;
  line-height: 10px;
  font-size: 0;
`
export const Space20 = styled('div')`
  height: 20px;
  line-height: 20px;
  font-size: 0;
`
export const Space30 = styled('div')`
  height: 30px;
  line-height: 30px;
  font-size: 0;
`
export const Space40 = styled('div')`
  height: 40px;
  line-height: 40px;
  font-size: 0;
`
export const Wing8 = styled('div')`
  padding: 0 8px;
`
export const Wing10 = styled('div')`
  padding: 0 10px;
`
export const Wing20 = styled('div')`
  padding: 0 20px;
`
export const Wing40 = styled('div')`
  padding: 0 40px;
`
export const ActiveCss = css`
  cursor: pointer;
  &:active {
    opacity: 0.85;
    transform: translateY(1px);
    box-shadow: none;
  }
`
export const TextEllipsis = css`
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const ModalMask = styled('div')`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    background: ${themeValue(
      'rgba(255, 255, 255, 0.16)',
      'rgba(0, 0, 0, 0.16'
    )};
  }
`
export const DropContentStyle = styled('div')`
  background: ${(props) => props.theme.color.bg}!important;
  margin-top: 4px;
  border-radius: 8px;
  border: ${(props) =>
    props.theme.palette.mode === MuiThemeType.dark
      ? '1px solid #485158'
      : 'none'};
  box-shadow: 0px 4px 6px -2px rgba(0, 0, 0, 0.04),
    0px 10px 15px -3px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.12) !important;
`
