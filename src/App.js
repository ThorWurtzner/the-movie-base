import './App.scss';
import Search from "./components/Search/Search";
import { Router } from "@reach/router";
import SingleView from "./components/SingleView/SingleView";
import { useState } from "react";
import dataContext from "./Context";

function App() {

  var dataArray = useState([]);
  var [ searchInput, setSearchInput ] = useState("");
  var [ page, setPage ] = useState(1);


  return (
    <div className="App">
      <dataContext.Provider value={dataArray}>
        <Router>
          <Search path="/" pageState={{page, setPage}} searchState={{searchInput, setSearchInput}} />
          <SingleView path="/single-view/:id" />
        </Router>
      </dataContext.Provider>
    </div>
  );
}

export default App;
