import { Button, InputBase, styled } from '@mui/material'
import { addAddressBook, putAddressBook } from 'api/v1/addressBook'
import Iconfont from 'components/Iconfont'
import Loading from 'components/Loading'
import toastify from 'components/Toastify'
import copy from 'copy-to-clipboard'
import i18n from 'i18n'
import { ChangeEvent, FC, memo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  updateIsAddOrEditAddressBook,
  updateTitleName,
} from 'store/withdraw/actions'
import {
  useAddOrEditAddress,
  useAddressBookList,
  useCurrentEditAddressBook,
  useIsAddOrEditAddressBook,
} from 'store/withdraw/hook'
import { ContentWrap, Flex, Space12, Wing10 } from 'styles'
import { encryptionAddress } from 'utils/address'
import { GrayBgContent, TokenRowInputEle } from '../Deposit/DepositSelectAssets'

const ContentSwapFlex = styled(ContentWrap)`
  padding: 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
  }
`
const AddressBookWrap = styled('div')``
const GrayBgContent2 = styled(GrayBgContent)`
  display: flex;
  flex-direction: column;
`
const AddressBookTitle = styled('div')`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text70};
  margin-bottom: 4px;
`
const WalletAddressWrap = styled(Flex)`
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.color.text90};
  background: ${(props) => props.theme.color.bg};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
`
const Address = styled('div')`
  font-size: 14px;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
const MobileAddress = styled('div')`
  display: none;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
  }
`
const CopyWrap = styled(Flex)`
  align-items: center;
  gap: 8px;
`
const CopyIcon = styled(Flex)`
  cursor: pointer;
`
const CopyText = styled(Flex)`
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.color.primary40};
  background: ${(props) => props.theme.color.primary10};
  width: 44px;
  height: 16px;
  justify-content: center;
  align-items: center;
`
const Tips = styled(Flex)`
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: ${(props) => props.theme.color.notificationRed02};
`
const WithdrawButton = styled(Button)`
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: ${(props) => props.theme.color.primary20};
  border: 1px solid ${(props) => props.theme.color.primary30};
  &.Mui-disabled {
    background: ${(props) => props.theme.color.primary50};
    color: ${(props) => props.theme.color.primaryGreyGreen};
    border: 1px solid ${(props) => props.theme.color.primaryGreyGreen};
  }
  &:hover {
    background: ${(props) => props.theme.color.primary30};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: 24px;
    width: calc(100vw - 48px);
  }
`
const AddressBookBtnWrap = styled(Flex)``
const AddressBookButton = styled(WithdrawButton)`
  margin: 200px 0 0;
  width: calc(100%);
`
const AddressBook: FC<{
  fetchAddressBookList: () => void
}> = memo(({ fetchAddressBookList }) => {
  const dispatch = useDispatch()
  const walletAddress = useAddOrEditAddress()
  const addressBookList = useAddressBookList()
  const currentEditAddressBook = useCurrentEditAddressBook()
  const isAddOrEditAddressBook = useIsAddOrEditAddressBook()

  const [walletName, setWalletName] = useState<string>('')
  const [isCopied, setIsCopied] = useState(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isShowTips, setIsShowTips] = useState<boolean>(false)
  useEffect(() => {
    if (isAddOrEditAddressBook === 0) {
      const collectionList = addressBookList.filter((item) => item.type === 0)
      const count = collectionList.length + 1
      setWalletName(initName(count))
    } else if (isAddOrEditAddressBook === 1) {
      setWalletName(currentEditAddressBook?.tag!)
    }
  }, [])
  useEffect(() => {
    if (currentEditAddressBook?.tag === walletName) {
      setIsShowTips(false)
      return
    }
    const flag = addressBookList.find((item) => item.tag === walletName)
    if (flag) {
      setIsShowTips(true)
    } else {
      setIsShowTips(false)
    }
  }, [walletName, addressBookList])

  const initName = (count: number): string => {
    let name = `Wallet ${count}`
    const flag = addressBookList.find((item) => item.tag === name)
    if (flag) {
      return initName(count + 1)
    }

    return name
  }
  const copyAddress = () => {
    copy(walletAddress)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }
  const addOrEdit = () => {
    setIsDisabled(true)
    if (isAddOrEditAddressBook === 0) {
      try {
        addAddressBook({
          chainType: 1,
          address: walletAddress,
          tag: walletName,
        })
          .then(
            (res) => {
              if (res?.data?.id) {
                dispatch(
                  updateTitleName(
                    i18n.t('balances-withdraw', { defaultValue: 'Withdraw' })
                  )
                )
                dispatch(updateIsAddOrEditAddressBook(undefined))

                fetchAddressBookList()
              }
            },
            (rej) => {
              toastify.error(rej)
            }
          )
          .finally(() => {
            setIsDisabled(false)
          })
      } catch (error) {
        setIsDisabled(false)
      }
    } else if (isAddOrEditAddressBook === 1) {
      try {
        putAddressBook(currentEditAddressBook?.id!, walletName)
          .then(
            (res) => {
              dispatch(
                updateTitleName(
                  i18n.t('balances-withdraw', { defaultValue: 'Withdraw' })
                )
              )
              dispatch(updateIsAddOrEditAddressBook(undefined))

              fetchAddressBookList()
            },
            (rej) => {
              toastify.error(rej?.response?.data?.message)
            }
          )
          .finally(() => {
            setIsDisabled(false)
          })
      } catch (error) {
        setIsDisabled(false)
      }
    }
  }
  return (
    <AddressBookWrap>
      <GrayBgContent2>
        <AddressBookTitle>
          {i18n.t('address-book-wallet-name', {
            defaultValue: 'Wallet Name',
          })}
        </AddressBookTitle>
        <TokenRowInputEle key={1}>
          <InputBase
            sx={{
              flex: 1,
              fontSize: '16px',
            }}
            value={walletName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setWalletName(event.target.value)
            }}
          />
        </TokenRowInputEle>
        {isShowTips ? (
          <Tips>
            {i18n.t('address-book-wallet-tips', {
              defaultValue: '* The name already exists.',
            })}
          </Tips>
        ) : null}
        <Space12 />
        <AddressBookTitle>
          {i18n.t('address-book-wallet-address', {
            defaultValue: 'Wallet Address',
          })}
        </AddressBookTitle>
        <WalletAddressWrap>
          <Address>{walletAddress}</Address>
          <MobileAddress>
            {encryptionAddress(walletAddress, 4, 4)}
          </MobileAddress>
          <CopyWrap>
            {isCopied && (
              <CopyText>
                {i18n.t('account-copied', { defaultValue: 'Copied' })}
              </CopyText>
            )}
            <CopyIcon
              onClick={() => {
                copyAddress()
              }}>
              <Iconfont name="icon-copy1" size={16} />
            </CopyIcon>
          </CopyWrap>
        </WalletAddressWrap>
      </GrayBgContent2>
      <AddressBookBtnWrap>
        <AddressBookButton
          disabled={isDisabled || isShowTips}
          fullWidth={true}
          variant={'contained'}
          onClick={addOrEdit}>
          {isDisabled ? <Loading /> : null}
          <Wing10>
            {i18n.t('address-book-wallet-done', { defaultValue: 'Done' })}
          </Wing10>
        </AddressBookButton>
      </AddressBookBtnWrap>
    </AddressBookWrap>
  )
})

export default AddressBook
