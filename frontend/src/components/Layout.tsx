import { Outlet } from 'react-router-dom';
import { Header } from './Header'; // Pfad anpassen, falls nötig


// Layout = Schablone der Oberfläche, Header bleibt gleich, Outlet stellt die aktuelle Seite dar



export const Layout: React.FC = () => {
    return (
        <div style ={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}> {/* Abstand für den Header */}
                <Outlet /> {/* Hier werden die Routen-Inhalte gerendert */}
            </main>
        </div>
    );
};
