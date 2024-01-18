import { Connection } from 'connection/types'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { useAppDispatch } from 'store'
import { updateModal } from 'store/app/actions'
import { useIsDepositMobilePage } from 'store/deposit/hook'
import { updateLinkStatus } from 'store/link/actions'
import { LinkStatus } from 'store/link/types'
import { L1ChainId } from 'types'
import { setRecentConnectionMeta } from './meta'
import { didUserReject } from './utils'

export enum ActivationStatus {
  PENDING,
  ERROR,
  IDLE,
}

type ActivationPendingState = {
  status: ActivationStatus.PENDING
  connection: Connection
}
type ActivationErrorState = {
  status: ActivationStatus.ERROR
  connection: Connection
  error: any
}
const IDLE_ACTIVATION_STATE = { status: ActivationStatus.IDLE } as const
type ActivationState =
  | ActivationPendingState
  | ActivationErrorState
  | typeof IDLE_ACTIVATION_STATE

const activationStateAtom = atom<ActivationState>(IDLE_ACTIVATION_STATE)

function useTryActivation() {
  const dispatch = useAppDispatch()
  const setActivationState = useSetAtom(activationStateAtom)

  const isDepositMobilePage = useIsDepositMobilePage()

  return useCallback(
    async (
      connection: Connection,
      onSuccess: () => void,
      chainId?: L1ChainId
    ) => {
      // Skips wallet connection if the connection should override the default
      // behavior, i.e. install MetaMask or launch Coinbase app
      if (connection.overrideActivate?.(chainId)) return

      try {
        setActivationState({ status: ActivationStatus.PENDING, connection })

        console.debug(`Connection activating: ${connection.getName()}`)
        await connection.connector.activate()

        console.debug(`Connection activated: ${connection.getName()}`)

        setRecentConnectionMeta({
          type: connection.type,
        })

        // Clears pending connection state
        setActivationState(IDLE_ACTIVATION_STATE)

        dispatch(updateLinkStatus(LinkStatus.linkL1Success))
        dispatch(updateModal({ modal: 'wallets', open: false }))
        if (!isDepositMobilePage) {
          dispatch(updateModal({ modal: 'verify', open: true }))
        }

        onSuccess && onSuccess()
      } catch (error) {
        // Gracefully handles errors from the user rejecting a connection attempt
        if (didUserReject(connection, error)) {
          setActivationState(IDLE_ACTIVATION_STATE)
          return
        }

        // TODO(WEB-1859): re-add special treatment for already-pending injected errors & move debug to after didUserReject() check
        console.debug(`Connection failed: ${connection.getName()}`)
        console.error(error)

        setActivationState({
          status: ActivationStatus.ERROR,
          connection,
          error,
        })
      }
    },
    [dispatch, setActivationState, isDepositMobilePage]
  )
}

function useCancelActivation() {
  const setActivationState = useSetAtom(activationStateAtom)
  return useCallback(
    () =>
      setActivationState((activationState) => {
        if (activationState.status !== ActivationStatus.IDLE)
          activationState.connection.connector.deactivate?.()
        return IDLE_ACTIVATION_STATE
      }),
    [setActivationState]
  )
}

export function useActivationState() {
  const activationState = useAtomValue(activationStateAtom)
  const tryActivation = useTryActivation()
  const cancelActivation = useCancelActivation()

  return { activationState, tryActivation, cancelActivation }
}
