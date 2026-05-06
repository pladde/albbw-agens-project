import { Outlet } from 'react-router-dom';
import { Header } from './Header'; // Pfad anpassen, falls nötig

export const Layout: React.FC = () => {
    return (
        <div>
            <Header />
            <main style={{ paddingTop: '60px' }}> {/* Abstand für den Header */}
                <Outlet /> {/* Hier werden die Routen-Inhalte gerendert */}
            </main>
        </div>
    );
};
