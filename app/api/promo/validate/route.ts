import { NextResponse } from 'next/server';
import pool, { promoCode} from '@/lib/db';

export async function POST(request : Request){
    try {
        const { code, subtotal } = await request.json();
        if(!code || !subtotal){
            return NextResponse.json(
                {valid : false, error : "code and subtotal are required"},
                {status : 400},
            )
        }

        const result = await pool.query<promoCode>(`SELECT 
            code,
            discount_type as "discountType",
            discount_value as "discountValue"
            FROM promo_codes
            WHERE UPPER(code) = UPPER($1) AND active = true
            `,[code])

            if(result.rows.length == 0){
                return NextResponse.json(
                    {error : "Invalid Promo Code"},
                    {status : 400},
                )
            }

            const promo = result.rows[0];
            let discount = 0;
            if(promo.discountType === 'percentage'){
                discount = Math.round((subtotal * promo.discountValue) / 100);
            } else {
                discount = promo.discountValue;
            }

            const finalAmount = subtotal - discount;

            return NextResponse.json(
                {
                    valid : true,
                    code : promo.code.toUpperCase(),
                    discount,
                    finalAmount,
                }
            )

    } catch (error) {
        console.error('Promo validation error :', error)
        return NextResponse.json(
            {valid : false, error : 'Failed to validate promo code'},
            {status : 500}
        )
    }
}
