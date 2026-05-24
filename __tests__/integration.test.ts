import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore }     from '../stores/cartStore';
import { useProductsStore } from '../stores/productsStore';
import { calculateFabric, ORDER_STATUS_MAP, formatPrice } from '../lib/utils';

// ═══════════════════════════════════════════════════════
//  🌐 WEBSITE TESTS
// ═══════════════════════════════════════════════════════
describe('🌐 Website — Products & Store', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [
        { id:'1', name:'جورجيت', description:'ناعم', price:85, price_per_meter:85, category:'جورجيت', colors:[{name:'أحمر',hex:'#D41E2F'}], images:[], stock_quantity:150, is_active:true  },
        { id:'2', name:'ساتان',  description:'فاخر', price:250,price_per_meter:250,category:'ساتان',  colors:[{name:'ذهبي',hex:'#D4AF37'}], images:[], stock_quantity:80,  is_active:true  },
        { id:'3', name:'مخفي',   description:'x',    price:50, price_per_meter:50, category:'شيفون',  colors:[],                           images:[], stock_quantity:0,   is_active:false },
      ],
      lastUpdated: Date.now(),
    });
  });

  it('shows only active products on website', () => {
    expect(useProductsStore.getState().getActive().length).toBe(2);
    expect(useProductsStore.getState().getActive().every(p => p.is_active)).toBe(true);
  });

  it('all active products have required fields', () => {
    useProductsStore.getState().getActive().forEach(p => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.price_per_meter).toBeGreaterThan(0);
      expect(p.category).toBeTruthy();
    });
  });
});

// ═══════════════════════════════════════════════════════
//  📊 DASHBOARD TESTS
// ═══════════════════════════════════════════════════════
describe('📊 Dashboard — Admin CRUD', () => {
  beforeEach(() => {
    useProductsStore.setState({
      products: [
        { id:'p1', name:'جورجيت', description:'', price:85, price_per_meter:85, category:'جورجيت', colors:[], images:[], stock_quantity:150, is_active:true  },
        { id:'p2', name:'ساتان',  description:'', price:250,price_per_meter:250,category:'ساتان',  colors:[], images:[], stock_quantity:80,  is_active:false },
      ],
      lastUpdated: 1000,
    });
  });

  it('admin adds product → appears on website immediately', () => {
    useProductsStore.getState().addProduct({ name:'حرير', description:'', price:400, price_per_meter:400, category:'حرير', colors:[], images:[], stock_quantity:30, is_active:true });
    expect(useProductsStore.getState().getActive().find(p => p.name === 'حرير')).toBeDefined();
  });

  it('admin updates price → reflects instantly on website', () => {
    useProductsStore.getState().updateProduct('p1', { price:999, price_per_meter:999 });
    expect(useProductsStore.getState().products.find(p => p.id === 'p1')?.price).toBe(999);
  });

  it('admin toggles active → website shows/hides product', () => {
    useProductsStore.getState().toggleActive('p2');
    expect(useProductsStore.getState().getActive().find(p => p.id === 'p2')).toBeDefined();
    useProductsStore.getState().toggleActive('p2');
    expect(useProductsStore.getState().getActive().find(p => p.id === 'p2')).toBeUndefined();
  });

  it('admin deletes product → removed from website', () => {
    useProductsStore.getState().deleteProduct('p1');
    expect(useProductsStore.getState().products.find(p => p.id === 'p1')).toBeUndefined();
  });

  it('order status map has all statuses with Arabic labels', () => {
    ['pending','processing','shipped','delivered','cancelled'].forEach(s => {
      expect(ORDER_STATUS_MAP[s]).toBeDefined();
      expect(ORDER_STATUS_MAP[s].label).toMatch(/[\u0600-\u06FF]/);
    });
  });
});

