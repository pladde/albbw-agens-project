import { Container, Row, Col, Breadcrumb, Image, Form } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/agens_logo.png';
import profilePicture from '../assets/agens_default_profile_picture.png';
import React from "react";
import { useBezirk } from '../contexts/BezirkContext';

// Header.txt = trägt die Inhalte des Headers, die vom Layout eingefügt werden
// Das Bezirk-Dropdown setzt den global ausgewählten Bezirk (BezirkContext).
// Alle CRUD-Seiten verwenden diesen Bezirk als Filter/Datengrundlage.

export const Header: React.FC = () => {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    // Globaler Bezirk-Zustand aus dem Context
    const { bezirke, bezirkId, setBezirkId } = useBezirk();

    return (
        <Container className='sticky-top' fluid style={{
            background: 'linear-gradient(90deg, #5374a5 0%, #324360 100%)',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            top: 0,
            left: 0,
            right: 0
        }}>
            <Row className='align-items-center justify-content-start w-100'>

                <Col xs={4}>
                    <Breadcrumb className='mb-0' style={{paddingLeft: '100px',}}>

                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                            Home
                        </Breadcrumb.Item>
                        {pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1;
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                            return (
                                <Breadcrumb.Item 
                                    key={to} 
                                    active={last}
                                    linkAs={last ? "span" : Link}
                                    linkProps={last ? {} : { to }}>
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </Breadcrumb.Item>
                            );
                        })}
                    </Breadcrumb>
                </Col>

                {/* Logo */}
                <Col xs={4} className="text-center">
                    <Image src={logo} alt='agens_logo' className="w-50" />
                </Col>

                {/* Bezirk-Dropdown und Profilbild */}
                <Col xs={4} className="d-flex align-items-center justify-content-end">
                    <Form.Select
                        className='me-4'
                        style={{ width: '250px', height: '50px', fontSize: '20px'}}
                        value={bezirkId !== null ? String(bezirkId) : ''}
                        onChange={(e) => setBezirkId(Number(e.target.value))}
                    >
                        {[...bezirke]       /* ... = Kopie erstellen von Array */
                            .sort((a, b) => a.bezirk_id - b.bezirk_id)
                            .map(bezirk => (
                                <option
                                    key={bezirk.bezirk_id}
                                    value={bezirk.bezirk_id}
                                >
                                    {bezirk.name}
                                </option>
                            ))}
                    </Form.Select>
                    <Image 
                        src={profilePicture} 
                        roundedCircle
                        style={{height: '60px', width: '60px', objectFit: 'cover'}} />
                </Col>

            </Row>
        </Container>
    );
};