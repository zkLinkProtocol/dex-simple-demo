import { createTheme, Theme } from '@mui/material/styles'
import { breakpoints } from 'config/theme'
import { darkColor } from './constants/dark'
import { lightColor } from './constants/light'
import { ColorType } from './constants/type'

interface CustomTheme {
  app: {
    input: {
      color: any
      background: any
      border: any
    }
    section: {
      background: any
    }
    border: {
      radius: any
    }
  }
  color: ColorType
}

declare module '@mui/material/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

export enum MuiThemeType {
  'light' = 'light',
  'dark' = 'dark',
}

// styled use dark theme
export function isDark(props: any) {
  return props.theme?.palette?.mode === MuiThemeType.dark
}
export function themeValue(
  darkValue: string | number,
  lightValue: string | number
) {
  return function (props: any) {
    return isDark(props) ? darkValue : lightValue
  }
}

export function specifyTheme(
  props: any,
  darkValue: string,
  lightValue: string
) {
  return isDark(props) ? darkValue : lightValue
}

export const muiThemes: Record<MuiThemeType, Theme> = {
  [MuiThemeType.light]: createTheme({
    breakpoints,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            minWidth: 32,
            fontFamily: 'inherit',
            fontWeight: 600,
            borderRadius: 6,
            ':hover': {
              backgroundColor: lightColor.bgGray,
            },
          },
          sizeMedium: {
            fontSize: '16px',
            lineHeight: '26px',
          },
          sizeSmall: {
            fontSize: '14px',
            lineHeight: 1.4,
            padding: '4px 8px',
          },
          outlined: {
            color: lightColor.text100,
            border: `1px solid ${lightColor.balanceGroupBorderColor}`,
            ':hover': {
              backgroundColor: lightColor.balanceGroupHoverBgColor,
            },
            ':disabled': {
              backgroundColor: lightColor.balanceGroupHoverBgColor,
            },
          },
          contained: {
            color: lightColor.text100,
            backgroundColor: lightColor.primary20,
            border: `1px solid ${lightColor.primary30}`,
            ':hover': {
              color: lightColor.text00,
              backgroundColor: lightColor.primary30,
            },
            ':disabled': {
              color: 'rgba(160,198,142,1)',
              backgroundColor: lightColor.primary50,
              borderColor: 'rgba(160, 198, 142, 1)',
            },
          },
        },
      },
    },
    typography: {
      fontFamily: 'inherit',
      button: {
        textTransform: 'none',
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: 'rgba(3, 212, 152, 1)',
        contrastText: '#fff',
      },
      error: {
        main: 'rgba(255, 74, 40, 1)',
      },
      text: {
        primary: '#333333',
        secondary: '#5F798C',
      },
    },
    app: {
      input: {
        color: '#333333',
        background: '#FFFFFF',
        border: '1px solid #FFFFFF',
      },
      section: {
        background: '#f2f2f2',
      },
      border: {
        radius: '10px',
      },
    },
    color: lightColor,
  }),
  [MuiThemeType.dark]: createTheme({
    breakpoints,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            minWidth: 32,
            fontFamily: 'inherit',
            fontWeight: 600,
            borderRadius: 6,
            ':hover': {
              backgroundColor: darkColor.bgGray,
            },
          },
          sizeMedium: {
            fontSize: '16px',
            lineHeight: '26px',
          },
          sizeSmall: {
            fontSize: '14px',
            lineHeight: 1.4,
            padding: '4px 8px',
          },
          outlined: {
            // color: darkColor.text100,
            ':hover': {
              // color: darkColor.text00,
              // backgroundColor: darkColor.primary30,
            },
          },
          contained: {
            // color: darkColor.text00,
            // backgroundColor: darkColor.primary20,
            // border: `1px solid ${darkColor.primary30}`,
            ':hover': {
              // backgroundColor: darkColor.primary30,
            },
            ':disabled': {
              // color: darkColor.primaryGreyGreen,
              backgroundColor: 'rgba(3, 212, 152, .5)',
              borderColor: 'rgba(3, 212, 152, .5)',
            },
          },
        },
      },
    },
    typography: {
      fontFamily: 'inherit',
      button: {
        textTransform: 'none',
      },
    },
    palette: {
      mode: 'dark',
      primary: {
        main: 'rgba(3, 212, 152, 1)',
        contrastText: '#fff',
      },
      error: {
        main: 'rgba(255, 74, 40, 1)',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#5F798C',
      },
    },
    app: {
      input: {
        color: '#FFFFFF',
        background: 'rgba(1, 11, 17, 1)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
      },
      section: {
        background: '#f2f2f2',
      },
      border: {
        radius: '10px',
      },
    },
    color: darkColor,
  }),
}
