import { NextResponse } from 'next/server'
import pool, { Experience, Slot } from '@/lib/db';

export async function GET(
    request : Request,
    {params} : {params : Promise<{id : string}>}
){
try {
    const {id} = await params;
    const result = await pool.query<Experience>("SELECT * FROM experiences WHERE id = $1",[id]);
    if(result.rows.length == 0){
        return NextResponse.json(
            {error : "No experience found"},
            {status : 404},
        )
    }

    const slotResult = await pool.query<Slot>(`SELECT 
        id,
        TO_CHAR(date, 'YYYY-MM-DD') as date,
        TO_CHAR(time, 'HH12:MI am') as time,
        total_capacity as "totalCapacity",
        booked_count as "bookedCount",
        (total_capacity-booked_count) as available
        FROM slots
        WHERE experience_id = $1
        `,[id]);

        const experience = result.rows[0];

        return NextResponse.json({
            ...experience,
            slots : slotResult.rows,
        });
} catch (error) {
    console.error("database error",error);
    return NextResponse.json ( { error : "Failed to Fetch experience"},{status : 500})
}
}