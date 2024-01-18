import { Fade, Stack, styled } from '@mui/material'
import Loading from 'components/Loading'
import { memo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateModal } from 'store/app/actions'
import { useModal } from 'store/app/hooks'
import { useUnexpiredDepositTransactions } from 'store/deposit/hook'
import { FooterItem } from '../styles'
import { PendingTransactions } from './PendingTransactions'

const Wrap = styled('div')`
  height: 100%;
  flex-direction: row;
  position: relative;
`

const Labels = styled(FooterItem)`
  flex-direction: row;
  height: 100%;
  color: ${(props) => props.theme.color.notificationYellow02};
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${(props) => props.theme.color.notificationYellow02};
  }

  &:hover {
    background-color: ${(props) => props.theme.color.notificationYellow01};
  }
`

const Popup = styled(Stack)`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
`

export const FooterPendingTransactions = memo(() => {
  const dispatch = useDispatch()
  const transactions = useUnexpiredDepositTransactions()
  const modal = useModal('pendingTxs')
  const ref = useRef(null)

  // useOnClickOutside(ref, () => {
  //   dispatch(updateModal({ modal: 'pendingTxs', open: false }))
  // })

  if (!transactions?.length) {
    return null
  }
  return (
    <Wrap>
      <Labels
        onClick={() =>
          dispatch(updateModal({ modal: 'pendingTxs', open: !modal }))
        }>
        <Loading size={12} />
        <span>Deposit Pending ({transactions?.length})</span>
      </Labels>
      <Fade in={modal} timeout={200}>
        <Popup ref={ref}>
          <PendingTransactions />
        </Popup>
      </Fade>
    </Wrap>
  )
})
