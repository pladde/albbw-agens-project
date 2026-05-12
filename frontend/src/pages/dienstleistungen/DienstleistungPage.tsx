import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../components/custom-style-agens.css'

export const DienstleistungPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container
            fluid
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8' }}
        >
            <Button
                onClick={() => navigate('/dienstleistung/erfassen')}
                className="agens-button-primary"
                style={{
                    width: '200px',
                    height: '100px',
                    fontSize: '18px',
                    border: 'none',
                    borderRadius: '10px',
                    marginBottom: '12px',
                }}
            >
                Auftrag erfassen
            </Button>

            <Button
                onClick={() => navigate('/dienstleistung/suchen')}
                className="agens-button-primary"
                style={{
                    width: '200px',
                    height: '100px',
                    fontSize: '18px',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                }}
            >
                Auftrag suchen
            </Button>
        </Container>
    );
};
