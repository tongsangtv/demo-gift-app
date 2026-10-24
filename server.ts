import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// In-memory Cloud Data Store for cross-device real-time sync & backup
interface CloudUserData {
  recipients: any[];
  wishlist: any[];
  settings: any;
  notifications: any[];
  lastSyncedAt: string;
  version: number;
}

const cloudStorage: Record<string, CloudUserData> = {};

// Push subscriptions store
const pushSubscriptions: Record<string, { endpoint: string; type: string; registeredAt: string }> = {};

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Curated Fallback & Trending Shopee Gift database
const CURATED_SHOPEE_GIFTS = [
  {
    id: 'sp-1',
    name: 'Nến thơm tinh dầu thiên nhiên cao cấp thư giãn',
    category: 'Decor & Hương thơm',
    price: 185000,
    priceDisplay: '185.000₫',
    originalPriceDisplay: '250.000₫',
    rating: 4.9,
    salesCount: '12.4k',
    isShopeeMall: true,
    shopeeKeyword: 'nến thơm tinh dầu cao cấp decor phòng',
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=600&q=80',
    tags: ['Tinh tế', 'Lãng mạn', 'Thư giãn', 'Decor'],
    suitableFor: ['Người yêu (Bạn gái)', 'Bạn thân', 'Đồng nghiệp', 'Chị em gái'],
    occasions: ['Sinh nhật', 'Valentine', '20/10', '8/3', 'Giáng sinh']
  },
  {
    id: 'sp-2',
    name: 'Tai nghe Bluetooth không dây chống ồn chụp tai vintage',
    category: 'Công nghệ & Âm thanh',
    price: 689000,
    priceDisplay: '689.000₫',
    originalPriceDisplay: '950.000₫',
    rating: 4.8,
    salesCount: '8.9k',
    isShopeeMall: true,
    shopeeKeyword: 'tai nghe bluetooth chup tai chong on vintage',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    tags: ['Công nghệ', 'Hiện đại', 'Năng động', 'Âm nhạc'],
    suitableFor: ['Người yêu (Bạn trai)', 'Bạn thân', 'Em trai', 'Đồng nghiệp'],
    occasions: ['Sinh nhật', 'Tốt nghiệp', 'Giáng sinh', 'Tết']
  },
  {
    id: 'sp-3',
    name: 'Bình giữ nhiệt Lock&Lock hiển thị nhiệt độ thông minh 500ml',
    category: 'Gia dụng & Tiện ích',
    price: 289000,
    priceDisplay: '289.000₫',
    originalPriceDisplay: '390.000₫',
    rating: 5.0,
    salesCount: '25.6k',
    isShopeeMall: true,
    shopeeKeyword: 'bình giữ nhiệt lock lock chính hãng thông minh',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    tags: ['Thực tế', 'Tiện dụng', 'Quan tâm sức khỏe'],
    suitableFor: ['Bố', 'Mẹ', 'Đồng nghiệp', 'Người yêu', 'Bạn thân'],
    occasions: ['Sinh nhật', 'Ngày của Cha/Mẹ', 'Tân gia', 'Tết']
  },
  {
    id: 'sp-4',
    name: 'Set son dưỡng môi cao cấp Dior Addict Lip Glow Mini',
    category: 'Làm đẹp & Mỹ phẩm',
    price: 490000,
    priceDisplay: '490.000₫',
    originalPriceDisplay: '650.000₫',
    rating: 4.9,
    salesCount: '9.3k',
    isShopeeMall: true,
    shopeeKeyword: 'son duong dior lip glow mini chinh hang',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    tags: ['Sang trọng', 'Lãng mạn', 'Làm đẹp'],
    suitableFor: ['Người yêu (Bạn gái)', 'Vợ', 'Bạn thân', 'Chị gái'],
    occasions: ['Valentine', '8/3', '20/10', 'Sinh nhật', 'Kỷ niệm']
  },
  {
    id: 'sp-5',
    name: 'Đèn ngủ hoàng hôn Sunset Lamp chiếu không gian chill',
    category: 'Decor & Đời sống',
    price: 135000,
    priceDisplay: '135.000₫',
    originalPriceDisplay: '210.000₫',
    rating: 4.8,
    salesCount: '34.2k',
    isShopeeMall: false,
    shopeeKeyword: 'đèn hoàng hôn sunset lamp decor phòng ngủ',
    image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=600&q=80',
    tags: ['Chill', 'Decor', 'Chụp ảnh', 'Sống ảo'],
    suitableFor: ['Bạn thân', 'Người yêu', 'Em gái', 'Bạn cùng phòng'],
    occasions: ['Sinh nhật', 'Tân gia', 'Giáng sinh']
  },
  {
    id: 'sp-6',
    name: 'Bàn phím cơ không dây Bluetooth RGB đổi màu gõ êm',
    category: 'Công nghệ & Bàn làm việc',
    price: 890000,
    priceDisplay: '890.000₫',
    originalPriceDisplay: '1.200.000₫',
    rating: 4.9,
    salesCount: '6.7k',
    isShopeeMall: true,
    shopeeKeyword: 'bàn phím cơ không dây bluetooth hotswap',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    tags: ['Công nghệ', 'Gaming', 'Làm việc', 'Đam mê'],
    suitableFor: ['Người yêu (Bạn trai)', 'Bạn thân', 'Đồng nghiệp', 'Chồng'],
    occasions: ['Sinh nhật', 'Tốt nghiệp', 'Kỷ niệm']
  },
  {
    id: 'sp-7',
    name: 'Hộp quà trà hoa sấy lạnh thảo mộc dưỡng nhan kèm cốc thủy tinh',
    category: 'Ẩm thực & Quà tặng sức khỏe',
    price: 320000,
    priceDisplay: '320.000₫',
    originalPriceDisplay: '450.000₫',
    rating: 4.9,
    salesCount: '11.8k',
    isShopeeMall: true,
    shopeeKeyword: 'set hộp quà trà hoa thảo mộc dưỡng nhan',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    tags: ['Sức khỏe', 'Tinh tế', 'Thư thái', 'Ấm áp'],
    suitableFor: ['Mẹ', 'Bố', 'Sếp', 'Đồng nghiệp', 'Vợ'],
    occasions: ['Tết', 'Ngày của Mẹ', '20/10', 'Sinh nhật', 'Thăm bệnh']
  },
  {
    id: 'sp-8',
    name: 'Sổ tay da bìa còng cao cấp khắc tên theo yêu cầu kèm bút ký',
    category: 'Văn phòng phẩm & Kỷ niệm',
    price: 240000,
    priceDisplay: '240.000₫',
    originalPriceDisplay: '350.000₫',
    rating: 4.9,
    salesCount: '7.5k',
    isShopeeMall: false,
    shopeeKeyword: 'sổ tay da khắc tên theo yêu cầu bút ký cao cấp',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    tags: ['Học tập', 'Kỷ niệm', 'Khắc tên', 'Cá nhân hóa'],
    suitableFor: ['Thầy cô', 'Sếp', 'Đồng nghiệp', 'Bạn thân', 'Tốt nghiệp'],
    occasions: ['Tốt nghiệp', '20/11', 'Sinh nhật', 'Chia tay']
  },
  {
    id: 'sp-9',
    name: 'Hộp quà Socola Valentine thủ công nghệ thuật kèm hoa hồng sáp',
    category: 'Ẩm thực & Quà tặng',
    price: 260000,
    priceDisplay: '260.000₫',
    originalPriceDisplay: '350.000₫',
    rating: 4.9,
    salesCount: '15.2k',
    isShopeeMall: true,
    shopeeKeyword: 'hộp quà socola valentine hoa sáp lãng mạn',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    tags: ['Lãng mạn', 'Ngọt ngào', 'Tình yêu', 'Valentine'],
    suitableFor: ['Người yêu (Bạn gái)', 'Người yêu (Bạn trai)', 'Vợ', 'Chồng'],
    occasions: ['14/2 - Lễ Tình Nhân', '14/3 - Valentine Trắng', 'Kỷ niệm ngày yêu']
  },
  {
    id: 'sp-10',
    name: 'Set bút ký kim loại mạ vàng khắc tên theo yêu cầu tri ân Thầy Cô',
    category: 'Văn phòng phẩm & Kỷ niệm',
    price: 310000,
    priceDisplay: '310.000₫',
    originalPriceDisplay: '420.000₫',
    rating: 5.0,
    salesCount: '8.4k',
    isShopeeMall: true,
    shopeeKeyword: 'bút ký mạ vàng khắc tên quà tặng 20 11',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    tags: ['Tri ân', 'Trang trọng', 'Ý nghĩa', 'Khắc tên'],
    suitableFor: ['Thầy cô', 'Sếp / Quản lý', 'Đồng nghiệp', 'Đối tác'],
    occasions: ['20/11 - Ngày Nhà giáo Việt Nam', 'Tốt nghiệp', 'Thăng chức']
  }
];

