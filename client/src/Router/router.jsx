import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserLogin from "../Screens/Users/Userlogin";
// import Dashboard from "../Screens/Dashboard/Dashboard";
import ArenaForm from "../Screens/Arena/Arenaregister";
import Allarena from "../Screens/Arena/Allarenas";
import Arenadetails from "../Screens/Arena/Arenadetails";
import SlotForm from "../Screens/Arena/Addslots";
import ProtectedRoute from "../Components/ProtectedRoutes";
import ErrorPage from "../Screens/Error/Errorpage";
import Userinfo from "../Screens/Users/Userinfo";
import RegisterForm from "../Screens/Users/Userregister";
import Uploadarenaimages from "../Screens/Arena/Uploadarenaimages";
import Arenaimages from "../Screens/Arena/Arenaimages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <UserLogin /> },
      { path: "register", element: <RegisterForm /> },
      // { path: "dashboard", element: <ProtectedRoute component={Dashboard} allowedRoles={["Admin", "User"]} /> },
      { path: "arena-register", element: <ProtectedRoute component={ArenaForm} allowedRoles={["Admin"]} /> },
      { path: "upload-image/:id", element: <ProtectedRoute component={Uploadarenaimages} allowedRoles={["Admin" , "User"]} /> },
      { path: "arena-images/:id", element: <ProtectedRoute component={Arenaimages} allowedRoles={["Admin" , "User"]} /> },
      { path: "Arenas", element: <ProtectedRoute component={Allarena} allowedRoles={["Admin" , "User"]} /> },
      { path: "arenas/:id", element: <ProtectedRoute component={Arenadetails} allowedRoles={["Admin", "User"]} /> },
      { path: "add-slots/:id/:fieldId", element: <ProtectedRoute component={SlotForm} allowedRoles={["Admin"]} /> },
      { path: "/howtobook", element: <Userinfo/> },
      { path: "*", element: <ErrorPage /> },
    ],
  },

 
]);

export default router;
