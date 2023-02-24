import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { theme, Loader, Title } from '@gnosis.pm/safe-react-components'
import SafeProvider from '@safe-global/safe-apps-react-sdk'

import GlobalStyle from './GlobalStyle'
import App from './App'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeProvider
        loader={
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
      >
        <App />
      </SafeProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
