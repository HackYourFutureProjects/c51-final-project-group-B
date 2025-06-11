import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper";
import SocketManager from "./components/SocketManager/SocketManager.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

/**
 * UserProvider must wrap SocketManager because socket logic
 * depends on the user's authentication state and credentials.
 */
createRoot(document.getElementById("root")).render(
  <UserProvider>
    <SocketManager>
      <AppWrapper>
        <App />
      </AppWrapper>
    </SocketManager>
  </UserProvider>,
);
