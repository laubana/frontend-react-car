import { Route, Routes } from "react-router-dom";
import ListView from "./page/List";
import DetailView from "./page/Detail";

const App = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ListView />} />
        <Route path=":id" element={<DetailView />} />
      </Route>
    </Routes>
  );
};

export default App;
