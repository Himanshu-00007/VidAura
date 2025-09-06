import SignIn from "./components/SignIn.jsx"
import {RouterProvider,Route,createBrowserRouter,createRoutesFromElements} from "react-router-dom"
function App() {
  const router=createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<SignIn/>}>

      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router} ></RouterProvider>
    </>
  )
}

export default App
