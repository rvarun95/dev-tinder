import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Profile from "./components/Profile"
import Feed from "./components/Feed"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"

function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              {/* <Route path="/feed" element={<div>Feed</div>} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
            </Route>
          </Routes>
        
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
