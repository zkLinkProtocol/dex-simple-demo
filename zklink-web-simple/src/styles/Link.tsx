import { Stack, styled } from '@mui/material'
import { transientOptions } from './TransientOptions'

export const ModalWrap = styled('div', transientOptions)<{
  $isStartTop?: boolean
}>`
  display: flex;
  align-items: ${(props) => (props.$isStartTop ? 'flex-start' : 'center')};
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(5, 7, 20, 0.6);
  backdrop-filter: blur(4px);
  z-index: 300;
  ${(props) => props.theme.breakpoints.down('md')} {
    // justify-content: flex-end;
    align-items: flex-end;
    background: unset;
  }
`

export const ModalPanel = styled('div', transientOptions)<{
  $width: string
  $isTheme: boolean
}>`
  max-width: ${(props) => props.$width};
  flex: 1;
  margin: 0 16px;
  background: ${(props) => (props.$isTheme ? props.theme.color.bg : '#171A1E')};
  border-radius: 8px;
  box-shadow: 0px 20px 25px -5px rgba(0, 0, 0, 0.1),
    0px 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  ${(props) => props.theme.breakpoints.down('md')} {
    max-width: 100vw;
    width: 100vw !important;
    margin: 0;
    border-radius: 8px 8px 0 0;
  }
`
export const ModalHead = styled('div')`
  padding: 24px 24px 0;
  font-size: 18px;
  line-height: 24px;
  position: relative;
  color: ${(props) => props.theme.color.text100};
`
export const ModalBody = styled('div')`
  border-radius: 8px;
`

export const ContentWrap = styled('div')`
  padding: 16px 16px 24px;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 24px;
  }
`

export const SectionWrap = styled('div')`
  background-color: ${(props) => props.theme.color.bg};
  border: 1px solid ${(props) => props.theme.color.text10};
  border-radius: 4px;
  ${(props) => props.theme.breakpoints.down('md')} {
    border-left: unset;
    border-right: unset;
  }
`

export const SectionTitle = styled(Stack)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  flex: unset;
  width: 100%;
  height: 32px;
  line-height: 1;
  color: ${(props) => props.theme.color.text70};
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  border-bottom: 1px solid ${(props) => props.theme.color.text10};
`

export const SectionTitleTabs = styled(SectionTitle)`
  color: ${(props) => props.theme.color.text40};
  font-weight: 400;
  cursor: pointer;
  .active {
    color: ${(props) => props.theme.color.text70};
    font-weight: 600;
    cursor: default;
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
