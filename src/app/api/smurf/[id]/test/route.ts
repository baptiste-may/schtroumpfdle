import prisma from "@/libs/prisma";
import {compateDays, randomNumberByDate} from "@/utils";
import {NextRequest, NextResponse} from "next/server";

export async function GET(_: NextRequest, {params}: {
    params: Promise<{
        id: string;
    }>
}): Promise<NextResponse> {
    const {id} = await params;
    const smurfs = await prisma.smurfs.findMany();

    const tested = smurfs.find(smurf => smurf.id === Number(id));
    if (!tested) return NextResponse.json("Smurf not found.", {
        status: 404
    });

    const index = randomNumberByDate(new Date(), smurfs.length);

    const target = smurfs[index];
    return NextResponse.json({
        name: target.name === tested.name,
        sex: target.sex === tested.sex,
        species: target.species === tested.species,
        first_episode: compateDays(target.first_episode, tested.first_episode),
        ennemies: Object.fromEntries(
            tested.ennemies.map(ennemy =>
                [ennemy, target.ennemies.includes(ennemy)])
        ),
        looks: Object.fromEntries(
            tested.looks.map(look =>
                [look, target.looks.includes(look)])
        )
    });
}