
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddFahrrad } from './pages/AddFahrrad';
import { SearchFahrrad } from './pages/SearchFahrrad';
import { Home } from './pages/Home';
// import { fahrradService } from './services/fahrradService';
// import { Header } from './components/Header';


function App() 
{
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/erfassen' element={<AddFahrrad />} />
        <Route path='/suchen' element={<SearchFahrrad />} />
      </Routes>
    </Router>
  );
}

export default App;