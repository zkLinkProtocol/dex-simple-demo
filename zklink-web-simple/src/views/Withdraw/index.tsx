import { isAddress } from 'ethers/lib/utils'
import { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAddress } from 'store/app/hooks'
import {
  updateIsFocus,
  updateIsUseAddressBook,
  updateShowAddAddress,
  updateWidthAddress,
} from 'store/withdraw/actions'
import {
  useAddressBookList,
  useWithdrawAddress,
  useWithdrawLayoutType,
} from 'store/withdraw/hook'
import { WithdrawLayoutType } from 'store/withdraw/types'
import { MainWrap } from 'views/Main/styles'
import { WithdrawHistory } from 'views/WithdrawHistory'
import WithdrawMain from './WithdrawMain'

const Withdraw = memo(() => {
  const dispatch = useDispatch()
  const myAddress = useAddress()
  const layoutType = useWithdrawLayoutType()
  const addressBookList = useAddressBookList()
  const address = useWithdrawAddress()

  useEffect(() => {
    if (layoutType === WithdrawLayoutType.Withdraw) {
      dispatch(updateWidthAddress(myAddress))

      dispatch(updateIsFocus(false))
    }

    if (layoutType === WithdrawLayoutType.Transfer) {
      dispatch(updateWidthAddress(''))

      dispatch(updateIsFocus(true))
      dispatch(updateIsUseAddressBook(false))
    }
  }, [myAddress, layoutType])
  useEffect(() => {
    if (!address || !isAddress(address) || address === myAddress) {
      dispatch(updateShowAddAddress(false))
      return
    }
    const flag = addressBookList.find((item) => item.address === address)
    if (flag) {
      dispatch(updateShowAddAddress(false))
    } else {
      dispatch(updateShowAddAddress(true))
    }
  }, [address, addressBookList])

  return (
    <MainWrap>
      <WithdrawMain myAddress={myAddress} />
      <WithdrawHistory />
    </MainWrap>
  )
})

export default Withdraw
