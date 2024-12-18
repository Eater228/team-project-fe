import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { Root } from './Root'
import { Provider } from 'react-redux'
import store from './Store/Store'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = '677549878720-0193um104c8kjobmuktf3jppntjbe7nm.apps.googleusercontent.com'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <Root />
      </GoogleOAuthProvider>
    </StrictMode>

  </Provider>
)
