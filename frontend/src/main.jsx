import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const AddChargingStation = lazy(() => import("./components/AddChargingStation.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MapView = lazy(() => import("./components/MapView.jsx"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback="Loading..">
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback="Loading..">
            <Register />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Suspense fallback="Loading...">
              <Dashboard />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/map",
        element: (
          <PrivateRoute>
            <Suspense fallback="Loading...">
              <MapView />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "/add-station",
        element: (
          <Suspense fallback="Loading..">
            <AddChargingStation />
          </Suspense>
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  </StrictMode>
);
