import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Stack, styled, Tooltip, Typography } from '@mui/material'
import Switch from '@mui/material/Switch'
import { ActionButton } from 'components/Buttons/ActionButton'
import useConnectLinkWallet from 'hooks/link/useConnectLinkWallet'
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useLinkStatus } from 'store/link/hooks'
import { LinkStatus } from 'store/link/types'
import { updateSaveToken } from 'store/settings/actions'
import { useCurrentConnectorName, useSaveToken } from 'store/settings/hooks'
import authorization from 'utils/authorization'
import restore from 'utils/restore'
import i18n from '../../i18n'
import { updateModal } from '../../store/app/actions'
import { useModal } from '../../store/app/hooks'
import { ContentWrap, Flex } from '../../styles'
import Iconfont from '../Iconfont'
import Loading from '../Loading'
import ModalLink from '../ModalLink'
import { getRecentConnectionMeta } from '../../connection/meta'
const Directions = styled(Flex)`
  flex-direction: column;
  color: ${(props) => props.theme.color?.text60};
  span {
    font-weight: 600;
    font-size: 12px;
    line-height: 24px;
  }
`
const Step = styled(Flex)`
  margin-top: 26px;
  flex-direction: column;
  gap: 40px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`
const StepItem = styled(Flex)`
  .step-num {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: ${(props) => props.theme.color?.text10};
    color: ${(props) => props.theme.color?.text60};
    font-size: 16px;
    line-height: 24px;
    &.active {
      background-color: ${(props) => props.theme.color?.text60};
      color: ${(props) => props.theme.color?.text00};
    }
  }
  .step-info {
    margin-left: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: ${(props) => props.theme.color?.text90};

    .instru {
      color: ${(props) => props.theme.color?.text60};
      font-weight: 400;
      font-size: 14px;
    }
  }
  .iconfont {
    color: ${(props) => props.theme.color?.text80};
  }
`
const SubmitWrap = styled(Flex)`
  margin-top: 16px;
  justify-content: flex-end;
  height: 34px;
  font-weight: 600;
  font-size: 14px;
`
const Remember = styled(Stack)`
  color: ${(props) => props.theme.color?.text90};
  margin-top: 16px;
`

export const LinkWalletModal = memo(() => {
  const dispatch = useDispatch()
  const linkWalletModal = useModal('verify')
  const connectToLink = useConnectLinkWallet()
  const linkStatus = useLinkStatus()
  const { t } = useTranslation()
  const isSaveToken = useSaveToken()

  useEffect(() => {
    if (linkStatus === LinkStatus.linkL2Success) {
      dispatch(updateModal({ modal: 'verify', open: false }))
    }
  }, [linkStatus])

  const onActive = async () => {
    await connectToLink()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    if (!checked) {
      restore.clean()
      authorization.clean()
    }
    dispatch(updateSaveToken(checked))
  }

  return (
    <ModalLink
      width="344px"
      isIn={linkWalletModal}
      header={i18n.t('link-wallet-title', { defaultValue: 'Link wallet' })}
      onClose={() => {
        dispatch(updateModal({ modal: 'verify', open: false }))
      }}>
      <ContentWrap>
        <Directions>
          <span>
            {i18n.t('link-wallet-receive', {
              defaultValue: 'You will receive two signature requests.',
            })}
          </span>
          <span>
            {i18n.t('link-wallet-transaction', {
              defaultValue: 'Signing is free and will not send a transaction.',
            })}
          </span>
        </Directions>
        <Step>
          <StepItem>
            <div
              className={`step-num ${
                linkStatus === LinkStatus.linkL1Success ||
                linkStatus === LinkStatus.linkL2Pending ||
                linkStatus === LinkStatus.linkL2Failed
                  ? 'active'
                  : ''
              }`}>
              {linkStatus === LinkStatus.linkL1Success ||
              linkStatus === LinkStatus.linkL2Pending ||
              linkStatus === LinkStatus.linkL2Failed ? (
                <AccountBalanceWalletIcon />
              ) : (
                <Iconfont name="icon-check-fill" size={16}></Iconfont>
              )}
            </div>
            <div className="step-info">
              <span>
                {i18n.t('link-wallet-verify', {
                  defaultValue: 'Verify ownership',
                })}
              </span>
              <span className="instru">
                {i18n.t('link-wallet-confirm', {
                  defaultValue: 'Confirm you are the owner of this wallet',
                })}
              </span>
            </div>
          </StepItem>
        </Step>
        <Remember
          alignItems="center"
          direction="row"
          justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <Typography variant="body2">Remember me (12 hr)</Typography>
            <Tooltip
              title={
                t('description-rememberme', {
                  defaultValue:
                    'Only use Remember Me when you are using your own trusted and secure device. It reduces the number of wallet signs for faster trading, but may expose your keys and data if you are on a public or non-secure device.',
                }) ?? ''
              }
              arrow
              placement="bottom">
              <Box sx={{ color: 'primary.main', pl: 0.5 }}>
                <InfoOutlinedIcon
                  sx={{ verticalAlign: 'top' }}
                  fontSize="small"
                  color="inherit"
                />
              </Box>
            </Tooltip>
          </Stack>

          <Switch checked={isSaveToken} onChange={handleChange} />
        </Remember>
        <SubmitWrap>
          <ActionButton
            variant="contained"
            size="small"
            onClick={() => onActive()}>
            {linkStatus === LinkStatus.linkL2Pending ? (
              <>
                <Loading color="inherit" /> <span>Connecting</span>
              </>
            ) : linkStatus === LinkStatus.linkL1Success ? (
              <>
                <Iconfont name="icon-Activate" size={16} /> <span>Connect</span>
              </>
            ) : (
              <>
                <Iconfont name="icon-refresh" size={16} />
                <span>
                  {i18n.t('link-wallet-try-again', {
                    defaultValue: 'Try again',
                  })}
                </span>
              </>
            )}
          </ActionButton>
        </SubmitWrap>
      </ContentWrap>
    </ModalLink>
  )
})
