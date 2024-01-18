import { Stack, styled } from '@mui/material'

export const FooterWrap = styled(Stack)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  color: #454e68;
  font-size: 12px;
  padding: 0 12px;
  background: ${(props) => props.theme.color.bg};
  border-top: 1px solid ${(props) => props.theme.color.text10};
  z-index: 10;
  position: fixed;
  bottom: 0;

  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`

export const FooterColumn = styled(Stack)`
  flex-direction: row;
  align-items: center;
  height: 100%;
`
export const FooterItem = styled(Stack)`
  flex-direction: row;
  align-items: center;
  line-height: 1;
  padding: 0 8px;
  gap: 4px;
  color: ${(props) => props.theme.color.text90};

  a {
    color: ${(props) => props.theme.color.text90};
  }

  .iconfont,
  &:hover,
  a:hover {
    color: ${(props) => props.theme.color.primary30};
  }
`
