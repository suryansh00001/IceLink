import { useEffect } from "react";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to IceLink:", socket.id);
    });
  }, []);

  return <h1>IceLink</h1>;
}

export default App;
