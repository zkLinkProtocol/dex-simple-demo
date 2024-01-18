import { styled } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { darkColor } from 'styles/constants/dark'
import { lightColor } from 'styles/constants/light'

const StyledContainer = styled(ToastContainer)`
  .Toastify__toast {
    // padding-bottom: 5px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0px 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .Toastify__toast-body {
    padding: 0;
  }
  .Toastify__toast-icon {
    display: none;
  }
  .Toastify__toast--success {
    &.Toastify__toast-theme--light {
      background: ${lightColor.notificationGreen01};
      border: 1px solid ${lightColor.notificationGreen02};
      .describe {
        color: ${lightColor.text90};
      }
      .link {
        color: ${lightColor.textHighlight};
      }
    }
    &.Toastify__toast-theme--dark {
      background: ${darkColor.notificationGreen01};
      border: 1px solid ${darkColor.notificationGreen02};
      .describe {
        color: ${darkColor.text90};
      }
      .link {
        color: ${darkColor.textHighlight};
      }
    }
  }
  .Toastify__toast--error {
    &.Toastify__toast-theme--light {
      background: ${lightColor.notificationRed01};
      border: 1px solid ${lightColor.notificationRed02};
      .describe {
        color: ${lightColor.text90};
      }
    }
    &.Toastify__toast-theme--dark {
      background: ${darkColor.notificationRed01};
      border: 1px solid ${darkColor.notificationRed02};
      .describe {
        color: ${darkColor.text90};
      }
    }
  }
  .Toastify__toast--warning {
    &.Toastify__toast-theme--light {
      background: ${lightColor.notificationYellow01};
      border: 1px solid ${lightColor.notificationYellow02};
      .describe {
        color: ${lightColor.text90};
      }
    }
    &.Toastify__toast-theme--dark {
      background: ${darkColor.notificationYellow01};
      border: 1px solid ${darkColor.notificationYellow02};
      .describe {
        color: ${darkColor.text90};
      }
    }
  }
  .Toastify__toast--info {
    &.Toastify__toast-theme--light {
      background: ${lightColor.notificationBlue01};
      border: 1px solid ${lightColor.notificationBlue02};
      .describe {
        color: ${lightColor.text90};
      }
    }
    &.Toastify__toast-theme--dark {
      background: ${darkColor.notificationBlue01};
      border: 1px solid ${darkColor.notificationBlue02};
      .describe {
        color: ${darkColor.text90};
      }
    }
  }
`

export default StyledContainer
