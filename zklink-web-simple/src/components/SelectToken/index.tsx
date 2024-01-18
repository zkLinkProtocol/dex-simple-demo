import { Fade, styled } from '@mui/material'
import { ChainInfo } from 'api/v3/chains'
import { Currency } from 'api/v3/tokens'
import { FC, memo, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { transientOptions } from 'styles/TransientOptions'
import { useOnClickOutside } from 'usehooks-ts'
import i18n from '../../i18n'
import { FlexBetween, FlexColumn, FlexStart } from '../../styles'
import Iconfont from '../Iconfont'
import { ReactComponent as SVGFast } from './assets/fast.svg'

const SelectTokenWrap = styled(FlexColumn, transientOptions)<{
  $showRightBorder: boolean
}>`
  position: relative;
  /* flex: 1; */
  width: ${(props) => (!props.$showRightBorder ? '100%' : '68%')};
  height: 48px;
  border-right: ${(props) =>
    props.$showRightBorder
      ? `1px solid  ${props.theme.color.text10}`
      : 'unset'};
  flex: unset;
  padding-left: 12px;
  justify-content: center;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
    border-right: unset;
  }
`
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
  svg {
    margin-right: 17px;
  }
  .img-wrap {
    overflow: hidden;
    background: ${(props) => props.theme.color.text10};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 4px;

    img {
      flex-shrink: 0;
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
`
const CoinItem = styled(FlexStart)`
  margin: 0 8px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text90};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.color.bgGray};
  }
  img {
    flex-shrink: 0;
    display: flex;
    width: 24px;
    height: 24px;
    margin-right: 6px;
    border-radius: 50%;
  }
`
const SelectTokenSelectorInfo = styled(FlexStart)``

const Popup = styled('div')`
  top: 48px;
  left: 0;
  padding: 8px 0;
  margin: 12px 0 0;
  position: absolute;
  border-radius: 12px;
  min-width: 100%;
  z-index: 10;
  background: ${(props) => props.theme.color.bg};
  // border: 1px solid #e1e3e7;
  border-radius: 6px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12),
    0px 10px 15px -3px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.04);
`
const SearchInput = styled('input')`
  width: calc(100% - 16px);
  height: 40px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text30};
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.color.text10};
  background: unset;
  margin: 0 8px;
  &:focus {
    border: none;
    border-bottom: 1px solid #e1e3e7;
    outline: none;
    box-shadow: none;
  }
`
const SelectorInfoRight = styled('div')`
  display: flex;
  margin-right: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #9199b1;
  svg {
    margin-right: 0;
  }
`
const SupportFast = styled('div')`
  display: flex;
  margin-right: 10px;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 0;
  }
`

const TokenLise = styled('div')`
  max-height: 300px;
  overflow: auto;
`
export const SelectToken: FC<{
  tokenList: Currency[]
  onTokenSelected?: (token: Currency) => void
  selectedToken: Currency
  selectedNetwork?: ChainInfo
  showSupportFast?: boolean
  showRightBorder?: boolean
  showTitle?: boolean
  showSearch?: boolean
}> = memo(
  ({
    tokenList = [],
    onTokenSelected,
    selectedToken,
    selectedNetwork,
    showSupportFast = false,
    showRightBorder = false,
    showTitle = true,
    showSearch = true,
  }) => {
    const { t } = useTranslation()
    const [inputToken, setInputToken] = useState<string>('')
    const [isIn, setIsIn] = useState(false)
    const modalRef = useRef<any>()
    // const [selectedToken, setSelectedToken] = useState<Token>({})

    const selectedTokenChain = useMemo(() => {
      if (selectedNetwork?.layerTwoChainId) {
        return selectedToken?.chains?.[selectedNetwork.layerTwoChainId]
      }
      return undefined
    }, [selectedToken, selectedNetwork])

    const filterTokens = useMemo(() => {
      let newTokenList = tokenList

      newTokenList = newTokenList.filter((item) => {
        const up = item?.name ? item?.name.toUpperCase() : ''
        return up.indexOf(inputToken.toUpperCase()) > -1
      })
      return newTokenList
    }, [tokenList, inputToken])

    useOnClickOutside(modalRef, () => setIsIn(false))

    return (
      <SelectTokenWrap ref={modalRef} $showRightBorder={showRightBorder}>
        {showTitle && (
          <SelectTokenTitle>
            {i18n.t('select-token', { defaultValue: 'Token' })}
          </SelectTokenTitle>
        )}
        <SelectTokenSelector onClick={() => setIsIn(!isIn)}>
          <SelectTokenSelectorInfo>
            <div className="img-wrap">
              {selectedToken?.tokenIconUrl && (
                <img src={selectedToken?.tokenIconUrl} alt="" />
              )}
            </div>
            <span>{selectedToken?.name ? selectedToken?.name : 'Select'}</span>
          </SelectTokenSelectorInfo>
          <SelectorInfoRight>
            {showSupportFast && selectedTokenChain?.fastWithdraw ? (
              <SupportFast>
                <SVGFast /> <span>Support fast withdrawal</span>
              </SupportFast>
            ) : null}
            <Iconfont name="icon-ArrowDown" size={20} />
          </SelectorInfoRight>
        </SelectTokenSelector>
        <Fade in={isIn} timeout={200}>
          <Popup>
            {showSearch && (
              <SearchInput
                type={'text'}
                placeholder={
                  t('common-placeholder', { defaultValue: 'Search' }) ?? ''
                }
                onChange={(e) => {
                  setInputToken(e.currentTarget.value)
                }}
              />
            )}
            <TokenLise>
              {filterTokens.map((item) => {
                return (
                  <CoinItem
                    onClick={() => {
                      // setSelectedToken(item)
                      onTokenSelected && onTokenSelected(item)
                      isIn && setIsIn(false)
                    }}
                    key={item.id}>
                    <img src={item.tokenIconUrl} alt="" />
                    <span>{item.name}</span>
                  </CoinItem>
                )
              })}
            </TokenLise>
          </Popup>
        </Fade>
      </SelectTokenWrap>
    )
  }
)
