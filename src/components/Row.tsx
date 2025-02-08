"use client";

import {Smurfs} from "@prisma/client";
import {Header, Icon, Image, Label, Table} from "semantic-ui-react";
import {useEffect, useState} from "react";
import {getSpeciesString} from "@/utils.ts";

export default function Row({data: {id, name, img, sex, species, ennemies, looks, first_episode}, onFinded}: {
    data: Smurfs;
    onFinded: (id: number) => void;
}) {

    const [testResult, setTestResult] = useState<undefined | {
        name: boolean;
        sex: boolean;
        species: boolean;
        first_episode: 1 | 0 | -1;
        ennemies: Record<string, boolean>;
        looks: Record<string, boolean>;
    }>();

    useEffect(() => {
        fetch(`/api/smurf/${id}/test`)
            .then(res => res.json())
            .then(data => {
                setTestResult(data);
                if (data.name) onFinded(id);
            });
    }, []);

    return (
        <Table.Row positive={testResult && testResult.name} negative={testResult && !testResult.name}>
            <Table.Cell>
                <Image src={img} size="mini" alt="avatar" avatar/>
                <span>{name}</span>
            </Table.Cell>
            <Table.Cell positive={testResult && testResult.sex} negative={testResult && !testResult.sex}>
                {sex ? "Féminin" : "Masculin"}
            </Table.Cell>
            <Table.Cell positive={testResult && testResult.species} negative={testResult && !testResult.species}>
                {getSpeciesString(species)}
            </Table.Cell>
            <Table.Cell
                positive={testResult && Object.values(testResult.ennemies).every(value => value)}
                negative={testResult && Object.values(testResult.ennemies).every(value => !value)}
            >
                {ennemies.map(ennemy =>
                    <Label
                        key={ennemy}
                        color={testResult ? testResult.ennemies[ennemy] ? "green" : "red" : "grey"}
                    >{ennemy}</Label>
                )}
            </Table.Cell>
            <Table.Cell
                positive={testResult && Object.values(testResult.looks).every(value => value)}
                negative={testResult && Object.values(testResult.looks).every(value => !value)}
            >
                {looks.map((look, i) =>
                    <Label
                        key={i}
                        color={testResult ? testResult.looks[look] ? "green" : "red" : "grey"}
                    >{look}</Label>
                )}
            </Table.Cell>
            <Table.Cell positive={testResult && testResult.first_episode === 0}
                        negative={testResult && testResult.first_episode !== 0}>
                <Header as="h5" textAlign="center" icon style={{marginBottom: 0}}>
                    <Icon
                        name={testResult ? testResult.first_episode === 0 ? "check" : (testResult.first_episode === -1 ? "calendar plus" : "calendar minus") : "clock"}
                        color={testResult ? testResult.first_episode === 0 ? "green" : "red" : "grey"}
                    />
                    <Header.Subheader>
                        {new Date(first_episode).toLocaleDateString("fr", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </Header.Subheader>
                </Header>
            </Table.Cell>
        </Table.Row>
    );
}