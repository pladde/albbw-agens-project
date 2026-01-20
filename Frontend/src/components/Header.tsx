import { Container, Breadcrumb, Image, Dropdown, DropdownItem  } from 'react-bootstrap';

export const Header = () => {

    return (
        <Container>
            <div>
                <Breadcrumb></Breadcrumb>
            </div>

            <div>
                <Image></Image>
            </div>


            <div>
                <Dropdown>
                    <DropdownItem>Neukölln</DropdownItem>
                </Dropdown>
            </div>

            <div>
                <Image></Image>
            </div>

        </Container>
    );
};