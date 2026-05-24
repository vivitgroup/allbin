import { NextRequest, NextResponse } from 'next/server';
import { calculateFabric } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { height_cm, weight_kg, dress_style, has_pattern } = body;

    // Validate — strict types
    if (typeof height_cm  !== 'number') return NextResponse.json({ error: 'height_cm يجب أن يكون رقماً' }, { status: 400 });
    if (typeof weight_kg  !== 'number') return NextResponse.json({ error: 'weight_kg يجب أن يكون رقماً' }, { status: 400 });
    if (typeof dress_style !== 'string') return NextResponse.json({ error: 'dress_style مطلوب' },           { status: 400 });

    if (height_cm < 100 || height_cm > 250) return NextResponse.json({ error: 'الطول يجب أن يكون بين 100 و 250 سم' }, { status: 422 });
    if (weight_kg < 20  || weight_kg > 250) return NextResponse.json({ error: 'الوزن يجب أن يكون بين 20 و 250 كجم' }, { status: 422 });

    const validStyles = ['fitted', 'semi-fitted', 'loose', 'mermaid'];
    if (!validStyles.includes(dress_style)) {
      return NextResponse.json({ error: `dress_style يجب أن يكون: ${validStyles.join(', ')}` }, { status: 422 });
    }

    const result = calculateFabric(height_cm, weight_kg, dress_style);
    const finalMeters = has_pattern ? result.meters + 0.5 : result.meters;

    const notes: string[] = [
      `طولك ${height_cm} سم ووزنك ${weight_kg} كجم (BMI: ${result.bmi})`,
      `موديل ${dress_style === 'fitted' ? 'ضيق' : dress_style === 'loose' ? 'واسع' : dress_style === 'mermaid' ? 'حورية البحر' : 'نصف ضيق'} يحتاج تقريباً ${finalMeters} متر`,
      has_pattern ? 'تم إضافة 0.5 متر إضافي لمطابقة النقش' : 'يُنصح بإضافة 0.5 متر احتياطياً للخياطة',
    ];

    return NextResponse.json(
      { estimated_meters: finalMeters, recommended_size: result.size, bmi: result.bmi, notes },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطأ غير متوقع';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
