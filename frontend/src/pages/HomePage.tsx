import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../components/custom-style-agens.css';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container
            fluid
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8' }}
        >
            <h1 style={{ color: '#324360', marginBottom: '40px' }}>Willkommen bei AGENS</h1>
            <Button
                onClick={() => navigate('/dienstleistung')}
                className="agens-button-primary"
                style={{
                    width: '250px',
                    height: '80px',
                    fontSize: '18px',
                    border: 'none',
                    borderRadius: '10px',
                }}
            >
                Dienstleistungen
            </Button>
        </Container>
    );
};