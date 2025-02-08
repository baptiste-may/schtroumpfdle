import {NextRequest, NextResponse} from "next/server";
import prisma from "@/libs/prisma";

export async function GET(_: NextRequest, {params}: {
    params: Promise<{
        id: string;
    }>
}): Promise<NextResponse> {
    const {id} = await params;
    const smurf = await prisma.smurfs.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (smurf == null) return NextResponse.json("Smurf not found.", {
        status: 404
    });
    return NextResponse.json(smurf);
}