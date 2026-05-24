import { NextRequest, NextResponse } from 'next/server';

// NOTE: In production, replace with Supabase queries.
// These are the same products as the client store seed data.
const PRODUCTS = [
  { id:'1', name:'قماش جورجيت فاخر',  description:'قماش ناعم ومريح مثالي للفساتين الرسمية، يتميز بملمسه الناعم وسقوطه الجميل.',  price:85,  price_per_meter:85,  category:'جورجيت', colors:[{name:'أحمر',hex:'#D41E2F'},{name:'أسود',hex:'#1A1A1A'}], images:[], stock_quantity:150, is_active:true },
  { id:'2', name:'قماش ساتان ملكي',    description:'لامع وفاخر للمناسبات الخاصة والأعراس، يضيف لمسة من الأناقة.',                price:250, price_per_meter:250, category:'ساتان',   colors:[{name:'ذهبي',hex:'#D4AF37'},{name:'أبيض',hex:'#F5F5F5'}], images:[], stock_quantity:80,  is_active:true },
  { id:'3', name:'قماش شيفون شفاف',    description:'خفيف ومريح مناسب للصيف والمناسبات النهارية.',                                 price:65,  price_per_meter:65,  category:'شيفون',   colors:[{name:'كحلي',hex:'#1E3A5F'},{name:'وردي',hex:'#FFB6C1'}], images:[], stock_quantity:200, is_active:true },
  { id:'4', name:'قماش قطن مصري',      description:'قطن 100% طبيعي فاخر مريح طوال اليوم.',                                        price:45,  price_per_meter:45,  category:'قطن',     colors:[{name:'أبيض',hex:'#FFFFFF'},{name:'بيج',hex:'#F5DEB3'}],  images:[], stock_quantity:300, is_active:true },
  { id:'5', name:'قماش كريب مبتكر',    description:'مناسب لجميع المناسبات بنعومة استثنائية.',                                      price:95,  price_per_meter:95,  category:'كريب',    colors:[{name:'زيتوني',hex:'#556B2F'},{name:'برغندي',hex:'#800020'}], images:[], stock_quantity:120, is_active:true },
  { id:'6', name:'قماش حرير طبيعي',    description:'أرقى الحرير الطبيعي من أفضل المصادر العالمية.',                               price:450, price_per_meter:450, category:'حرير',    colors:[{name:'فضي',hex:'#B8B8B8'},{name:'ذهبي',hex:'#D4AF37'}],  images:[], stock_quantity:50,  is_active:true },
  { id:'7', name:'قماش قطيفة ملكية',   description:'فخامة لا مثيل لها للمناسبات الراقية.',                                        price:180, price_per_meter:180, category:'قطيفة',  colors:[{name:'أحمر داكن',hex:'#8B0000'},{name:'أزرق ملكي',hex:'#4169E1'}], images:[], stock_quantity:60, is_active:true },
  { id:'8', name:'قماش دانتيل فرنسي',  description:'دانتيل فرنسي أصيل للفساتين العرائس والسهرات.',                                price:320, price_per_meter:320, category:'دانتيل',  colors:[{name:'أبيض عاجي',hex:'#FFFFF0'}], images:[], stock_quantity:40, is_active:true },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category  = searchParams.get('category');
  const search    = searchParams.get('q')?.toLowerCase();
  const id        = searchParams.get('id');
  const activeOnly = searchParams.get('active') !== 'false';

  let results = activeOnly ? PRODUCTS.filter((p) => p.is_active) : PRODUCTS;

  if (id)       results = results.filter((p) => p.id === id);
  if (category) results = results.filter((p) => p.category === category);
  if (search)   results = results.filter((p) =>
    p.name.toLowerCase().includes(search) ||
    p.description.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search)
  );

  return NextResponse.json(
    { products: results, total: results.length },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, category } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'اسم المنتج مطلوب (2 حروف على الأقل)' }, { status: 400 });
    }
    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'السعر يجب أن يكون رقم موجب' }, { status: 400 });
    }
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'الفئة مطلوبة' }, { status: 400 });
    }

    const newProduct = {
      ...body,
      id:         `prod-${Date.now()}`,
      name:       name.trim(),
      is_active:  true,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'طلب غير صحيح' }, { status: 400 });
  }
}
