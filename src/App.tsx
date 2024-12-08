import { Outlet } from 'react-router-dom'
import './App.css'
import { Provider } from './Store/Store'
import { GridContainer } from './Component/GridContainer/GridContainer'

function App() {

  return (
    <Provider>
      <div className="App">
        {/* <Header /> */}
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
