import {Smurfs} from "@prisma/client";
import {Button, Card, Header, Icon, Image, Modal} from "semantic-ui-react";
import {useState} from "react";
import {getSpeciesString} from "@/utils.ts";

export default function ResultModal({data}: {
    data?: Smurfs;
}) {

    const [isOpen, setIsOpen] = useState(true);

    if (data === undefined) return <></>;

    const {img, name, species, first_episode} = data;

    return (
        <Modal
            closeIcon
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Header as="h1">
                <Icon name="check circle"/>
                <Header.Content>
                    Bravo !
                    <Header.Subheader>
                        Tu as trouvé le Schtroumpf du jour !
                    </Header.Subheader>
                </Header.Content>
            </Header>
            <Modal.Content>
                <Card.Group centered>
                    <Card color="blue" link>
                        <Image src={img} wrapped ui={false} alt="image"/>
                        <Card.Content>
                            <Card.Header>{name}</Card.Header>
                            <Card.Meta>{getSpeciesString(species)}</Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            {`Première apparition : ${new Date(first_episode).toLocaleString("fr", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}`}
                        </Card.Content>
                    </Card>
                </Card.Group>
            </Modal.Content>
            <Modal.Actions>
                <Button primary content="Youpii !" onClick={() => setIsOpen(false)}/>
            </Modal.Actions>
        </Modal>
    );
}