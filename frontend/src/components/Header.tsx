import { Container, Row, Col, Breadcrumb, Image, Form } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/agens_logo.png';
import profilePicture from '../assets/agens_default_profile_picture.png';

// Header.txt = tägt die Inhalte des Headers, die vom Layout eingefügt werden



export const Header: React.FC = () => {
    const location = useLocation();
    
    const pathnames = location.pathname.split('/').filter((x) => x);

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

                {/* Form und Profilbild */}
                <Col xs={4} className="d-flex align-items-center justify-content-end">
                    <Form.Select className='me-4' style={{ width: '250px', height: '50px', fontSize: '20px'}}>
                        <option value='NK'>Neukölln</option>
                        <option value='SP'>Spandau</option>
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