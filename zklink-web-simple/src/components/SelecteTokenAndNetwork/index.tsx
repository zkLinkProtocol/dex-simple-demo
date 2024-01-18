import { Fade, Tooltip } from '@mui/material'
import { ChainInfo } from 'api/v3/chains'
import { Currency } from 'api/v3/tokens'
import Iconfont from 'components/Iconfont'
import Loading from 'components/Loading'
import useResize from 'hooks/useResize'
import { differenceBy } from 'lodash'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { useEthProperty, useSupportChains } from 'store/app/hooks'
import {
  fetchTokenReserveAction,
  updateAmount,
  updateSelectedToken,
} from 'store/withdraw/actions'
import {
  useSelectedToken,
  useWithdrawCurrencies,
  useWithdrawLimitByToken,
} from 'store/withdraw/hook'
import { FlexBetween, FlexColumn } from 'styles'
import { L2ChainId } from 'types'
import { w2e } from 'utils/number'
import FastWithdrawalFlag from './FastWithdrawalFlag'
import {
  CoinItem,
  LeftColumn,
  Limit,
  Line,
  ListTitle,
  NetItem,
  NetItemName,
  NetworkList,
  Popup,
  RightColumn,
  SearchInput,
  SelectNetwork,
  SelectTokenSelector,
  SelectTokenSelectorInfo,
  SelectTokenTitle,
  SelectTokenWrap,
  SelectorInfoRight,
  TokenList,
} from './style'

