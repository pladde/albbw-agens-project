import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home'
import { AddFahrrad } from './pages/AddFahrrad';
import { SearchFahrrad } from './pages/SearchFahrrad';
import { FahrradMain } from './pages/FahrradMain';
import { Header } from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <main style={{ 
        backgroundColor: '#e7e7e7',
        minHeight: '100vh'          // Mindestens volle Bildschirmhöhe
      }}>
        <Routes>
          <Route path='/' element={<Home/>} />       
          <Route path='/fahrrad' element={<FahrradMain/>} />          
          <Route path='/fahrrad/erfassen' element={<AddFahrrad />} />
          <Route path='/fahrrad/suchen' element={<SearchFahrrad />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;