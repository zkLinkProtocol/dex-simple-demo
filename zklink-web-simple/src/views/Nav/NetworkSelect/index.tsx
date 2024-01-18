import { Button, Fade, styled } from '@mui/material'
import { ChainInfo } from 'api/v3/chains'
import Iconfont from 'components/Iconfont'
import toastify from 'components/Toastify'
import { ConnectionType } from 'connection/types'
import i18n from 'i18n'
import { memo, useEffect, useRef, useState } from 'react'
import {
  useCurrentNetwork,
  useIsErrorChain,
  useSupportChains,
  useSwitchNetwork,
  useUnsupportedChains,
  useWeb3Connected,
} from 'store/app/hooks'
import { useCurrentConnectorName } from 'store/settings/hooks'
import { transientOptions } from 'styles/TransientOptions'
import { useOnClickOutside } from 'usehooks-ts'
import { GaEventName, gaEvent } from 'utils/ga'
import { ReactComponent as SvgCurrentChainFlag } from './assets/current-chain-flag.svg'

const NetworkSelectWrap = styled('div')`
  position: relative;
  z-index: 50;
`
const NetworkIcon = styled('img')`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 4px;
  border-radius: 6px;
  overflow: hidden;
`
const NetworkItem = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  padding: 8px 44px 8px 14px;
  position: relative;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.color.text90};
  background: ${(props) => props.theme.color.bg};

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.active {
    background: ${(props) => props.theme.color.networkSelectionBgColor};

    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
  }

  &:hover {
    background: ${(props) => props.theme.color.networkSelectionBgColor};
  }
`
const CurrentChainFlag = styled(SvgCurrentChainFlag)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
`
const ChainName = styled('div')`
  flex: 1;
  font-size: 16px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${(props) => props.theme.breakpoints.down('lg')} {
    min-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
const CurrentNetworkItem = styled(Button, transientOptions)<{
  $isErrorChain?: boolean
}>`
  display: flex;
  gap: 4px;
  align-items: center;
  height: 36px;
  background: ${(props) => props.theme.color.bgNavButton};
  color: ${(props) =>
    props.$isErrorChain
      ? props.theme.color.notificationRed02
      : props.theme.color.text90};
  border: 1px solid rgba(0, 0, 0, 0);

  border-radius: 8px;
  padding: 5px 12px;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.$isErrorChain
        ? props.theme.color.notificationRed02
        : props.theme.color.bgNavButton};

  ${(props) => props.theme.breakpoints.down('md')} {
    background: ${(props) => props.theme.color.bg};
    border-color: ${(props) => props.theme.color.text10};
    width: 100%;
  }
  &.active,
  &:hover {
    border: 1px solid
      ${(props) =>
        props.$isErrorChain
          ? props.theme.color.notificationRed02
          : props.theme.palette.primary.main};

    color: ${(props) =>
      props.$isErrorChain
        ? props.theme.color.notificationRed02
        : props.theme.palette.primary.main};
    background: ${(props) => props.theme.color.bg};
  }
  img {
    ${(props) => props.theme.breakpoints.down('md')} {
      width: 22px;
      height: 22px;
    }
  }
  .iconfont {
    margin-left: 4px;
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-left: unset;
    }
  }
`
const DropArrow = styled(Iconfont)`
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 16px !important;
  }
`
const Popup = styled('div')`
  position: absolute;
  width: 100%;
`
const PopupList = styled('div')`
  overflow: hidden;
  display: inline-flex;
  flex-direction: column;
  background: ${(props) => props.theme.color.bg};
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgb(0 0 0 / 5%);
  border-radius: 6px;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: unset;
  }
`

export const NetworkSelect = memo(() => {
  const wrap = useRef<HTMLDivElement>(null)
  const [isIn, setIsIn] = useState(false)
  const supportChains = useSupportChains()
  const unSupportChains = useUnsupportedChains()
  const isErrorChain = useIsErrorChain()
  const web3Connected = useWeb3Connected()
  const currentConnectorName = useCurrentConnectorName()
  const currentNetwork = useCurrentNetwork()
  const switchNetwork = useSwitchNetwork()
  const [selected, setSelected] = useState<ChainInfo>()

  useOnClickOutside(wrap, () => setIsIn(false))

  useEffect(() => {
    // Default display the first chain
    if (!currentNetwork?.layerOneChainId) {
      setSelected(supportChains[0])
    }

    // If currentNetwork is valid
    if (
      currentNetwork?.layerOneChainId &&
      currentNetwork?.layerTwoChainId &&
      currentNetwork?.layerOneChainId !== selected?.layerOneChainId
    ) {
      setSelected(currentNetwork)
    }
  }, [currentNetwork, supportChains])

  const clickCurrentNetworkItem = () => {
    setIsIn(!isIn)
    gaEvent(GaEventName.click_nav_network)
  }

  const onSelectNetwork = (selectedNetwork: ChainInfo) => {
    if (
      web3Connected &&
      currentConnectorName === ConnectionType.WALLET_CONNECT_V2
    ) {
      toastify.error(
        'Could not switch networks from the Nexus interface. Please change the network in your wallet.',
        {
          toastId: 'failed switch network',
        }
      )
    }
    setIsIn(false)
    if (web3Connected) {
      if (
        selectedNetwork.layerOneChainId !== currentNetwork?.layerOneChainId ||
        isErrorChain
      ) {
        switchNetwork(selectedNetwork.layerOneChainId).catch((e) => {})
      }
    } else {
      setSelected(selectedNetwork)
    }

    gaEvent(GaEventName.change_nav_network, {
      network: selectedNetwork.name!,
    })
  }

  return (
    <NetworkSelectWrap ref={wrap}>
      <CurrentNetworkItem
        $isErrorChain={isErrorChain}
        onClick={() => {
          clickCurrentNetworkItem()
        }}
        className={isIn ? 'active' : ''}>
        {isErrorChain ? (
          <>
            <Iconfont name="icon-Warning1" />
            <ChainName>
              {i18n.t('nav-switch-network', { defaultValue: 'Switch Network' })}
            </ChainName>
          </>
        ) : (
          <>
            <NetworkIcon src={selected?.iconUrl} />
            <ChainName>{selected?.name && selected?.name}</ChainName>
          </>
        )}
        <DropArrow name="icon-ArrowDown" size={20} />
      </CurrentNetworkItem>

      <Fade in={isIn} timeout={200}>
        <Popup>
          <PopupList>
            {supportChains?.map((item) => {
              return (
                <NetworkItem
                  key={item?.chainId}
                  className={selected?.chainId === item.chainId ? 'active' : ''}
                  onClick={(e) => {
                    onSelectNetwork(item)
                    e.stopPropagation()
                  }}>
                  <NetworkIcon src={item.iconUrl} />
                  <div>{item.name}</div>
                  {selected?.chainId === item.chainId && <CurrentChainFlag />}
                </NetworkItem>
              )
            })}
            {unSupportChains?.map((item) => {
              return (
                <NetworkItem key={item.name} className="disabled">
                  <NetworkIcon src={item.iconUrl} />
                  <div>{item.name}</div>
                </NetworkItem>
              )
            })}
            <NetworkItem key="starknet" className="disabled">
              <NetworkIcon src="https://static.zk.link/token/icons/default/starknet.svg" />
              <div>StarkNet Testnet</div>
            </NetworkItem>
          </PopupList>
        </Popup>
      </Fade>
    </NetworkSelectWrap>
  )
})