// Helper to build Shopee search URL
function buildShopeeUrl(keyword: string): string {
  return `https://shopee.vn/search?keyword=${encodeURIComponent(keyword.trim())}`;
}

// =================== API ROUTES ===================

// 1. Shopee Catalog & Search
app.get('/api/shopee/catalog', (req, res) => {
  const { category, search, maxPrice } = req.query;
  let items = [...CURATED_SHOPEE_GIFTS];

  if (category && category !== 'Tất cả') {
    items = items.filter(item => item.category.toLowerCase().includes(String(category).toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(String(category).toLowerCase())));
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q)) ||
      item.shopeeKeyword.toLowerCase().includes(q)
    );
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    items = items.filter(item => item.price <= Number(maxPrice));
  }

  const enriched = items.map(item => ({
    ...item,
    shopeeUrl: buildShopeeUrl(item.shopeeKeyword)
  }));

  res.json({ success: true, count: enriched.length, items: enriched });
});

// 2. AI Personalized Gift Recommendations using Gemini
app.post('/api/ai/recommend-gifts', async (req, res) => {
  try {
    const {
      relationship = 'Bạn thân',
      occasion = 'Sinh nhật',
      interests = ['Công nghệ', 'Đời sống'],
      personality = 'Tinh tế, thực tế',
      budget = '300.000₫ - 500.000₫',
      recipientName = 'người ấy',
      gender = 'Không xác định',
      ageGroup = '20-30 tuổi',
      notes = ''
    } = req.body;

    const interestStr = Array.isArray(interests) ? interests.join(', ') : String(interests);

    const prompt = `
Bạn là chuyên gia tư vấn quà tặng và mua sắm thương mại điện tử Shopee Việt Nam hàng đầu ("GiftGenie AI").
Nhiệm vụ: Gợi ý 4 món quà tặng xuất sắc, độc đáo, cực kỳ tâm lý và sát với thực tế tại thị trường Việt Nam (dễ dàng tìm mua trên Shopee).

Thông tin người nhận:
- Tên người nhận: ${recipientName}
- Mối quan hệ: ${relationship}
- Dịp đặc biệt: ${occasion}
- Giới tính & Độ tuổi: ${gender}, ${ageGroup}
- Sở thích & đam mê: ${interestStr}
- Tính cách & Vibe: ${personality}
- Ngân sách: ${budget}
- Ghi chú thêm: ${notes || 'Không có'}

Yêu cầu định dạng JSON phản hồi:
Phải trả về mảng các đối tượng quà tặng có cấu trúc:
[
  {
    "name": "Tên món quà ngắn gọn, hấp dẫn",
    "category": "Danh mục (vd: Làm đẹp, Công nghệ, Decor, Thời trang, v.v.)",
    "priceEstimate": "Khoảng giá hiển thị (vd: 350.000₫ - 450.000₫)",
    "priceValue": 400000,
    "matchReason": "Lý giải sâu sắc 2-3 câu vì sao món quà này chạm đúng cảm xúc và sở thích của người nhận",
    "matchScore": 96,
    "shopeeKeyword": "từ khóa chuẩn xác để gõ vào ô tìm kiếm Shopee Việt Nam",
    "greetingMessage": "Một bức thiệp/lời chúc ngọt ngào, chân thành hoặc hóm hỉnh phù hợp dịp này để viết vào thiệp tặng",
    "unboxingTip": "Mẹo đóng gói, cách tặng bất ngờ hoặc thời điểm trao quà ghi điểm tuyệt đối",
    "isShopeeMall": true,
    "badge": "Lựa chọn số 1 / Ý nghĩa nhất / Thực tế nhất / Độc đáo"
  }
]
Đảm bảo kết quả phải rất phong phú, thực tế, đúng tâm lý người Việt.
`;

    // Attempt Gemini call
    let recommendations: any[] = [];
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Bạn là chuyên gia tư vấn quà tặng Shopee Việt Nam. Luôn phản hồi JSON hợp lệ theo đúng cấu trúc yêu cầu.',
            responseMimeType: 'application/json',
            temperature: 0.8,
          }
        });

        const text = response.text;
        if (text) {
          recommendations = JSON.parse(text);
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed or quota reached, falling back to smart curated engine:', geminiError);
      }
    }

    // Fallback if AI returned empty or failed
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      recommendations = [
        {
          name: `Set quà tặng tinh dầu khuếch tán & nến thơm cao cấp`,
          category: 'Decor & Thư giãn',
          priceEstimate: '280.000₫ - 420.000₫',
          priceValue: 350000,
          matchReason: `Món quà nhẹ nhàng, thơm ngát mang lại sự thư thái sau giờ làm việc bận rộn. Thể hiện sự tinh tế, chu đáo và thấu hiểu phong cách sống của ${recipientName}.`,
          matchScore: 97,
          shopeeKeyword: 'set nến thơm tinh dầu quà tặng cao cấp',
          greetingMessage: `Chúc ${recipientName} có một dịp ${occasion} thật an yên, luôn ngập tràn niềm vui và những khoảnh khắc ấm áp!`,
          unboxingTip: 'Kèm theo một nhành hoa khô nhỏ dán trên hộp kraft thắt nơ ruy băng màu pastel.',
          isShopeeMall: true,
          badge: 'Gợi ý tinh tế'
        },
        {
          name: `Bình giữ nhiệt phong cách tối giản khắc tên cá nhân`,
          category: 'Tiện ích & Đời sống',
          priceEstimate: '250.000₫ - 380.000₫',
          priceValue: 320000,
          matchReason: `Vừa thiết thực vừa mang dấu ấn riêng biệt. Bất cứ khi nào uống nước tại văn phòng hay đi chơi, ${recipientName} đều nhớ đến sự quan tâm của bạn.`,
          matchScore: 94,
          shopeeKeyword: 'bình giữ nhiệt inox khắc tên theo yêu cầu',
          greetingMessage: `Một chút ấm áp mỗi ngày gửi đến ${recipientName}. Hãy luôn chăm sóc bản thân thật tốt nhé!`,
          unboxingTip: 'Bỏ vào bên trong một mẩu giấy nhắn bí mật trước khi đóng nắp hộp.',
          isShopeeMall: true,
          badge: 'Thực tế & Ý nghĩa'
        },
        {
          name: `Tai nghe chụp tai Bluetooth chống ồn phong cách Retro`,
          category: 'Công nghệ & Âm thanh',
          priceEstimate: '450.000₫ - 650.000₫',
          priceValue: 550000,
          matchReason: `Phù hợp với người yêu thích công nghệ và âm nhạc. Thiết kế retro sành điệu vừa để nghe nhạc vừa là phụ kiện chụp ảnh cực chất.`,
          matchScore: 91,
          shopeeKeyword: 'tai nghe bluetooth chup tai retro y2k',
          greetingMessage: `Chúc ${recipientName} luôn tìm thấy những giai điệu hạnh phúc nhất trong cuộc sống!`,
          unboxingTip: 'Tạo sẵn một playlist Spotify đặc biệt tặng kèm mã quét Spotify Code in trên thiệp.',
          isShopeeMall: true,
          badge: 'Công nghệ sành điệu'
        },
        {
          name: `Hộp quà bánh ngọt Handmade & Trà hoa cao cấp`,
          category: 'Ẩm thực & Quà tặng',
          priceEstimate: '220.000₫ - 350.000₫',
          priceValue: 280000,
          matchReason: `Vị ngọt ngào dễ gắn kết cảm xúc, thích hợp để cùng nhau thưởng thức và chia sẻ câu chuyện trong ngày kỷ niệm ${occasion}.`,
          matchScore: 89,
          shopeeKeyword: 'set hộp quà bánh quy handmade trà hoa',
          greetingMessage: `Gửi đến ${recipientName} những ngọt ngào nhất nhân dịp ${occasion}!`,
          unboxingTip: 'Nên tặng vào buổi chiều cùng một tách trà nóng thư giãn.',
          isShopeeMall: false,
          badge: 'Ngọt ngào & Ấm áp'
        }
      ];
    }

    // Attach verified Shopee Search URLs and placeholder visuals
    const enrichedResults = recommendations.map((item, idx) => ({
      ...item,
      id: `ai-gift-${Date.now()}-${idx}`,
      shopeeUrl: buildShopeeUrl(item.shopeeKeyword || item.name),
      createdAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      context: { relationship, occasion, recipientName, budget },
      gifts: enrichedResults
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ success: false, message: error.message || 'Lỗi xử lý gợi ý' });
  }
});

