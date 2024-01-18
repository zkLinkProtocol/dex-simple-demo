import { Interpolation } from '@emotion/styled'
import { Theme } from '@mui/material'
import { MuiThemeType } from './Themes'

export function getMuiGlobalStyleOption(theme: Theme): Interpolation<Theme> {
  return {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      color: theme?.palette?.mode === MuiThemeType.dark ? '#FFFFFF' : '#333333',
      margin: 0,
      fontFamily: '"Source Sans Pro", sans-serif, system-ui',
    },
    '#root': {
      height: '100vh',
      overflow: 'auto',
      backgroundColor: theme.color.bg,
      '::-webkit-scrollbar': {
        width: '6px',
      },
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '20px',
      background: 'rgba(3, 212, 152, .2)',
    },
    '::-webkit-scrollbar': {
      width: '4px',
    },
    a: {
      textDecoration: 'none',
    },
    ul: {
      listStyle: 'none',
    },
    img: {
      ':not([src])': {
        visibility: 'hidden',
      },
    },
    '@media (max-width: 900px)': {
      '#root': {
        width: '100%',
        overflowX: 'hidden',
      },
    },
    '@media (max-width: 600px)': {
      body: {
        overflow: 'hidden',
      },
      '.MuiTablePagination-root .MuiToolbar-root': {
        padding: 0,
        margin: '0 auto',
      },
      '.MuiTablePagination-root .MuiInputBase-colorPrimary': {
        marginRight: '20px',
      },
    },
    '.MuiPagination-root  .MuiPaginationItem-root.Mui-selected': {
      border: `1px solid ${theme?.color?.primary30}`,
      background: theme?.color?.primary10,
      color: theme.color?.primary40,
    },
    '.MuiDialogActions-root .MuiButton-textPrimary': {
      color: theme?.color?.primary30,
    },
    '.MuiPaper-root ul': {
      background: theme?.color?.bg,
    },
    '.MuiPaper-root li.MuiTablePagination-menuItem.MuiMenuItem-gutters': {
      color: theme?.color?.text80,
    },
    '.MuiPaper-root li.MuiTablePagination-menuItem.MuiMenuItem-gutters.Mui-selected':
      {
        background: theme?.color?.bgGray,
        color: theme?.color?.primary30,
      },
  }
}
