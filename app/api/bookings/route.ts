import { NextResponse } from "next/server";
import pool, { Booking } from "@/lib/db";

function generateReferenceId(): string {
  // Remove O & 0 for confusion
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789' 
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}



export async function POST( request : Request){
    const client = await pool.connect();
    try {
        const body = await request.json();
        const {slotId,fullName, email, quantity, promoCode } = body
        
        //validate required fields
        if(!slotId || !fullName || !email || !quantity){
            return NextResponse.json(
                {error : ' missing required fields'},
                { status : 400}
            )
        }

        //start transaction

        await client.query('BEGIN');
         //get slot details and lock the row
        const slotResult = await client.query(`
            SELECT
            s.*,
            e.price
            FROM slots s
            JOIN experiences e on s.experience_id = e.id
            WHERE s.id = $1
            FOR UPDATE
            `,[slotId]);
            if (slotResult.rows.length == 0){
                await client.query("ROLLBACK");
                return NextResponse.json(
                    {error : "Slot not found"},
                    {status : 404},
                )
            }

            const slot = slotResult.rows[0];
            const experienceId = slot.experience_id;
            const available = slot.total_capacity - slot.booked_count;

            //check Availability
            if( available < quantity) {
                await client.query('ROLLBACK')
                return NextResponse.json(
                    { error : ` Only ${available} slots available`},
                    {status : 400}
                )
            }

            //Calculate Pricing
            let subtotal = slot.price * quantity;
            let discount = 0;

            // Apply promo code if provided 
            if(promoCode){
                const promoResult = await client.query(`
                    SELECT discount_type, discount_value
                    FROM promo_codes
                    WHERE UPPER(code) = UPPER($1) and active = true
                    `,[promoCode]);

                      if (promoResult.rows.length > 0) {
        const promo = promoResult.rows[0]
        
        if (promo.discount_type === 'percentage') {
          discount = Math.round((subtotal * promo.discount_value) / 100)
        } else {
          discount = promo.discount_value
        }
        
        subtotal = subtotal - discount
      }
    }
    
    // Calculate tax (6%)
    const taxes = Math.round(subtotal * 0.06)
    const total = subtotal + taxes
    
    // Generate reference ID
    const referenceId = generateReferenceId()
    
    // Create booking
    const bookingResult = await client.query<Booking>(`
      INSERT INTO bookings (
        reference_id, slot_id, experience_id, full_name, email, quantity, 
        promo_code, subtotal, taxes, total
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [referenceId, slotId, experienceId, fullName, email, quantity, promoCode || null, subtotal, taxes, total])
    
    // Update slot booked count
    await client.query(`
      UPDATE slots 
      SET booked_count = booked_count + $1 
      WHERE id = $2
    `, [quantity, slotId])
    
    // Commit transaction
    await client.query('COMMIT')
    
    return NextResponse.json({
      success: true,
      booking: bookingResult.rows[0]
    })

    } catch (error) {
        await client.query('ROLLBACK')
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
    }