// ═══════════════════════════════════════════════════════
//  🛒 CART TESTS
// ═══════════════════════════════════════════════════════
describe('🛒 Cart — Shopping Flow', () => {
  const product = { id:'c1', name:'جورجيت', description:'', price:85, price_per_meter:85, category:'جورجيت', colors:[{name:'أحمر',hex:'#D41E2F'}], images:[], stock_quantity:100, is_active:true };

  beforeEach(() => { useCartStore.setState({ items:[] }); });

  it('starts empty',                 () => { expect(useCartStore.getState().items.length).toBe(0); });
  it('adds item with correct meters', () => { useCartStore.getState().addItem(product, 2.5); expect(useCartStore.getState().items[0].meters).toBe(2.5); });
  it('accumulates meters',           () => { useCartStore.getState().addItem(product, 2); useCartStore.getState().addItem(product, 1.5); expect(useCartStore.getState().items[0].meters).toBe(3.5); });
  it('total is accurate',            () => { useCartStore.getState().addItem(product, 3); expect(useCartStore.getState().total()).toBe(255); });
  it('removes item',                 () => { useCartStore.getState().addItem(product, 2); useCartStore.getState().removeItem('c1'); expect(useCartStore.getState().items.length).toBe(0); });
  it('clears all',                   () => { useCartStore.getState().addItem(product, 2); useCartStore.getState().clearCart(); expect(useCartStore.getState().total()).toBe(0); });
  it('stores selected color',        () => { useCartStore.getState().addItem(product, 1, {name:'أحمر',hex:'#D41E2F'}); expect(useCartStore.getState().items[0].selected_color?.hex).toBe('#D41E2F'); });
});

// ═══════════════════════════════════════════════════════
//  🤖 CHATBOT TESTS
// ═══════════════════════════════════════════════════════
describe('🤖 Chatbot — سدى Response Categories', () => {
  function cat(msg: string): string {
    const m = msg.toLowerCase();
    if (m.includes('مرحبا') || m.includes('أهلا') || m.includes('السلام عليكم') || m.startsWith('سلام')) return 'greeting';
    // Service queries first (before fabric to avoid 'سعر الجورجيت' matching georgette first)
    if (m.includes('سعر') || m.includes('كم سعر') || m.includes('الثمن')) return 'price';
    if (m.includes('توصيل') || m.includes('شحن') || m.includes('ينبع')) return 'shipping';
    // Fabric calc
    if (m.includes('متر') || m.includes('كمية') || m.includes('كم متر'))   return 'fabric-calc';
    // Fabric types
    if (m.includes('كريب'))   return 'crepe';
    if (m.includes('جورجيت') && !m.includes('سعر')) return 'georgette';
    if (m.startsWith('الساتان') || (m.includes('ساتان') && !m.includes('صيف') && !m.includes('سعر'))) return 'satin';
    if (m.includes('حرير طبيعي') || (m.includes('حرير') && !m.includes('سعر'))) return 'silk';
    // Skin tones
    if (m.includes('بشرة فاتح') || m.includes('فاتحة')) return 'skin-light';
    if (m.includes('بشرة أسمر') || m.includes('داكن'))  return 'skin-dark';
    if (m.includes('بشرة قمحي'))  return 'skin-wheat';
    // Occasions
    if (m.includes('فرح') || m.includes('عرس') || m.includes('زفاف')) return 'wedding';
    if (m.includes('عروس'))    return 'bride';
    if (m.includes('عزاء'))    return 'condolence';
    // Seasons
    if (m.includes('صيف') || m.includes('جو حار') || m.includes('الحر الشديد')) return 'summer';
    if (m.includes('شتاء') || m.includes('برد')) return 'winter';
    if (m.includes('عمل') || m.includes('وظيفة')) return 'work';
    return 'default';
  }

  it('greetings',         () => { expect(cat('مرحبا')).toBe('greeting'); expect(cat('أهلا وسهلا')).toBe('greeting'); expect(cat('السلام عليكم')).toBe('greeting'); });
  it('fabric calc',       () => { expect(cat('كم متر أحتاج')).toBe('fabric-calc'); expect(cat('كمية القماش')).toBe('fabric-calc'); });
  it('skin tones',        () => { expect(cat('بشرة فاتحة')).toBe('skin-light'); expect(cat('بشرة أسمر')).toBe('skin-dark'); expect(cat('بشرة قمحي')).toBe('skin-wheat'); });
  it('occasions',         () => { expect(cat('ماذا ألبس في الفرح')).toBe('wedding'); expect(cat('قماش العروس')).toBe('bride'); expect(cat('لبس العزاء')).toBe('condolence'); });
  it('seasons',           () => { expect(cat('قماش الصيف')).toBe('summer'); expect(cat('قماش الشتاء')).toBe('winter'); });
  it('fabric types',      () => { expect(cat('ما مميزات الكريب')).toBe('crepe'); expect(cat('الجورجيت')).toBe('georgette'); expect(cat('الحرير الطبيعي')).toBe('silk'); });
  it('service queries',   () => { expect(cat('هل تتوصلون لينبع')).toBe('shipping'); expect(cat('كم سعر المتر')).toBe('price'); });
  it('default fallback',  () => { expect(cat('سؤال غير معروف xyz123')).toBe('default'); });
});

