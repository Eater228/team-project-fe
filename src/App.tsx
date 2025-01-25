import { Outlet } from 'react-router-dom'
import './App.css'
import { GridContainer } from './Component/GridContainer/GridContainer'
import { Header } from './Component/Header/Header'
import { Provider } from 'react-redux'
import store from './Store/Store'
import { Footer } from './Component/Footer'
import { BackToTop } from './Component/BackToTop/BackToTop';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <div className="Content" style={{ paddingTop: '80px' }}>
          {/* <GridContainer> */}
            <div className="Outlet">
              <Outlet />
            </div>
          {/* </GridContainer> */}
        </div>
        <Footer />
        <BackToTop />
      </div>
    </Provider>
  )
}

export default App
