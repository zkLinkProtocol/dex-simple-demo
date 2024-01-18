import { styled } from '@mui/material'
import { FlexCenter } from 'styles'
import { ReactComponent as FastIcon } from './fast.svg'

const FastWrap = styled(FlexCenter)`
  color: ${(props) => props.theme.color.text40};
  svg {
    margin-right: 0;
  }
`

const FastWithdrawalFlag = () => {
  return (
    <FastWrap>
      <FastIcon />
      <span>Support fast withdrawal</span>
    </FastWrap>
  )
}

export default FastWithdrawalFlag