const SelectTokenAndNetwork: FC<{
  setSelectedNetwork?: (chain: ChainInfo) => void
  selectedNetwork?: ChainInfo
  showSupportFast?: boolean
}> = ({ showSupportFast, setSelectedNetwork, selectedNetwork }) => {
  const { t } = useTranslation()
  const [inputToken, setInputToken] = useState<string>('')
  const [isIn, setIsIn] = useState(false)
  const modalRef = useRef<any>()
  const dispatch = useAppDispatch()
  const checkedToken = useSelectedToken()
  const supportChains = useSupportChains()
  const tokenListRef = useRef(null)
  const netListRef = useRef(null)
  const { isMobile } = useResize()
  const ethProperty = useEthProperty()
  const [selectedToken, setSelectedToken] = useState<Currency>()
  const [clickedNetwork, setClickNetwork] = useState<ChainInfo>()
  const [limitSize, limitPending] = useWithdrawLimitByToken(
    selectedToken?.l2CurrencyId!
  )

  useEffect(() => {
    setSelectedToken(checkedToken)
  }, [checkedToken])

  useEffect(() => {
    if (clickedNetwork?.layerTwoChainId && selectedToken?.id) {
      dispatch(updateSelectedToken(selectedToken))
      dispatch(updateAmount(''))
      setSelectedNetwork && setSelectedNetwork(clickedNetwork)
      setIsIn(false)
    }
  }, [clickedNetwork?.layerTwoChainId, selectedToken?.id])

  const netMap = useMemo(() => {
    const _map: Record<L2ChainId, ChainInfo> = {}
    supportChains.forEach((item) => {
      _map[item.layerTwoChainId] = item
    })
    return _map
  }, [supportChains])

  const allTokenList = useWithdrawCurrencies()

  useEffect(() => {
    if (selectedToken?.l2CurrencyId) {
      dispatch(
        fetchTokenReserveAction({ l2CurrencyId: selectedToken?.l2CurrencyId })
      )
    }
  }, [selectedToken?.l2CurrencyId, ethProperty])

  const filterTokens: (Currency & { canWithdraw: boolean })[] = useMemo(() => {
    let newTokenList = allTokenList
    if (inputToken) {
      newTokenList = newTokenList.filter((item) => {
        const up = item?.name ? item?.name.toUpperCase() : ''
        return up.indexOf(inputToken.toUpperCase()) > -1
      })
    }

    let _supportTokens: Currency[] = [],
      _otherToken: Currency[] = []
    if (clickedNetwork) {
      if (clickedNetwork.gateway) {
        _supportTokens = newTokenList.filter((token) =>
          ethProperty.gateways.some((gateway) =>
            gateway.tokens.some((t) => t.tokenId === token.l2CurrencyId)
          )
        )
      } else {
        _supportTokens = newTokenList.filter(
          (token) => token.chains[clickedNetwork.layerTwoChainId]
        )
      }

      _otherToken = differenceBy(newTokenList, _supportTokens, 'l2CurrencyId')
    } else {
      _supportTokens = newTokenList
    }

    return [
      ..._supportTokens.map((v) => ({ ...v, canWithdraw: true })),
      ..._otherToken.map((v) => ({ ...v, canWithdraw: false })),
    ]
  }, [allTokenList, inputToken, clickedNetwork, ethProperty])

  const sortedChains: (ChainInfo & { canWithdraw: boolean })[] = useMemo(() => {
    let _supportNet: ChainInfo[] = [],
      _otherNet: ChainInfo[] = []
    if (selectedToken) {
      // All supported withdrawal chain IDs
      const supportedChainIds: L2ChainId[] = Object.keys(
        selectedToken.chains
      ).map((v) => Number(v))

      // Get a list of supported chains, but the list will not include Ethereum.
      _supportNet = supportChains.filter(
        (chain) =>
          chain.gateway == false &&
          chain.layerTwoChainId &&
          supportedChainIds.includes(chain.layerTwoChainId)
      )

      // Try to find a withdrawal gateway to Ethereum
      const gatewayEnabled = ethProperty.gateways.some((gateway) =>
        gateway.tokens.some(
          (token) => token.tokenId === selectedToken.l2CurrencyId
        )
      )
      if (gatewayEnabled) {
        _supportNet = _supportNet.concat(
          supportChains.filter((chain) => chain.gateway)
        )
      }

      _otherNet = differenceBy(supportChains, _supportNet, 'layerOneChainId')
    } else {
      _otherNet = supportChains
    }
    return [
      ..._supportNet.map((v) => ({ ...v, canWithdraw: true })),
      ..._otherNet.map((v) => ({ ...v, canWithdraw: false })),
    ]
  }, [supportChains, selectedToken, ethProperty])

  useEffect(() => {
    function handler(event: any) {
      if (!modalRef.current?.contains(event.target)) {
        setIsIn(false)
      }
    }

    document.body.addEventListener('click', handler, true)
    return () => document.body.removeEventListener('click', handler, true)
  }, [])

  const tokenSelectedHandle = (_token: Currency) => {
    if (clickedNetwork) {
      if (clickedNetwork.gateway) {
        if (
          ethProperty.gateways.every((gateway) =>
            gateway.tokens.every(
              (token) => token.tokenId !== _token.l2CurrencyId
            )
          )
        ) {
          setClickNetwork(undefined)
        }
      } else if (!_token.chains[clickedNetwork.layerTwoChainId]) {
        setClickNetwork(undefined)
      }
    }
    if (netListRef?.current) {
      ;(netListRef.current as any).scrollTop = 0
    }
    setSelectedToken(_token)
  }

  const networkSelectedHandle = (net: ChainInfo) => {
    if (selectedToken) {
      if (net.gateway) {
        if (
          ethProperty.gateways.every((gateway) =>
            gateway.tokens.every(
              (token) => token.tokenId !== selectedToken.l2CurrencyId
            )
          )
        ) {
          setSelectedToken(undefined)
        }
      } else if (!selectedToken.chains[net.layerTwoChainId]) {
        setSelectedToken(undefined)
      }
    }
    if (tokenListRef?.current) {
      ;(tokenListRef.current as any).scrollTop = 0
    }
    setClickNetwork(net)
  }

  const isFast = useMemo(() => {
    if (
      checkedToken &&
      selectedNetwork?.layerTwoChainId &&
      checkedToken.chains[selectedNetwork?.layerTwoChainId]?.fastWithdraw
    ) {
      return true
    }
    return false
  }, [checkedToken?.id, selectedNetwork?.layerTwoChainId])

  return (
    <SelectTokenWrap ref={modalRef}>
      <FlexColumn sx={{ justifyContent: 'center' }}>
        <SelectTokenTitle>
          {t('select-token', { defaultValue: 'Token' })}
        </SelectTokenTitle>
        <SelectTokenSelector onClick={() => setIsIn(!isIn)}>
          <SelectTokenSelectorInfo>
            {checkedToken?.tokenIconUrl && (
              <div className="img-wrap">
                <img src={checkedToken?.tokenIconUrl} alt="" />
              </div>
            )}
            <span>{checkedToken?.name ? checkedToken?.name : 'Select'}</span>
            {checkedToken && selectedNetwork && (
              <SelectNetwork>
                <div className="img-wrap">
                  {selectedNetwork?.iconUrl && (
                    <img src={selectedNetwork?.iconUrl} alt="" />
                  )}
                </div>
                <span>{selectedNetwork?.name}</span>
              </SelectNetwork>
            )}
          </SelectTokenSelectorInfo>
          <SelectorInfoRight>
            {showSupportFast && isFast ? <FastWithdrawalFlag /> : null}
            <Iconfont name="icon-ArrowDown" size={20} />
          </SelectorInfoRight>
        </SelectTokenSelector>
      </FlexColumn>
      <Fade in={isIn} timeout={200}>
        <Popup>
          <FlexBetween sx={{ alignItems: 'stretch' }}>
            <LeftColumn>
              <ListTitle sx={{ marginLeft: '12px' }}>Token</ListTitle>
              <SearchInput>
                <Iconfont name="icon-Search" size={18} />
                <input
                  type={'text'}
                  placeholder="Search"
                  onChange={(e) => {
                    setInputToken(e.currentTarget.value)
                  }}
                />
              </SearchInput>
              <TokenList ref={tokenListRef}>
                {filterTokens.map((item) => {
                  return (
                    <CoinItem
                      className={`${
                        item.id === selectedToken?.id ? 'active' : ''
                      } ${
                        selectedToken?.l2CurrencyId === item.l2CurrencyId ||
                        item.canWithdraw
                          ? ''
                          : 'un-support'
                      }`}
                      onClick={() => {
                        // setSelectedToken(item)
                        // onTokenSelected && onTokenSelected(item)
                        // isIn && setIsIn(false)
                        tokenSelectedHandle(item)
                      }}
                      key={item.id}>
                      <img src={item.tokenIconUrl} alt="" />
                      <span>{item.name}</span>
                    </CoinItem>
                  )
                })}
              </TokenList>
            </LeftColumn>
            <Line />
            <RightColumn>
              <ListTitle>Network</ListTitle>
              <NetworkList ref={netListRef}>
                {sortedChains.map((item) => {
                  const size = limitSize[item.layerTwoChainId] ?? 0
                  const formattedSize = w2e(size, 5)
                  return (
                    <NetItem
                      key={item.layerTwoChainId}
                      onClick={() => networkSelectedHandle(item)}
                      className={`${
                        clickedNetwork?.layerOneChainId ===
                          item.layerOneChainId || item.canWithdraw
                          ? ''
                          : 'un-support'
                      } ${
                        item.layerTwoChainId === clickedNetwork?.layerTwoChainId
                          ? 'active'
                          : ''
                      }`}>
                      <NetItemName
                        title={netMap[item.layerTwoChainId].name}
                        className={selectedToken ? 'max-width' : ''}>
                        <img
                          src={netMap[item.layerTwoChainId].iconUrl}
                          alt=""
                        />
                        <span>{netMap[item.layerTwoChainId].name}</span>
                      </NetItemName>
                      {limitPending && !isMobile ? (
                        <Loading sx={{ marginLeft: '16px' }} size={10} />
                      ) : (
                        <Tooltip title={formattedSize} arrow>
                          <Limit
                            onMouseEnter={(ev: any) => {
                              try {
                                if (
                                  (ev.target as any)?.offsetWidth ===
                                  (ev.target as any)?.scrollWidth
                                ) {
                                  ev.target.classList.add('disabled')
                                } else {
                                  ev.target.classList.remove('disabled')
                                }
                              } catch {
                                //
                              }
                            }}>
                            {`Max: ${formattedSize}`}
                          </Limit>
                        </Tooltip>
                      )}
                    </NetItem>
                  )
                })}
              </NetworkList>
            </RightColumn>
          </FlexBetween>
        </Popup>
      </Fade>
    </SelectTokenWrap>
  )
}

export default SelectTokenAndNetwork
