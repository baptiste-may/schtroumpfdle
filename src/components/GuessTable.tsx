"use client";

import {Peoples} from "@prisma/client";
import {Table} from "semantic-ui-react";
import Row from "@/components/Row";

export default function GuessTable({guesss, smurfs, onFinded}: {
    guesss: number[];
    smurfs: Peoples[];
    onFinded: (id: number) => void;
}) {

    if (guesss.length == 0 || smurfs.length == 0) return <></>;

    return (
        <Table celled fluid="true" selectable>
            <Table.Header>
                <Table.Row textAlign="center">
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Sexe</Table.HeaderCell>
                    <Table.HeaderCell>Espèce</Table.HeaderCell>
                    <Table.HeaderCell>Ennemis</Table.HeaderCell>
                    <Table.HeaderCell>Apparence</Table.HeaderCell>
                    <Table.HeaderCell>Première apparition</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {guesss.map(guess => <Row key={guess} data={smurfs[guess]} onFinded={onFinded}/>)}
            </Table.Body>
        </Table>
    );
}