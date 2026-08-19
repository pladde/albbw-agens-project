import {Route, Routes, useLocation, Link, BrowserRouter} from 'react-router-dom';
import logo from '../src/assets/agens_logo.png';
import profilePicture from '../src/assets/agens_default_profile_picture.png';
import './App.css'
import { DienstleistungPage } from './pages/dienstleistungen/DienstleistungPage';
import { DienstleistungSuchenPage } from './pages/dienstleistungen/DienstleistungSuchenPage';
import { DienstleistungErfassenPage } from './pages/dienstleistungen/DienstleistungErfassenPage';
import {Layout} from "./components/Layout";

// App.tsx = Wegbeschreibung des Clients, wenn eine URL eingegeben wird, wird die Seite X angezeigt.


function App() {
    return (
            <Routes>
                <Route  element={<Layout />}>
                <Route path="/dienstleistung" element={<DienstleistungPage />} />
                <Route path="/dienstleistung/suchen" element={<DienstleistungSuchenPage />} />
                <Route path="/dienstleistung/erfassen" element={<DienstleistungErfassenPage />} />
                <Route path="/dienstleistung/erfassen/:id" element={<DienstleistungErfassenPage />} />
                </Route>
            </Routes>
    );
}
export default App

