import { styled } from '@mui/material/styles'
import { useWeb3React } from '@web3-react/core'
import Iconfont from 'components/Iconfont'
import copy from 'copy-to-clipboard'
import i18n from 'i18n'
import QRCode from 'qrcode.react'
import { useMemo, useState } from 'react'
import { useCurrentTheme } from 'store/settings/hooks'
import { ContentWrap, Flex, FlexCenter } from 'styles'

const QrWrap = styled(FlexCenter)`
  flex-direction: column;
  background: ${(props) => props.theme.color.bgGray};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text70};
  img {
    display: flex;
  }
`
const QRCodeWrap = styled(FlexCenter)`
  padding: 8px;
  border-radius: 4px;
  background: #fff;
`
const UrlText = styled('div')`
  display: flex;
  width: 80%;
  justify-content: space-around;
  margin-top: 8px;
  margin-bottom: 12px;
  span {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .iconfont {
    cursor: pointer;
  }
`
const CopyIcon = styled(Flex)`
  position: relative;
`
const CopyText = styled(Flex)`
  position: absolute;
  top: 0;
  left: 20px;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.color.primary40};
  background: ${(props) => props.theme.color.primary10};
  width: 44px;
  height: 16px;
  justify-content: center;
  align-items: center;
`

export const DepositQrcode = () => {
  const { account } = useWeb3React()
  const [isCopied, setIsCopied] = useState(false)
  const theme = useCurrentTheme()

  const depositUrl = useMemo(() => {
    if (!account) {
      return ''
    }
    return `${window.location.protocol}//${window.location.host}/deposit/${account}`
  }, [account])

  const handleCopy = () => {
    copy(depositUrl)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  return (
    <ContentWrap>
      <QrWrap>
        <p>Please use your mobile wallet to scan.</p>
        <QRCodeWrap>
          <QRCode
            value={depositUrl}
            size={128}
            fgColor={theme.color.text100}
            bgColor={theme.color.bg}
          />
        </QRCodeWrap>
        <UrlText onClick={handleCopy}>
          <span>{depositUrl}</span>
          <CopyIcon>
            <Iconfont
              name="icon-copy1"
              className={isCopied ? 'active' : ''}
              size={16}
            />
            {isCopied && (
              <CopyText>
                {i18n.t('account-copied', { defaultValue: 'Copied' })}
              </CopyText>
            )}
          </CopyIcon>
        </UrlText>
      </QrWrap>
    </ContentWrap>
  )
}
