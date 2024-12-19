import React, { use, useState } from "react";
import UploadPDF from "./components/UploadPdf";
import Login from "./components/Login";
function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  return (
    <div className="App">
      <h1>WELCOME TO DOCU</h1>
      {loggedIn ? (
        <UploadPDF />
      ) : (
        <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;
