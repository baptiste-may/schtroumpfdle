import {Button, Header, Icon, Message, Modal} from "semantic-ui-react";
import {useState} from "react";

export default function InfoModal() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Modal
            closeIcon
            size="tiny"
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            trigger={<Button
                className="tw-fixed tw-top-2 tw-right-2 !tw-rounded-full"
                icon
                size="large"
                secondary
            >
                <Icon name="question"/>
            </Button>}
        >
            <Header as="h1">
                <Icon name="info circle"/>
                <Header.Content>
                    Informations
                    <Header.Subheader>
                        Site web créé par <a href="https://may-baptiste.fr" target="_blank" className="!tw-underline">Baptiste
                        May</a>
                    </Header.Subheader>
                </Header.Content>
            </Header>
            <Modal.Content>
                <Message icon color="teal">
                    <Icon name="certificate"/>
                    <Message.Content>
                        <Message.Header>Librairies CSS</Message.Header>
                        La majorité du style vient de <a href="https://react.semantic-ui.com" target="_blank"
                                                         className="!tw-underline">Semantic
                        UI</a> accompagné par <a href="https://tailwindcss.com" target="_blank"
                                                 className="!tw-underline">TailwindCSS</a>
                    </Message.Content>
                </Message>
                <Message icon warning>
                    <Icon name="warning sign"/>
                    <Message.Content>
                        <Message.Header>Vous avez rencontré un problème ?</Message.Header>
                        {"N'hésitez pas à me contacter via "}<a
                        href="mailto:pro@may-baptiste.fr"
                        className="!tw-underline">pro@may-baptiste.fr</a>
                    </Message.Content>
                </Message>
                <Message icon color="grey">
                    <Icon name="code"/>
                    <Message.Content>
                        <Message.Header>Code source</Message.Header>
                        {"L'ensemble du code source est disponible "}<a
                        href="https://github.com/baptiste-may/schtroumpfdle" target="_blank"
                        className="!tw-underline">ici</a>
                    </Message.Content>
                </Message>
            </Modal.Content>
        </Modal>
    );
}