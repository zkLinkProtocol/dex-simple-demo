import i18n from 'i18n'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'
import {
  updateAddOrEditAddress,
  updateIsAddOrEditAddressBook,
  updateTitleName,
} from 'store/withdraw/actions'
import { useWithdrawAddress } from 'store/withdraw/hook'
import { Space12 } from 'styles'
import { AddressDetectedWrap } from './style'

const WithdrawAddAddress: FC = memo(({}) => {
  const dispatch = useDispatch()
  const address = useWithdrawAddress()

  return (
    <>
      <Space12 />
      <AddressDetectedWrap
        onClick={() => {
          dispatch(updateIsAddOrEditAddressBook(0))

          dispatch(
            updateTitleName(
              i18n.t('address-book-wallet-add-address', {
                defaultValue: 'Add address',
              })
            )
          )
          dispatch(updateAddOrEditAddress(address as string))
        }}>
        {i18n.t('withdraw-address-detected', {
          defaultValue: 'New address detected! ',
        })}
        <span>
          {i18n.t('withdraw-address-tap', {
            defaultValue: 'Tap',
          })}
        </span>
        {i18n.t('withdraw-address-to-add', {
          defaultValue: ' to add to your address book.',
        })}
      </AddressDetectedWrap>
    </>
  )
})
export default WithdrawAddAddress
