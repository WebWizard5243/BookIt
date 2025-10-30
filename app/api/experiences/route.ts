import { NextResponse } from "next/server";
import pool, { Experience } from "@/lib/db";

export async function GET (){
    try {
        const result = await pool.query<Experience>("SELECT * FROM experiences");
       return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database error', error);
       return NextResponse.json({ error : "Failed to Fetch experiences"}, {status : 500});
    }
}