import { styled } from '@mui/material'
import { FC, useMemo } from 'react'
import { useSupportChains } from 'store/app/hooks'
import { FlexAlignCenter } from 'styles'

const ChainWrap = styled(FlexAlignCenter)`
  color: ${(props) => props.theme.color.text50};
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
`
const ChainIcon = styled('img')`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  margin-right: 8px;
  border: none;
  &:not([src]),
  &[src=''] {
    opacity: 0;
  }
`

const Chain: FC<{
  chainId?: string
}> = ({ chainId = '' }) => {
  const chains = useSupportChains()
  const chainInfo = useMemo(() => {
    return chains.find((item) => item.layerTwoChainId + '' === chainId)
  }, [chains, chainId])

  return (
    <ChainWrap>
      <ChainIcon src={chainInfo?.iconUrl} alt=" " />
      {chainInfo?.name}
    </ChainWrap>
  )
}

export default Chain
