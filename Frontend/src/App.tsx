
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddFahrrad } from "./pages/AddFahrrad";
import { SearchFahrrad } from "./pages/SearchFahrrad";
import { Home } from "./pages/Home";


function App() 
{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/erfassen" element={<AddFahrrad />} />
        <Route path="/suchen" element={<SearchFahrrad />} />
      </Routes>
    </Router>
  )
}

export default App;