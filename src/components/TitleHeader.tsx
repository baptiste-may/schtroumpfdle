"use client";

import {Header, Image} from "semantic-ui-react";

export default function TitleHeader() {
    return (
        <Header as="h1" className="!tw-text-6xl">
            <Image src="/logo.webp" alt="Le logo n'a pas pû être chargé" width={628} height={643}/>
            <Header.Content>
                Schtroumpfdle
                <Header.Subheader>
                    Quel est le Schtroumpf du jour ?
                </Header.Subheader>
            </Header.Content>
        </Header>
    );
}