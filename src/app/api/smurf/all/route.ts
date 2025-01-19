import prisma from "@/libs/prisma";
import {NextResponse} from "next/server";

export async function GET(): Promise<NextResponse> {
    const smurfs = await prisma.peoples.findMany();
    return NextResponse.json(smurfs);
}