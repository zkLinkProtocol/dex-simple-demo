import { InputBase } from '@mui/material'
import { AddressBookRow } from 'api/v1/addressBook'
import i18n from 'i18n'
import { ChangeEvent, FC, memo, MutableRefObject, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  updateCurrentUseAddressBook,
  updateIsFocus,
  updateIsUseAddressBook,
  updateShowAddressBookList,
  updateWidthAddress,
} from 'store/withdraw/actions'
import {
  useCurrentUseAddressBook,
  useIsFocus,
  useIsUseAddressBook,
  useShowAddressBookList,
  useWithdrawAddress,
} from 'store/withdraw/hook'
import { encryptionAddress } from 'utils/address'
import { TokenRowInputEle } from '../Deposit/DepositSelectAssets'
import {
  CurrentAddress,
  CurrentUseAddress,
  CurrentUseAddressWrap,
  CurrentUseWalletName,
} from './style'

const WithdrawAddressInput: FC<{
  myAddress: string | undefined
  AddressBookIconRef: MutableRefObject<any>
}> = memo(({ myAddress, AddressBookIconRef }) => {
  const dispatch = useDispatch()
  const isFocus = useIsFocus()
  const isUseAddressBook = useIsUseAddressBook()
  const currentUseAddressBook = useCurrentUseAddressBook()
  const address = useWithdrawAddress()

  const showAddressBookList = useShowAddressBookList()
  const currentAddressText = useRef<any>()
  const clickAddressBookIcon = () => {
    if (isUseAddressBook) {
      dispatch(updateWidthAddress(''))
      dispatch(updateIsUseAddressBook(false))

      dispatch(updateCurrentUseAddressBook({} as AddressBookRow))
    } else {
      dispatch(updateShowAddressBookList(!showAddressBookList))
    }
  }
  return (
    <TokenRowInputEle>
      {isUseAddressBook ? (
        <CurrentUseAddressWrap>
          {currentUseAddressBook?.type === 0 ? (
            <CurrentUseWalletName>
              {currentUseAddressBook?.tag}{' '}
            </CurrentUseWalletName>
          ) : currentUseAddressBook?.type === 1 ? (
            <CurrentUseWalletName>
              {i18n.t('address-book-wallet-recently-used', {
                defaultValue: 'Recently Used',
              })}{' '}
            </CurrentUseWalletName>
          ) : (
            <CurrentUseWalletName>
              <strong>
                {i18n.t('address-book-wallet-current-wallet', {
                  defaultValue: 'Current Wallet',
                })}{' '}
              </strong>
            </CurrentUseWalletName>
          )}

          <CurrentUseAddress>
            ({encryptionAddress(currentUseAddressBook?.address!)})
          </CurrentUseAddress>
        </CurrentUseAddressWrap>
      ) : (
        <>
          <InputBase
            multiline
            sx={{
              flex: 1,
              fontSize: '14px',
            }}
            placeholder="Recipient's address"
            value={address}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch(updateWidthAddress(event.currentTarget.value))
            }}
          />{' '}
          {!isFocus && (
            <CurrentAddress
              ref={currentAddressText}
              onClick={() => {
                dispatch(updateIsFocus(true))
              }}>
              <strong>
                {i18n.t('address-book-wallet-current-wallet', {
                  defaultValue: 'Current Wallet',
                })}{' '}
              </strong>
              ({encryptionAddress(myAddress as string)})
            </CurrentAddress>
          )}
        </>
      )}

      {/* <AddressBookIconWrap
        ref={AddressBookIconRef}
        onClick={clickAddressBookIcon}>
        {isUseAddressBook ? (
          <Iconfont name="icon-close2" size={20} />
        ) : (
          <Iconfont name="icon-address2" size={20} />
        )}
      </AddressBookIconWrap> */}
    </TokenRowInputEle>
  )
})
export default WithdrawAddressInput
