"use client";

import {
    Button,
    Container,
    Divider,
    Dropdown,
    Icon,
    Segment,
    SemanticTRANSITIONS,
    Transition
} from "semantic-ui-react";
import {useEffect, useState} from "react";
import {Smurfs} from "@prisma/client";
import GuessTable from "@/components/GuessTable";
import TitleHeader from "@/components/TitleHeader";
import InfoModal from "@/components/InfoModal";
import ResultModal from "@/components/ResultModal";
import {compateDays} from "@/utils";

const LOCAL_STORAGE_KEY = "last_guesss";

export default function Page() {

    const [smurfs, setSmurfs] = useState<Smurfs[]>([]);
    const [guesss, setGuesss] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<number | undefined>();
    const [submitButtonAnimation, setSubmitButtonAnimation] = useState<{
        animation: SemanticTRANSITIONS;
        visible: boolean;
    }>({
        animation: "flash",
        visible: true
    });
    const [lockSearch, setLockSearch] = useState(true);
    const [finded, setFinded] = useState<undefined | number>();

    const animateSubmitButton = (animation: SemanticTRANSITIONS) => {
        setSubmitButtonAnimation({
            animation,
            visible: true
        });
        setTimeout(() => setSubmitButtonAnimation({
            animation,
            visible: false
        }), 1);
    }

    useEffect(() => {
        fetch("/api/smurf/all")
            .then(res => res.json())
            .then(data => setSmurfs(data))
            .finally(() => {
                const lastGuessString = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (lastGuessString !== null) {
                    const {guesss, date} = JSON.parse(lastGuessString) as {
                        guesss: number[];
                        date: Date;
                    };
                    if (compateDays(new Date(), new Date(date)) === 0) setGuesss(guesss);
                    else localStorage.removeItem(LOCAL_STORAGE_KEY);
                }
                setLockSearch(false);
            });

        setInterval(() => {
            animateSubmitButton("tada");
        }, 4000);
    }, []);

    return (
        <>
            <Container className="!tw-flex tw-h-full tw-items-center tw-justify-center">
                <Segment raised padded="very" className="tw-flex tw-flex-col tw-items-center tw-w-full">
                    <TitleHeader/>
                    <Dropdown
                        search
                        selection
                        placeholder="Schtroumpf ..."
                        options={smurfs
                            .filter(({id}) => !guesss.includes(id))
                            .map(({id, name, img}) => {
                                return {
                                    key: id,
                                    text: name,
                                    value: id,
                                    image: {
                                        avatar: true,
                                        src: img,
                                    }
                                }
                            })}
                        className="big tw-mb-4"
                        value={searchValue}
                        onChange={(_, {value}) =>
                            setSearchValue(Number(value))}
                        disabled={lockSearch}
                    />
                    <Transition
                        animation={submitButtonAnimation.animation}
                        visible={submitButtonAnimation.visible}
                    >
                        <Button
                            primary
                            size="large"
                            onClick={() => {
                                if (searchValue !== undefined) {
                                    animateSubmitButton("pulse");
                                    const newGuesss = [...guesss, searchValue];
                                    setGuesss(newGuesss);
                                    setSearchValue(undefined);
                                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                                        guesss: newGuesss,
                                        date: new Date()
                                    }));
                                } else animateSubmitButton("shake");
                            }}
                            disabled={lockSearch}
                        >
                            <Icon name="search"/>
                            Proposer
                        </Button>
                    </Transition>
                    <Divider/>
                    <GuessTable guesss={guesss} smurfs={smurfs} onFinded={id => {
                        setLockSearch(true);
                        setFinded(id);
                    }}/>
                </Segment>
            </Container>
            <ResultModal data={finded !== undefined ? smurfs[finded] : undefined}/>
            <InfoModal/>
        </>
    );
}