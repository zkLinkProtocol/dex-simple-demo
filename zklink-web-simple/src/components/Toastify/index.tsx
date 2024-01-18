import { styled } from '@mui/material'
import { ReactComponent as SvgClose } from 'assets/toast/close.svg'
import { ReactComponent as SvgError } from 'assets/toast/error.svg'
import { ReactComponent as SvgInfo } from 'assets/toast/info.svg'
import { ReactComponent as SvgSuccess } from 'assets/toast/success.svg'
import { ReactComponent as SvgWarning } from 'assets/toast/warning.svg'
import i18n from 'i18n'
import { FC, MouseEventHandler } from 'react'
import { toast, ToastOptions } from 'react-toastify'

interface ToastInfo {
  message: string
  title?: string
  explorer?: string
}
const MainWrap = styled('div')`
  display: flex;
  svg {
    margin-right: 10px;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    // align-items: center;
    justify-content: center;
  }
  .title {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */
  }
  .describe {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height, or 200% */

    display: flex;
    align-items: center;

    /* text-color/80 */

    color: #333743;
  }

  .explorer {
    font-size: 12px;
    line-height: 24px;
    /* identical to box height, or 200% */

    display: flex;
    align-items: center;
    text-decoration-line: underline;

    /* Controls/primary-cta-color/60 */

    color: #4c40e6;
  }
`
const CloseWrap = styled('div')`
  width: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: 12px;
  margin-right: 16px;
  &:hover {
    background: #ffffff;
  }
`
const SuccessWrap = styled(MainWrap)`
  .title {
    color: #419e6a;
  }
`
const ErrorWrap = styled(MainWrap)`
  .title {
    color: #d83232;
  }
`
const WarningWrap = styled(MainWrap)`
  .title {
    color: #ee9500;
  }
`

const InfoWrap = styled(MainWrap)`
  .title {
    color: #006ce5;
  }
`
const MessageWrap: FC<ToastInfo> = ({ message, title, explorer }) => {
  return (
    <div className="content">
      <div className="title">{title}</div>
      <div className="describe">{message}</div>
      {explorer ? (
        <a className="explorer" href={explorer} target="_black">
          {i18n.t('common-view-explorer', { defaultValue: 'View on explorer' })}
        </a>
      ) : null}
    </div>
  )
}
const CloseButton = ({
  closeToast,
}: {
  closeToast: MouseEventHandler<HTMLDivElement>
}) => (
  <CloseWrap className="material-icons" onClick={closeToast}>
    <SvgClose />
  </CloseWrap>
)
const SuccessToast: FC<ToastInfo> = ({
  message,
  title = 'Success',
  explorer,
}) => {
  return (
    <SuccessWrap>
      <SvgSuccess />
      <MessageWrap message={message} title={title} explorer={explorer} />
    </SuccessWrap>
  )
}
const ErrorToast: FC<ToastInfo> = ({ message, title = 'Failed', explorer }) => {
  return (
    <ErrorWrap>
      <SvgError />
      <MessageWrap message={message} title={title} explorer={explorer} />
    </ErrorWrap>
  )
}
const WarningToast: FC<ToastInfo> = ({
  message,
  title = 'warning',
  explorer,
}) => {
  return (
    <WarningWrap>
      <SvgWarning />
      <MessageWrap message={message} title={title} explorer={explorer} />
    </WarningWrap>
  )
}

const InfoToast: FC<ToastInfo> = ({ message, title = 'Info', explorer }) => {
  return (
    <InfoWrap>
      <SvgInfo />
      <MessageWrap message={message} title={title} explorer={explorer} />
    </InfoWrap>
  )
}
const handleToastParams = (toastInfo: ToastInfo | string) => {
  if (typeof toastInfo === 'string') {
    return {
      message: toastInfo,
    }
  } else {
    return toastInfo
  }
}

/**
 * @description custom toast
 * @param toastInfo ToastInfo | string
 * @param options ToastOptions
 */
const toastify = {
  success(toastInfo: ToastInfo | string, options?: ToastOptions | undefined) {
    const { message, title, explorer } = handleToastParams(toastInfo)
    toast.success(
      <SuccessToast message={message} title={title} explorer={explorer} />,
      {
        bodyClassName: '',
        position: 'bottom-center',
        hideProgressBar: true,
        autoClose: 2000,
        style: {},
        closeButton: CloseButton,
        ...options,
      }
    )
  },
  error(toastInfo: ToastInfo | string, options?: ToastOptions | undefined) {
    const { message, title, explorer } = handleToastParams(toastInfo)
    toast.error(
      <ErrorToast message={message} title={title} explorer={explorer} />,
      {
        bodyClassName: '',
        position: 'bottom-center',
        autoClose: 2000,

        hideProgressBar: true,
        style: {},
        closeButton: CloseButton,
        ...options,
      }
    )
  },
  warn(toastInfo: ToastInfo | string, options?: ToastOptions | undefined) {
    const { message, title, explorer } = handleToastParams(toastInfo)
    toast.warning(
      <WarningToast message={message} title={title} explorer={explorer} />,
      {
        bodyClassName: '',
        position: 'bottom-center',
        autoClose: 2000,

        hideProgressBar: true,
        style: {},
        closeButton: CloseButton,
        ...options,
      }
    )
  },
  info(toastInfo: ToastInfo | string, options?: ToastOptions | undefined) {
    const { message, title, explorer } = handleToastParams(toastInfo)
    toast.info(
      <InfoToast message={message} title={title} explorer={explorer} />,
      {
        bodyClassName: '',
        position: 'bottom-center',
        autoClose: 2000,

        hideProgressBar: true,
        style: {},
        closeButton: CloseButton,
        ...options,
      }
    )
  },
}

export default toastify
