import { Fade, styled } from '@mui/material'
import { ChainInfo } from 'api/v3/chains'
import clsx from 'clsx'
import i18n from 'i18n'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { useCurrentNetwork, useSupportChains } from 'store/app/hooks'
import { FlexBetween, FlexColumn, FlexStart } from 'styles'
import { useOnClickOutside } from 'usehooks-ts'
import Iconfont from '../Iconfont'
import { ReactComponent as SvgCurrentChainFlag } from './assets/current-chain-flag.svg'

const SelectTokenTitle = styled('div')`
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: #9199b1;
`
const SelectTokenSelector = styled(FlexBetween)`
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.color.text90};
  padding-right: 12px;
  .iconfont {
    color: ${(props) => props.theme.color.text50};
  }
  svg {
    margin-right: 17px;
  }
  .img-wrap {
    overflow: hidden;
    background: ${(props) => props.theme.color.text10};
    width: 24px;
    height: 24px;
    border-radius: 6px;
    margin-right: 4px;

    img {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
`
const SelectTokenSelectorInfo = styled(FlexStart)`
  span {
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${(props) => props.theme.breakpoints.down('md')} {
      width: 100%;
    }
  }
  .iconfont {
    color: rgba(0, 0, 0, 1);
  }
`
const SelectNetworkWrap = styled(FlexColumn)`
  width: 32%;
  padding-left: 12px;
  position: relative;
  svg {
    margin-right: 12px;
  }
`
const Popup = styled('div')`
  top: 48px;
  right: 0;
  padding: 8px 0;
  margin: 8px 0 0;
  position: absolute;
  border-radius: 12px;
  background: ${(props) => props.theme.color.bg};
  border-radius: 6px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12),
    0px 10px 15px -3px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.04);
  z-index: 99;
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: 100%;
  }
`
const NetworkItem = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  padding: 8px 16px;
  position: relative;
  padding-right: 30px;
  color: ${(props) => props.theme.color.text80};
  &.disabled {
    opacity: 0.3;
  }

  &:hover {
    background: ${(props) => props.theme.color.bgGray};
  }
  svg {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding-right: unset;
  }
`
const NetworkIcon = styled('img')`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 6px;
  overflow: hidden;
`
const ChainName = styled('div')`
  flex: 1;
  font-size: 14px;
`
const SelectedChainName = styled('span')`
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`

export const SelectNetwork: FC<{
  disabledSelect?: boolean
  disabled?: ChainInfo[]
  weakened?: ChainInfo[]
  network?: ChainInfo
  onChangeNetwork?(network: ChainInfo): void | boolean
  chains?: ChainInfo[]
}> = memo(
  ({
    disabledSelect = false,
    disabled,
    weakened,
    network,
    onChangeNetwork,
    chains = [],
  }) => {
    const [selected, setSelected] = useState<ChainInfo>()
    const [isIn, setIsIn] = useState(false)
    const modalRef = useRef<any>()
    const supportChains = useSupportChains()
    chains = chains.length ? chains : supportChains
    const currentNetwork = useCurrentNetwork()

    useEffect(() => {
      if (network && network?.layerTwoChainId !== selected?.layerTwoChainId) {
        setSelected(network)
      }
    }, [network])

    useOnClickOutside(modalRef, () => setIsIn(false))

    return (
      <SelectNetworkWrap ref={modalRef}>
        <SelectTokenTitle>
          {i18n.t('select-network', { defaultValue: 'Network' })}
        </SelectTokenTitle>
        <SelectTokenSelector
          onClick={(e) => {
            if (isIn) {
              setIsIn(false)
              return
            }
            setIsIn(true)
          }}>
          <SelectTokenSelectorInfo>
            <div className="img-wrap">
              {selected?.iconUrl && <img src={selected?.iconUrl} alt="" />}
            </div>
            <SelectedChainName>
              {selected?.name ? selected?.name : 'Select'}
            </SelectedChainName>
          </SelectTokenSelectorInfo>
          <Iconfont name="icon-ArrowDown" size={20} />
        </SelectTokenSelector>
        <Fade in={isIn} timeout={200}>
          <Popup>
            {chains?.map((item) => {
              const isWeakened = weakened
                ? weakened.findIndex(
                    (d) => d?.layerTwoChainId === item?.layerTwoChainId
                  ) > -1
                : false
              const isDisabled = disabled
                ? disabled.findIndex(
                    (d) => d?.layerTwoChainId === item?.layerTwoChainId
                  ) > -1
                : false
              const cn = clsx(isWeakened || isDisabled ? 'disabled' : '')
              return (
                <NetworkItem
                  key={item?.chainId}
                  className={cn}
                  onClick={(e) => {
                    if (isDisabled) {
                      return
                    }
                    if (disabledSelect) {
                      return
                    }
                    setIsIn(false)
                    if (onChangeNetwork) {
                      const cb = onChangeNetwork(item)
                      if (cb === false) {
                        return
                      }
                    }
                    setSelected(item)
                    e.stopPropagation()
                  }}>
                  <NetworkIcon src={item.iconUrl} />
                  <ChainName>{item.name}</ChainName>
                  {currentNetwork?.layerOneChainId === item.layerOneChainId && (
                    <SvgCurrentChainFlag />
                  )}
                </NetworkItem>
              )
            })}
          </Popup>
        </Fade>
      </SelectNetworkWrap>
    )
  }
)