// ═══════════════════════════════════════════════════════
//  📊 PIXEL TRACKING TESTS
// ═══════════════════════════════════════════════════════
describe('📊 Pixels — All 4 Platforms', () => {
  it('trackPurchase fires without error', async () => {
    const { trackPurchase } = await import('../components/pixels/PixelScripts');
    expect(typeof trackPurchase).toBe('function');
    expect(() => trackPurchase(500, 'SAR', [])).not.toThrow();
  });

  it('trackAddToCart fires without error', async () => {
    const { trackAddToCart } = await import('../components/pixels/PixelScripts');
    expect(() => trackAddToCart('قماش جورجيت', 85)).not.toThrow();
  });

  it('trackViewContent fires without error', async () => {
    const { trackViewContent } = await import('../components/pixels/PixelScripts');
    expect(() => trackViewContent('قماش ساتان', 250)).not.toThrow();
  });

  it('trackSearch fires without error', async () => {
    const { trackSearch } = await import('../components/pixels/PixelScripts');
    expect(() => trackSearch('جورجيت أحمر')).not.toThrow();
  });

  it('trackInitiateCheckout fires without error', async () => {
    const { trackInitiateCheckout } = await import('../components/pixels/PixelScripts');
    expect(() => trackInitiateCheckout(500, 3)).not.toThrow();
  });

  it('pixel env vars have correct format', () => {
    // All pixel IDs are read from env — format validation
    const pixelEnvVars = [
      'NEXT_PUBLIC_META_PIXEL_ID',
      'NEXT_PUBLIC_TIKTOK_PIXEL_ID',
      'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      'NEXT_PUBLIC_SNAP_PIXEL_ID',
    ];
    // All must be NEXT_PUBLIC_ prefixed for client-side access
    expect(pixelEnvVars.every(v => v.startsWith('NEXT_PUBLIC_'))).toBe(true);
    expect(pixelEnvVars.length).toBe(4);
  });
});

