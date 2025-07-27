import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import UploadProduct from "./pages/UploadProduct";
import Login from "./auth/Login";
import PrivateRoute from "./util/PrivateRoute";

const App =()=>{
  return(
    <div>
      
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/login" element={<Login />}/>

          <Route path="/uploadproduct" element={
            <PrivateRoute>
              <UploadProduct />
            </PrivateRoute>
          } />


        </Routes>

      </div>
    </div>
  )
}

export default App;