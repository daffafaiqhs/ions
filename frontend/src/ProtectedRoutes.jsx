import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function ProtectedRoutes({ fileData, children, path }) {
  const [isChecksComplete, setIsChecksComplete] = useState(false);
  const navigate = useNavigate();

  const allowedPathToNotHaveKey = ["login", "register", "hero"];
  const allowedPathToNotHaveData = [...allowedPathToNotHaveKey, "upload"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/auth`, {
          credentials: "include",
          method: "POST",
        });

        const isKeyValid = response.ok;

        if (!isKeyValid && !allowedPathToNotHaveKey.includes(path)) {
          navigate("/login");
        } else if (isKeyValid && allowedPathToNotHaveKey.includes(path)) {
          navigate("/dashboard");
        } else {
          setIsChecksComplete(true);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      }
    };

    if (allowedPathToNotHaveKey.includes(path)) {
      setIsChecksComplete(true);
    } else {
      checkAuth();
    }
  }, [path]);

  if (fileData.length === 0 && !allowedPathToNotHaveData.includes(path)) {
    return <Navigate to="/upload" replace />;
  }

  return isChecksComplete && children;
}
export default ProtectedRoutes;
