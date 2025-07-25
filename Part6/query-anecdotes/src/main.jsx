import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './components/NotificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <App />

    </NotificationProvider>
  </QueryClientProvider>
)
/* App is children
Wrapping the App is equivalent to "providing a broadcast (context)" to the entire application
Provide two global resources to my child: notification and dispatch*/
