import toastify from 'components/Toastify'
import { ConnectionType } from 'connection/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateModal } from 'store/app/actions'
import { useIsDepositMobilePage } from 'store/deposit/hook'
import { updateLinkStatus } from 'store/link/actions'
import { LinkStatus } from 'store/link/types'
import { updateConnectorName } from 'store/settings/actions'
import { useCurrentConnectorName } from 'store/settings/hooks'

const useConnectWallet = () => {
  const dispatch = useDispatch()
  const currentConnectorName = useCurrentConnectorName()
  const isDepositMobilePage = useIsDepositMobilePage()

  return useCallback(
    async (connectorName: ConnectionType) => {
      dispatch(updateLinkStatus(LinkStatus.linkL1Pending))
      try {
        // await connectorsByName[connectorName || currentConnectorName].activate()
        dispatch(updateConnectorName({ connectorName }))

        dispatch(updateLinkStatus(LinkStatus.linkL1Success))
        dispatch(updateModal({ modal: 'wallets', open: false }))
        if (!isDepositMobilePage) {
          dispatch(updateModal({ modal: 'verify', open: true }))
        }

        return Promise.resolve()
      } catch (e) {
        dispatch(updateLinkStatus(LinkStatus.linkL1Failed))
        dispatch(updateConnectorName({ connectorName: undefined }))
        try {
          if (e.message.indexOf('Unsupported chain id:') > -1) {
            // customToast.error(
            //   'Unsupported chain":"Please switch to "Rinkeby, Goerli, AVAX Testnet, or Polygon Testnet.'
            // )
          } else if (
            e.message.indexOf(
              'UserRejectedRequestError: The user rejected the request.'
            ) > -1
          ) {
            // customToast.error(
            //   'You cancelled the signature request in your wallet. Please try signing again.'
            // )
          } else {
            toastify.error(e.message)
          }
        } catch (e) {}
        return Promise.reject()
      }
    },
    [currentConnectorName]
  )
}

export default useConnectWallet
