import {NextResponse} from "next/server";

export function GET(): NextResponse {
    return NextResponse.json({
        message: "Hi!"
    }, {
        status: 200
    });
}