import { Route, Routes } from "react-router-dom";

import ListView from "./pages/List";
import DetailView from "./pages/Detail";

const App = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ListView />} />
        <Route path=":ownerId" element={<DetailView />} />
      </Route>
    </Routes>
  );
};

export default App;