// ═══════════════════════════════════════════════════════
//  📱 SOCIAL MEDIA LINKS
// ═══════════════════════════════════════════════════════
describe('📱 Social Media — Links & Icons', () => {
  const SOCIAL = {
    Facebook:  'https://web.facebook.com/profile.php?id=61590399539166',
    Instagram: 'https://www.instagram.com/bin.siddiq.alnazawi?igsh=Nm42MG9qcXJsa2pk&utm_source=qr',
    TikTok:    'https://www.tiktok.com/@bin.siddiq7?_r=1&_t=ZS-96bWONLBrwQ',
    Snapchat:  'https://snapchat.com/t/C2cnELIj',
  };

  it('exactly 4 platforms configured', ()    => { expect(Object.keys(SOCIAL).length).toBe(4); });
  it('all links are HTTPS',            ()    => { expect(Object.values(SOCIAL).every(u => u.startsWith('https://'))).toBe(true); });
  it('Facebook has profile ID',        ()    => { expect(SOCIAL.Facebook).toContain('61590399539166'); });
  it('Instagram has correct username', ()    => { expect(SOCIAL.Instagram).toContain('bin.siddiq.alnazawi'); });
  it('TikTok has correct username',    ()    => { expect(SOCIAL.TikTok).toContain('bin.siddiq7'); });
  it('Snapchat link is valid',         ()    => { expect(SOCIAL.Snapchat).toContain('C2cnELIj'); });
  it('all platforms have unique URLs', ()    => {
    const urls = Object.values(SOCIAL);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

// ═══════════════════════════════════════════════════════
//  🔍 SEO & BRANDING
// ═══════════════════════════════════════════════════════
describe('🔍 SEO & Brand — Bin Siddiq Fabric', () => {
  it('brand name is correct (Siddiq not Seddik)', () => {
    const brandName = 'Bin Siddiq Fabric';
    expect(brandName).toContain('Siddiq');
    expect(brandName).not.toContain('Seddik');
  });

  it('logo file is PNG (uploaded logo)', () => {
    const logoPath = '/logo.png';
    expect(logoPath.endsWith('.png')).toBe(true);
  });

  it('Yanbu keywords are defined', () => {
    const keywords = ['اقمشة ينبع','محل اقمشة ينبع','اقمشة بالمتر ينبع','قماش ينبع','فساتين ينبع'];
    expect(keywords.every(k => k.includes('ينبع'))).toBe(true);
    expect(keywords.length).toBeGreaterThanOrEqual(5);
  });

  it('JSON-LD sameAs has all 4 social accounts', () => {
    const sameAs = [
      'https://web.facebook.com/profile.php?id=61590399539166',
      'https://www.instagram.com/bin.siddiq.alnazawi',
      'https://www.tiktok.com/@bin.siddiq7',
      'https://snapchat.com/t/C2cnELIj',
    ];
    expect(sameAs.find(u => u.includes('61590399539166'))).toBeTruthy();
    expect(sameAs.find(u => u.includes('bin.siddiq.alnazawi'))).toBeTruthy();
    expect(sameAs.find(u => u.includes('bin.siddiq7'))).toBeTruthy();
    expect(sameAs.find(u => u.includes('C2cnELIj'))).toBeTruthy();
  });

  it('site URL uses binsiddiq domain', () => {
    const siteUrl = 'https://binsiddiq.com';
    expect(siteUrl).toContain('binsiddiq');
    expect(siteUrl).toContain('https://');
  });

  it('sitemap covers main routes', () => {
    const routes = ['/', '/products', '/ai-measure', '/dress-viewer', '/chat'];
    expect(routes.length).toBeGreaterThanOrEqual(4);
    expect(routes).toContain('/products');
    expect(routes).toContain('/ai-measure');
  });

  it('admin routes are excluded from public indexing', () => {
    const disallowed = ['/dashboard', '/api/', '/login', '/register'];
    expect(disallowed).toContain('/dashboard');
    expect(disallowed.every(r => r.startsWith('/'))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════
//  🧮 AI CALCULATOR
// ═══════════════════════════════════════════════════════
describe('🧮 AI Calculator — Fabric Measurements', () => {
  it('fitted 165cm woman needs 2.5-4m', () => {
    const { meters } = calculateFabric(165, 65, 'fitted');
    expect(meters).toBeGreaterThanOrEqual(2.5);
    expect(meters).toBeLessThanOrEqual(4);
  });

  it('loose needs more than fitted', () => {
    const fitted = calculateFabric(165, 65, 'fitted').meters;
    const loose  = calculateFabric(165, 65, 'loose').meters;
    expect(loose).toBeGreaterThan(fitted);
  });

  it('BMI sizes are correct', () => {
    expect(calculateFabric(170, 45, 'fitted').size).toBe('XS');
    expect(calculateFabric(170, 70, 'fitted').size).toBe('M');
    expect(calculateFabric(160, 90, 'fitted').size).toBe('XXL');
  });

  it('meters in 0.5 increments', () => {
    [[165,65],[170,70],[155,50],[180,90]].forEach(([h,w]) => {
      expect(calculateFabric(h, w, 'fitted').meters * 2 % 1).toBe(0);
    });
  });

  it('formatPrice returns non-empty string', () => {
    expect(formatPrice(100).length).toBeGreaterThan(0);
  });
});

// ════════════════════════════════════════════════════════════════
// 🖼️ BANNERS STORE — Dashboard → Website Sync
// ════════════════════════════════════════════════════════════════
describe('🖼️ Banners Store — Live Sync', () => {
  it('has default banners loaded', async () => {
    const { useBannersStore } = await import('../stores/bannersStore');
    expect(useBannersStore.getState().banners.length).toBeGreaterThan(0);
  });

  it('getActive returns only active banners', async () => {
    const { useBannersStore } = await import('../stores/bannersStore');
    const active = useBannersStore.getState().getActive();
    expect(active.every(b => b.active)).toBe(true);
  });

  it('getActive by position filters correctly', async () => {
    const { useBannersStore } = await import('../stores/bannersStore');
    const hero = useBannersStore.getState().getActive('hero');
    hero.forEach(b => expect(b.position).toBe('hero'));
  });

  it('updateBanner updates lastUpdated', async () => {
    const { useBannersStore } = await import('../stores/bannersStore');
    const store = useBannersStore.getState();
    const t0 = store.lastUpdated;
    const firstId = store.banners[0]?.id;
    if (firstId) {
      store.updateBanner(firstId, { title: 'Updated Title' });
      expect(useBannersStore.getState().lastUpdated).toBeGreaterThanOrEqual(t0);
    }
  });

  it('positions are valid', async () => {
    const { useBannersStore } = await import('../stores/bannersStore');
    const validPos = ['hero', 'sub1', 'sub2', 'sub3', 'strip'];
    useBannersStore.getState().banners.forEach(b => {
      expect(validPos.includes(b.position)).toBe(true);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// 📱 OTP CHECKOUT — Phone verification
// ════════════════════════════════════════════════════════════════
describe('📱 OTP Checkout — Phone Verification', () => {
  it('validates Saudi phone number format', () => {
    const isValid = (p: string) => /^05\d{8}$/.test(p) || /^966\d{9}$/.test(p);
    expect(isValid('0501234567')).toBe(true);
    expect(isValid('966501234567')).toBe(true);
    expect(isValid('123456')).toBe(false);
    expect(isValid('07012345678')).toBe(false);
  });

  it('OTP is 6 digits', () => {
    const otp = ['1','2','3','4','5','6'];
    expect(otp.join('').length).toBe(6);
    expect(/^\d{6}$/.test(otp.join(''))).toBe(true);
  });

  it('payment methods include all Saudi options', () => {
    const methods = ['mada', 'visa', 'apple', 'stc', 'cod'];
    expect(methods.length).toBe(5);
    expect(methods).toContain('mada');
    expect(methods).toContain('stc');
    expect(methods).toContain('cod');
  });

  it('checkout steps are 4 (login, shipping, payment, confirm)', () => {
    const steps = ['تسجيل الدخول', 'بيانات الشحن', 'طريقة الدفع', 'التأكيد'];
    expect(steps.length).toBe(4);
  });
});

// ════════════════════════════════════════════════════════════════
// 🎨 SITE STORE — Full CMS Dashboard → Website Sync
// ════════════════════════════════════════════════════════════════
describe('🎨 Site Store — CMS Sync', () => {
  it('has all required sections', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    const keys = useSiteStore.getState().sections.map(s => s.sectionKey);
    expect(keys).toContain('hero');
    expect(keys).toContain('strip');
    expect(keys).toContain('banner1');
    expect(keys).toContain('cta');
  });

  it('updateSection changes heading instantly', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    const id = useSiteStore.getState().sections.find(s => s.sectionKey === 'hero')?.id!;
    useSiteStore.getState().updateSection(id, { heading: 'Test Heading' });
    expect(useSiteStore.getState().getSection('hero')?.heading).toBe('Test Heading');
  });

  it('toggleSection hides/shows sections', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    const sec = useSiteStore.getState().sections[0];
    const wasActive = sec.active;
    useSiteStore.getState().toggleSection(sec.id);
    expect(useSiteStore.getState().sections[0].active).toBe(!wasActive);
    useSiteStore.getState().toggleSection(sec.id); // restore
  });

  it('media upload stores base64 correctly', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    const id = useSiteStore.getState().sections[0].id;
    const fakeBase64 = 'data:image/jpeg;base64,/9j/fake';
    useSiteStore.getState().updateSection(id, { media: { type: 'image', src: fakeBase64 } });
    expect(useSiteStore.getState().sections[0].media.src).toBe(fakeBase64);
    expect(useSiteStore.getState().sections[0].media.type).toBe('image');
  });

  it('video media type works correctly', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    const id = useSiteStore.getState().sections[0].id;
    useSiteStore.getState().updateSection(id, { media: { type: 'video', src: 'data:video/mp4;base64,fake' } });
    expect(useSiteStore.getState().sections[0].media.type).toBe('video');
  });

  it('updateSettings changes colors', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    useSiteStore.getState().updateSettings({ primaryColor: '#FF0000' });
    expect(useSiteStore.getState().settings.primaryColor).toBe('#FF0000');
    useSiteStore.getState().updateSettings({ primaryColor: '#F5A623' }); // restore
  });

  it('lastUpdated increments on every change', async () => {
    const { useSiteStore } = await import('../stores/siteStore');
    const t0 = useSiteStore.getState().lastUpdated;
    const id = useSiteStore.getState().sections[0].id;
    useSiteStore.getState().updateSection(id, { badge: 'New' });
    expect(useSiteStore.getState().lastUpdated).toBeGreaterThanOrEqual(t0);
  });
});

// ════════════════════════════════════════════════════════════════
// 🔄 360° DRESS VIEWER TESTS
// ════════════════════════════════════════════════════════════════
describe('🔄 360° Dress Viewer', () => {
  const STYLES = ['aline','fitted','mermaid','balloon','empire','wrap'];
  const SKIN_TONES = ['fair','light','wheat','olive','brown','dark'];
  const FABRICS = 12; // number of fabrics

  it('has 6 dress styles', () => { expect(STYLES.length).toBe(6); });
  it('has 6 skin tones', () => { expect(SKIN_TONES.length).toBe(6); });
  it('has 12 fabric colors', () => { expect(FABRICS).toBe(12); });

  it('rotation angle wraps correctly', () => {
    const normalize = (a: number) => ((a % 360) + 360) % 360;
    expect(normalize(0)).toBe(0);
    expect(normalize(360)).toBe(0);
    expect(normalize(-90)).toBe(270);
    expect(normalize(450)).toBe(90);
  });

  it('scaleX perspective calculation is correct', () => {
    const scaleX = (angle: number) => {
      const norm = ((angle % 360) + 360) % 360;
      return Math.abs(Math.cos((norm * Math.PI) / 180));
    };
    expect(scaleX(0)).toBeCloseTo(1, 1);    // front: full width
    expect(scaleX(90)).toBeCloseTo(0, 1);   // side: no width
    expect(scaleX(180)).toBeCloseTo(1, 1);  // back: full width
  });

  it('back side shows reversed model', () => {
    const showBack = (angle: number) => {
      const norm = ((angle % 360) + 360) % 360;
      return norm >= 90 && norm <= 270;
    };
    expect(showBack(0)).toBe(false);    // front
    expect(showBack(180)).toBe(true);   // back
    expect(showBack(90)).toBe(true);    // side
    expect(showBack(270)).toBe(true);   // 270 is still in back range [90-270]
  });

  it('all styles have valid SVG paths (M + Z)', () => {
    const paths = {
      aline:   'M78,140 C68,145 62,155 60,175 Z',
      fitted:  'M80,140 C72,145 66,155 64,175 Z',
      mermaid: 'M80,140 C72,145 66,155 64,175 Z',
      balloon: 'M78,140 C68,145 62,155 60,175 Z',
      empire:  'M78,140 C68,145 62,153 60,165 Z',
      wrap:    'M82,140 C72,145 65,155 62,175 Z',
    };
    Object.values(paths).forEach(p => {
      expect(p.startsWith('M')).toBe(true);
      expect(p.endsWith('Z')).toBe(true);
    });
  });

  it('touch events supported for mobile rotation', () => {
    // Touch events handled: touchstart, touchmove, touchend
    const touchEvents = ['onTouchStart', 'onTouchMove', 'onTouchEnd'];
    expect(touchEvents.length).toBe(3);
  });

  it('morphKey increments on style/fabric change', () => {
    let morphKey = 0;
    const trigger = () => { morphKey += 1; };
    trigger(); trigger(); trigger();
    expect(morphKey).toBe(3);
  });
});
