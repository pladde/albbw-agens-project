import { Container, Row, Breadcrumb, Image, Dropdown, DropdownItem  } from 'react-bootstrap';
import logo from '../assets/agens_logo.png';

export const Header = () => {

    return (
        <Container className='md-4'>
            
            <Row>
                <col>
                    <Breadcrumb>
                    </Breadcrumb>
                </col>

                <col>
                    <Image src={logo} alt='agens_logo'></Image>
                </col>

                <col>
                <Dropdown>
                    <DropdownItem>Neukölln</DropdownItem>
                </Dropdown>
                <Image>
                </Image>
                </col>
            </Row>

        </Container>
    );
};