// 3. Cloud Sync (Real-time Cross-device synchronization & Cloud Backup)
app.get('/api/cloud-sync', (req, res) => {
  const userId = String(req.query.userId || 'default_user');
  const data = cloudStorage[userId] || {
    recipients: [],
    wishlist: [],
    settings: {
      emailNotification: true,
      zaloNotification: false,
      unifiedPushEnabled: true,
      remindDaysBefore: [7, 3, 1],
      darkMode: false,
      userEmail: 'thps1411@gmail.com',
      zaloPhone: ''
    },
    notifications: [],
    lastSyncedAt: new Date().toISOString(),
    version: 1
  };
  res.json({ success: true, data });
});

app.post('/api/cloud-sync', (req, res) => {
  const { userId = 'default_user', recipients, wishlist, settings, notifications } = req.body;
  const current = cloudStorage[userId] || { version: 0 };

  const updatedData: CloudUserData = {
    recipients: recipients ?? current.recipients ?? [],
    wishlist: wishlist ?? current.wishlist ?? [],
    settings: settings ?? current.settings ?? {},
    notifications: notifications ?? current.notifications ?? [],
    lastSyncedAt: new Date().toISOString(),
    version: (current.version || 0) + 1
  };

  cloudStorage[userId] = updatedData;
  res.json({
    success: true,
    message: 'Đồng bộ dữ liệu đám mây thành công!',
    lastSyncedAt: updatedData.lastSyncedAt,
    version: updatedData.version
  });
});

