import { Fade } from '@mui/material'
import { AddressBookChainType, deleteAddressBook } from 'api/v1/addressBook'
import i18n from 'i18n'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'
import {
  updateAddOrEditAddress,
  updateCurrentEditAddressBook,
  updateCurrentUseAddressBook,
  updateIsAddOrEditAddressBook,
  updateIsUseAddressBook,
  updateTitleName,
  updateWidthAddress,
} from 'store/withdraw/actions'
import { useAddressBookList, useShowAddressBookList } from 'store/withdraw/hook'
import { encryptionAddress } from 'utils/address'
import {
  AddressBookList,
  AddressBookListItem,
  Popup,
  WalletAction,
  WalletActionWrap,
  WalletAddress,
  WalletName,
} from './style'

const WithdrawAddressBookListFade: FC<{
  myAddress: string | undefined
  fetchAddressBookList: () => void
}> = memo(({ myAddress, fetchAddressBookList }) => {
  const dispatch = useDispatch()
  const addressBookList = useAddressBookList()
  const showAddressBookList = useShowAddressBookList()
  const handleDelete = (bookId: number) => {
    try {
      deleteAddressBook(bookId).then((res) => {
        fetchAddressBookList()
      })
    } catch (error) {}
  }
  return (
    <Fade in={showAddressBookList} timeout={200}>
      <Popup>
        <AddressBookList>
          {[
            ...addressBookList,
            {
              id: 0,
              chainType: 1 as AddressBookChainType,
              address: myAddress!,
              tag: '',
              type: 2,
              updateTime: new Date().getTime(),
            },
          ]?.map((item) => {
            return (
              <AddressBookListItem
                key={item.address}
                onClick={() => {
                  dispatch(updateWidthAddress(item.address))

                  dispatch(updateCurrentUseAddressBook(item))
                  dispatch(updateIsUseAddressBook(true))
                }}
              >
                {item.type === 1 ? (
                  <WalletName className="collection">{item.tag}</WalletName>
                ) : item.type === 0 ? (
                  <WalletName>
                    <i>
                      {i18n.t('address-book-wallet-recently-used', {
                        defaultValue: 'Recently Used',
                      })}
                    </i>
                  </WalletName>
                ) : (
                  <WalletName>
                    <i>
                      {i18n.t('address-book-wallet-current-wallet', {
                        defaultValue: 'Current Wallet',
                      })}
                    </i>
                  </WalletName>
                )}
                <WalletActionWrap className="action">
                  {(item.type === 0 || item.type === 1) && (
                    <WalletAction
                      key="edit"
                      onClick={(event: any) => {
                        if (item.type === 0) {
                          dispatch(updateIsAddOrEditAddressBook(1))

                          dispatch(
                            updateTitleName(
                              i18n.t('address-book-wallet-edit', {
                                defaultValue: 'Edit',
                              })
                            )
                          )
                        } else {
                          dispatch(updateIsAddOrEditAddressBook(0))

                          dispatch(
                            updateTitleName(
                              i18n.t('address-book-wallet-add-address', {
                                defaultValue: 'Add address',
                              })
                            )
                          )
                        }

                        dispatch(updateCurrentEditAddressBook(item))
                        dispatch(updateAddOrEditAddress(item.address))
                        event.stopPropagation()
                      }}
                    >
                      {i18n.t('address-book-wallet-list-edit', {
                        defaultValue: 'Edit',
                      })}
                    </WalletAction>
                  )}

                  {item.type === 1 && (
                    <WalletAction
                      key="delete"
                      onClick={(event: any) => {
                        handleDelete(item.id)
                        event.stopPropagation()
                      }}
                    >
                      {i18n.t('address-book-wallet-list-delete', {
                        defaultValue: 'Delete',
                      })}
                    </WalletAction>
                  )}
                </WalletActionWrap>
                <WalletAddress>
                  ({encryptionAddress(item.address)})
                </WalletAddress>
              </AddressBookListItem>
            )
          })}
        </AddressBookList>
      </Popup>
    </Fade>
  )
})
export default WithdrawAddressBookListFade
