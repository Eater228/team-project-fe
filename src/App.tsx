import { Outlet } from 'react-router-dom'
import './App.css'
// import { Provider } from './Store/Store'
import { GridContainer } from './Component/GridContainer/GridContainer'
import { Header } from './Component/Header/Header'
import { Provider } from 'react-redux'
import store from './Store/Store'

function App() {

  return (
    
      <div className="App">
      <Header />
        <GridContainer>
          <div className="Outlet">
            <Outlet />
          </div>
        </GridContainer>
        {/* <Footer /> */}
      </div>
  )
}

export default App
