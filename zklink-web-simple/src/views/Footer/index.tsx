import { memo } from 'react'
import { isProduction } from '../../config'
import { FooterPendingTransactions } from './DepositTransactions'
import { FooterColumn, FooterItem, FooterWrap } from './styles'

export const Footer = memo(() => {
  return (
    <FooterWrap>
      <FooterColumn>
        <FooterItem>
          {isProduction ? null : `Building with ${process.env.REACT_APP_ENV}`}
        </FooterItem>
        <FooterPendingTransactions />
      </FooterColumn>
    </FooterWrap>
  )
})
