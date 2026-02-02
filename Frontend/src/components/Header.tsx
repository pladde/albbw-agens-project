import { Container, Row, Col, Breadcrumb, Image, Form } from 'react-bootstrap';
import logo from '../assets/agens_logo.png';
import profilePicture from '../assets/agens_default_profile_picture.jpg';

import type { HeaderProps } from '../types/BreadcrumbPath';

export const Header: React.FC<HeaderProps> = ({ breadcrumbPaths } ) => {

    return (
        <Container fluid style={{
            background: 'linear-gradient(90deg, #425272 0%, #2C4371 100%)',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center'
            }}>
            
            <Row className='align-items-center justify-content-start w-100'>

                {/* Breadcrumbs*/}
                <Col xs={4} className="text-start">
                    <Breadcrumb className='mb-0'>
                        {breadcrumbPaths.map((path, index) => (
                            <Breadcrumb.Item
                                key={index}
                                href={path.link}
                                active={path.active}>
                                    {path.label}
                                </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </Col>

                {/* Logo */}
                <Col xs={4} className="text-center">
                    <Image src={logo} alt='agens_logo' className="w-50"></Image>
                </Col>

                {/* Select-Form und Profilbild */}
                <Col xs={4} className="d-flex align-items-center justify-content-end">

                    {/* Select-Form */}
                    <Form.Select 
                        className='me-3 ' 
                        aria-label='Standort auswählen'
                        style={{ width: 'auto' }}>
                            <option value='NK'>Neukölln</option>
                            <option value='SP'>Spandau</option>
                    </Form.Select>

                    {/* Profilbild */}
                    <Image 
                        src={profilePicture} 
                        alt='default_profile_picture' 
                        roundedCircle
                        style={{height: '60px', width: '60px', objectFit: 'cover'}}>   
                    </Image>
                </Col>
            </Row>

        </Container>
    );
};