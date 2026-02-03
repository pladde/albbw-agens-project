import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AddFahrrad } from './pages/AddFahrrad';
import { SearchFahrrad } from './pages/SearchFahrrad';
import { Home } from './pages/Home';
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
          <Route path='/erfassen' element={<AddFahrrad />} />
          <Route path='/suchen' element={<SearchFahrrad />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;