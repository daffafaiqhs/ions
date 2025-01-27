import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import ProtectedRoutes from "./ProtectedRoutes";
import Assistants from "./components/Assistans";
import Entries from "./components/Entries";
import Login from "./components/Login";
import Register from "./components/Register";
import Boarding from "./components/Boarding";

function RoutesHandler() {
  const [fileData, setFileData] = useState([]);
  const [header, setHeader] = useState([]);

  const [inputEmail, setInputEmail] = useState([]);
  const [inputPassword, setInputPassword] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes fileData={fileData} path={"hero"}>
              <Boarding />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoutes fileData={fileData} path={"login"}>
              <Login
                inputEmail={inputEmail}
                setInputEmail={setInputEmail}
                inputPassword={inputPassword}
                setInputPassword={setInputPassword}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoutes fileData={fileData} path={"register"}>
              <Register
                inputEmail={inputEmail}
                setInputEmail={setInputEmail}
                inputPassword={inputPassword}
                setInputPassword={setInputPassword}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoutes fileData={fileData} path={"upload"}>
              <Upload setFileData={setFileData} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes fileData={fileData} path={"dashboard"}>
              <Dashboard
                fileData={fileData}
                setFileData={setFileData}
                setHeader={setHeader}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/entries"
          element={
            <ProtectedRoutes fileData={fileData} path={"entries"}>
              <Entries fileData={fileData} header={header} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/assistants"
          element={
            <ProtectedRoutes fileData={fileData} path={"assistants"}>
              <Assistants fileData={fileData} header={header} />
            </ProtectedRoutes>
          }
        />
        <Route path="/legacy" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
export default RoutesHandler;