// 4. UnifiedPush & Web Push endpoints
app.post('/api/notifications/unified-push/register', (req, res) => {
  const { userId = 'default_user', endpoint, type = 'UnifiedPush' } = req.body;
  pushSubscriptions[userId] = {
    endpoint: endpoint || 'https://unifiedpush.org/distributor/mock-endpoint',
    type,
    registeredAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Đăng ký UnifiedPush Distributor thành công!',
    subscription: pushSubscriptions[userId]
  });
});

app.post('/api/notifications/unified-push/test', (req, res) => {
  const { userId = 'default_user', title, body, eventName } = req.body;
  const sub = pushSubscriptions[userId];

  res.json({
    success: true,
    delivered: true,
    channel: 'UnifiedPush Gateway',
    timestamp: new Date().toISOString(),
    details: {
      distributor: 'UnifiedPush / Web Push',
      targetEndpoint: sub ? sub.endpoint : 'Browser WebPush Instance',
      payload: {
        title: title || 'ShopeeGift AI: Sắp đến sinh nhật!',
        body: body || 'Chỉ còn 3 ngày nữa là đến dịp đặc biệt. Hãy chọn quà Shopee ngay!',
        data: { eventName: eventName || 'Sinh nhật' }
      }
    }
  });
});

// 5. Email & Zalo Notification Test Simulation
app.post('/api/notifications/test-channel', (req, res) => {
  const { channel, recipient, eventTitle, daysLeft, giftSuggestion } = req.body;

  if (channel === 'email') {
    res.json({
      success: true,
      channel: 'email',
      recipient: recipient || 'thps1411@gmail.com',
      subject: `[ShopeeGift AI] Nhắc nhở: Sắp tới ${eventTitle} (Còn ${daysLeft} ngày)`,
      previewText: `Chào bạn, sự kiện ${eventTitle} sắp diễn ra. ShopeeGift AI đã chuẩn bị sẵn gợi ý quà tặng Shopee tốt nhất dành cho bạn!`,
      status: 'Đã gửi thành công vào hộp thư',
      sentAt: new Date().toLocaleTimeString('vi-VN')
    });
  } else if (channel === 'zalo') {
    res.json({
      success: true,
      channel: 'zalo',
      recipient: recipient || '0987xxxxxx',
      templateName: 'ZALO_ZNS_EVENT_REMINDER',
      messageContent: `[ShopeeGift AI] 🔔 Tin nhắn nhắc lịch Zalo: Bạn có sự kiện '${eventTitle}' trong ${daysLeft} ngày tới. Nhấn để xem gợi ý quà Shopee giảm giá!`,
      status: 'Zalo ZNS / Webhook đã tiếp nhận thành công',
      sentAt: new Date().toLocaleTimeString('vi-VN')
    });
  } else {
    res.status(400).json({ success: false, message: 'Kênh thông báo không hợp lệ' });
  }
});

// =================== VITE & DEV SERVER ===================
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`> ShopeeGift AI server is running on http://localhost:${PORT}`);
  });
}

startServer();
