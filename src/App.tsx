import { Route, Routes } from "react-router-dom";
import UploadProduct from "./pages/UploadProduct";
import Login from "./auth/Login";
import PrivateRoute from "./util/PrivateRoute";
import Test from "./auth/Test";
import MainPage from "./pages/mainPage";

const App =()=>{
  return(
    <div>
      
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/login" element={<Test />}/>

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



