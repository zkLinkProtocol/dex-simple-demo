import { Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as SvgELipse } from 'assets/account/ellipse.svg'
import Iconfont from 'components/Iconfont'
import ModalLink from 'components/ModalLink'
import copy from 'copy-to-clipboard'
import i18n from 'i18n'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { updateModal } from 'store/app/actions'
import { cleanRestore, disconnectProvider, useModal } from 'store/app/hooks'
import { ContentWrap, Flex } from 'styles'
import { encryptionAddress } from 'utils/address'
import { viewOnZKLinkExplorer } from 'utils/explorer'
import { DisconnectButton } from '../../../components/Buttons/Disconnect'

const AccountContent = styled(Flex)`
  width: 360px;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.color.bgLightGray};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`
const AccountInfo = styled(Flex)`
  flex-direction: column;
`
const ConnectTitle = styled(Flex)`
  height: 20px;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.color.text70};
  margin-bottom: 5px;
`
const ConnectInfo = styled(Flex)`
  height: 24px;
  gap: 4px;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.color.text80};

  .iconfont {
    cursor: pointer;
  }
`
const CopyWrap = styled(Flex)``
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
const ConnectStatus = styled(Flex)`
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.color.text80};
  background: ${(props) => props.theme.color.bg};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.color.text10};
  width: 92px;
  height: 30px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const AccountViewWrap = styled(Flex)`
  margin-top: 7px;
  height: 20px;
  padding-left: 10px;
  font-weight: 400;
  font-size: 12px;
`
const AccountViewContent = styled(Flex)`
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  color: ${(props) => props.theme.color.text70};
  border-radius: 20px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.color.bgGray};
    color: ${(props) => props.theme.color.text90};
  }
`
export const AccountModal = memo(() => {
  const dispatch = useAppDispatch()
  const accountModal = useModal('account')
  const [isCopied, setIsCopied] = useState(false)
  const { connector, account = '', ENSName } = useWeb3React()
  const { t } = useTranslation()

  const copyAddress = useCallback(() => {
    if (ENSName || account) {
      copy(ENSName ?? account)
      setIsCopied(true)
      // setTimeout(() => {
      //   setIsCopied(false)
      // }, 3000)
    }
  }, [ENSName, account])

  const signOut = useCallback(() => {
    dispatch(
      updateModal({
        modal: 'account',
        open: false,
      })
    )
    disconnectProvider()
    cleanRestore()

    if (connector.deactivate) {
      connector.deactivate()
    }
    connector.resetState()
  }, [connector, dispatch])

  return (
    <ModalLink
      width="400px"
      isIn={accountModal}
      header={i18n.t('account-title', { defaultValue: 'Account' })}
      onClose={() => {
        setIsCopied(false)
        dispatch(
          updateModal({
            modal: 'account',
            open: false,
          })
        )
      }}>
      <ContentWrap>
        <AccountContent>
          <Stack width="100%">
            <Stack
              flex="1"
              direction="row"
              alignItems="center"
              justifyContent="space-between">
              <AccountInfo>
                <ConnectTitle>
                  {t('account-connected-with-metamask', {
                    defaultValue: 'Connected with Metamask',
                  })}
                </ConnectTitle>
                <ConnectInfo>
                  <SvgELipse />
                  {ENSName ?? encryptionAddress(account)}
                  <CopyWrap
                    className="copy"
                    onClick={() => {
                      copyAddress()
                    }}>
                    <Iconfont name="icon-copy1" size={16} />
                  </CopyWrap>
                  {isCopied && (
                    <CopyText>
                      {t('account-copied', { defaultValue: 'Copied' })}
                    </CopyText>
                  )}
                </ConnectInfo>
              </AccountInfo>
              <DisconnectButton
                size="small"
                onClick={() => {
                  signOut()
                }}>
                {t('account-disconnect', { defaultValue: 'Disconnect' })}
              </DisconnectButton>
            </Stack>
          </Stack>
        </AccountContent>
        <AccountViewWrap>
          <AccountViewContent onClick={() => viewOnZKLinkExplorer(account)}>
            <Iconfont name="icon-view" size={16} />
            {t('account-view', { defaultValue: 'View on Explorer' })}
          </AccountViewContent>
        </AccountViewWrap>
      </ContentWrap>
    </ModalLink>
  )
})
