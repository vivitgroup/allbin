import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CONVERSATION_SYSTEM_PROMPT = `أنتِ "سدى" — مستشارة الأقمشة الذكية لمتجر بن صديق للأقمشة الفاخرة في ينبع، المملكة العربية السعودية.

## شخصيتك وأسلوبك في المحادثة:
- خبيرة أزياء ودودة ومحترفة بخبرة 20 سنة في السوق السعودي
- تُدِيرين محادثة طبيعية وإنسانية — مش مجرد إجابات جافة
- تسألين عن احتياجات العميلة لتفهمي وضعها بشكل أعمق
- تقترحين الخطوة التالية دائماً (مثلاً: "هل تودين أعطيكِ نصيحة عن الألوان المناسبة؟")
- تستخدمين أسلوباً عربياً دافئاً ومحببًا
- تُبدين اهتماماً حقيقياً بما تحتاجه العميلة
- عند الإجابة على سؤال، دائماً اسألي سؤالاً متابعة ذكياً لتعمقي المحادثة
- تذكري اسم العميلة إذا عرفتِه

## إطار المحادثة:
- إذا سألت عن قماش → اسألي: لأي مناسبة؟ ما موسم الارتداء؟
- إذا سألت عن لون → اسألي: ما لون بشرتها؟ ما المناسبة؟
- إذا سألت عن الكمية → اسألي: ما طولها؟ ما موديل الفستان؟
- إذا سألت عن سعر → أجيبي وسألي: هل تودين مقارنة أنواع مختلفة؟
- دائماً اختمي بـ: "هل أقدر أساعدك في شيء آخر؟" أو سؤال ذكي مرتبط

## المنتجات:
- جورجيت فاخر: 85 ر.س/م | ساتان ملكي: 250 ر.س/م | شيفون: 65 ر.س/م
- قطن مصري: 45 ر.س/م | كريب: 95 ر.س/م | حرير طبيعي: 450 ر.س/م
- قطيفة ملكية: 180 ر.س/م | دانتيل فرنسي: 320 ر.س/م

## قواعد:
- إجاباتك مختصرة ومفيدة (4-6 سطور)
- استخدمي emoji باعتدال للتعبير والإيضاح
- دائماً اقترحي منتجاً مناسباً عند الإمكان
- إذا احتاجت مساعدة عاجلة: أحيليها على واتساب 0501234567`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'الرسائل مطلوبة' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    if (lastMessage.length > 1000) {
      return NextResponse.json({ error: 'الرسالة طويلة جداً' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: getConversationalFallback(lastMessage, messages),
        source: 'fallback',
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: CONVERSATION_SYSTEM_PROMPT,
        messages: messages.slice(-12),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        reply: getConversationalFallback(lastMessage, messages),
        source: 'fallback',
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'عذراً، لم أتمكن من الرد. يرجى المحاولة مرة أخرى.';

    return NextResponse.json({ reply, source: 'ai' });

  } catch (error) {
    return NextResponse.json({
      reply: 'عذراً، حدث خطأ مؤقت. تواصلي معنا مباشرة عبر واتساب للمساعدة الفورية! 📱',
      source: 'error',
    }, { status: 200 });
  }
}

// ── Conversational fallback ──────────────────────────
function getConversationalFallback(message: string, history: Message[]): string {
  const msg = message.toLowerCase();
  const isFirstMsg = history.length <= 2;

  if (isFirstMsg || msg.includes('مرحبا') || msg.includes('أهلا') || msg.includes('هاي')) {
    return '👋 أهلاً وسهلاً! أنا سدى، مستشارتك للأقمشة في بن صديق.\n\nيسعدني مساعدتك اليوم! هل تبحثين عن قماش لمناسبة معينة، أم تودين معرفة أفضل الألوان لبشرتك؟ 🧵✨';
  }

  if (msg.includes('متر') || msg.includes('كمية') || msg.includes('كم متر')) {
    return '🧮 بكل سرور! لأحسب لك الكمية الدقيقة، أحتاج معرفة:\n• طولك (بالسم)؟\n• موديل الفستان (ضيق، واسع، حورية البحر)؟\n\nأو يمكنك استخدام حاسبة القماش الذكية في الموقع للحصول على نتيجة فورية دقيقة! 🎯';
  }

  if (msg.includes('لون') || msg.includes('بشرة')) {
    return '🌸 اختيار اللون المناسب سر إطلالتك!\n\nما لون بشرتك؟ (فاتح، قمحي، زيتوني، أسمر؟)\nوما المناسبة التي تحضرين لها؟\n\nبناءً على إجابتك سأقترح لك ألواناً ستبدين فيها رائعة! ✨';
  }

  if (msg.includes('سعر') || msg.includes('كم سعر')) {
    return '💰 أسعارنا تبدأ من 45 ر.س/م للقطن المصري وتصل لـ 450 ر.س/م للحرير الطبيعي الفاخر.\n\nأي نوع قماش تفكرين فيه؟ سأساعدك تجدي الأفضل لميزانيتك وذوقك! 😊';
  }

  if (msg.includes('مناسبة') || msg.includes('فرح') || msg.includes('عرس')) {
    return '💍 للمناسبات الراقية لدينا تشكيلة رائعة!\n\nهل المناسبة فرح عائلي، حفل رسمي، أم مناسبة خاصة؟\nوما ميزانيتك التقريبية للمتر الواحد؟\n\nسأرشحك لأجمل الخيارات! 🌹';
  }

  if (msg.includes('شحن') || msg.includes('توصيل')) {
    return '🚚 نوصل لجميع مناطق المملكة!\n\n✅ شحن مجاني للطلبات فوق 200 ر.س\n⚡ التوصيل خلال 2-5 أيام عمل\n📍 موقعنا: ينبع، المنطقة الغربية\n\nهل تودين تفاصيل عن طريقة الطلب؟ 😊';
  }

  return '🧵 سؤال رائع! يمكنني مساعدتك في اختيار القماش المناسب، حساب الكميات، أو الألوان.\n\nما الذي تبحثين عنه تحديداً؟ كلما أخبرتني أكثر، كلما أفدتك بشكل أفضل! ✨';
}
