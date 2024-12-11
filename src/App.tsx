import { Outlet } from 'react-router-dom'
import './App.css'
import { Provider } from './Store/Store'
import { GridContainer } from './Component/GridContainer/GridContainer'
import { Header } from './Component/Header/Header'

function App() {

  return (
    <Provider>
      <div className="App">
      <Header />
        <GridContainer>
          <div className="Outlet">
            <Outlet />
          </div>
        </GridContainer>
        {/* <Footer /> */}
      </div>
    </Provider>
  )
}

export default App
