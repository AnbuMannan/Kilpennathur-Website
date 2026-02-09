import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    // Hash password for admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: "admin@kilpennathur.com" },
      update: {},
      create: {
        email: "admin@kilpennathur.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
      },
    });
    console.log("✅ Admin user created:", admin.email);

    // Create NEWS categories
    const newsCategories = [
      {
        name: "Breaking News",
        nameTamil: "முக்கிய செய்திகள்",
        slug: "breaking-news",
        type: "news",
      },
      {
        name: "Health",
        nameTamil: "உடல்நலம்",
        slug: "health",
        type: "news",
      },
      {
        name: "EB News",
        nameTamil: "மின்சார செய்திகள்",
        slug: "eb-news",
        type: "news",
      },
      {
        name: "Employment",
        nameTamil: "வேலைவாய்ப்பு",
        slug: "employment",
        type: "news",
      },
      {
        name: "Blood Donation",
        nameTamil: "இரத்த தானம்",
        slug: "blood-donation",
        type: "news",
      },
      {
        name: "Weather",
        nameTamil: "வானிலை",
        slug: "weather",
        type: "news",
      },
      {
        name: "Spiritual",
        nameTamil: "ஆன்மீகம்",
        slug: "spiritual",
        type: "news",
      },
    ];

    for (const category of newsCategories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }
    console.log("✅ News categories created:", newsCategories.length);

    // Create BUSINESS categories
    const businessCategories = [
      {
        name: "Medical",
        nameTamil: "மருத்துவம்",
        slug: "medical",
        type: "business",
      },
      {
        name: "Electronics",
        nameTamil: "மின்னணு",
        slug: "electronics",
        type: "business",
      },
      {
        name: "Hardware",
        nameTamil: "வன்பொருள்",
        slug: "hardware",
        type: "business",
      },
      {
        name: "Bakery",
        nameTamil: "பேக்கரி",
        slug: "bakery",
        type: "business",
      },
      {
        name: "Textiles",
        nameTamil: "துணி",
        slug: "textiles",
        type: "business",
      },
      {
        name: "Restaurant",
        nameTamil: "உணவகம்",
        slug: "restaurant",
        type: "business",
      },
      {
        name: "Grocery",
        nameTamil: "மளிகை",
        slug: "grocery",
        type: "business",
      },
      {
        name: "Education",
        nameTamil: "கல்வி",
        slug: "education",
        type: "business",
      },
      {
        name: "Automobile",
        nameTamil: "வாகனம்",
        slug: "automobile",
        type: "business",
      },
      {
        name: "Beauty",
        nameTamil: "அழகு நிலையம்",
        slug: "beauty",
        type: "business",
      },
      {
        name: "Banking",
        nameTamil: "வங்கி",
        slug: "banking",
        type: "business",
      },
    ];

    for (const category of businessCategories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }
    console.log("✅ Business categories created:", businessCategories.length);

    // Create sample published news
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@kilpennathur.com" },
    });

    if (adminUser) {
      const sampleNews = [
        {
          title: "New Community Center Opens in Kilpennathur",
          titleTamil: "கில்பென்னாத்தூரில் புதிய சமூக மையம் திறப்பு",
          slug: "new-community-center-opens-kilpennathur",
          content:
            "<p>A new state-of-the-art community center has opened its doors in Kilpennathur, providing residents with modern facilities for meetings, events, and social gatherings. The center features a spacious hall, library, and recreational areas.</p><p>The inauguration ceremony was attended by local officials and community leaders who praised the initiative. The center will serve as a hub for various community activities and programs.</p>",
          contentTamil:
            "<p>கில்பென்னாத்தூரில் ஒரு புதிய நவீன சமூக மையம் திறக்கப்பட்டுள்ளது. இது கூட்டங்கள், நிகழ்வுகள் மற்றும் சமூக கூட்டங்களுக்கான நவீன வசதிகளை வழங்குகிறது.</p>",
          excerpt:
            "A new state-of-the-art community center opens in Kilpennathur with modern facilities.",
          category: "Breaking News",
          status: "published",
          publishedAt: new Date(),
          authorId: adminUser.id,
          views: 45,
        },
        {
          title: "Local Farmers Adopt Modern Agricultural Techniques",
          titleTamil: "உள்ளூர் விவசாயிகள் நவீன விவசாய நுட்பங்களை பின்பற்றுகின்றனர்",
          slug: "local-farmers-adopt-modern-techniques",
          content:
            "<p>Farmers in Kilpennathur and surrounding villages are increasingly adopting modern agricultural techniques to improve crop yields and sustainability. Training programs conducted by agricultural experts have helped farmers learn about drip irrigation, organic farming, and crop rotation.</p>",
          excerpt: "Farmers embrace modern agricultural methods for better yields.",
          category: "Breaking News",
          status: "published",
          publishedAt: new Date(Date.now() - 86400000), // 1 day ago
          authorId: adminUser.id,
          views: 78,
        },
        {
          title: "Health Camp Provides Free Medical Checkups",
          titleTamil: "இலவச மருத்துவ பரிசோதனை முகாம்",
          slug: "health-camp-free-medical-checkups",
          content:
            "<p>A free health camp was organized in Kilpennathur providing medical checkups, consultations, and medicines to over 500 residents. The camp included specialists in general medicine, pediatrics, and dental care.</p>",
          excerpt: "Free health camp serves over 500 residents with medical checkups.",
          category: "Health",
          status: "published",
          publishedAt: new Date(Date.now() - 172800000), // 2 days ago
          authorId: adminUser.id,
          views: 123,
        },
        {
          title: "Job Fair Connects Youth with Employment Opportunities",
          titleTamil: "வேலைவாய்ப்பு கண்காட்சி இளைஞர்களுக்கு வேலை வாய்ப்புகளை வழங்குகிறது",
          slug: "job-fair-employment-opportunities",
          content:
            "<p>A job fair held in Kilpennathur brought together over 30 companies offering employment opportunities in various sectors. More than 200 candidates attended the event, with several receiving job offers on the spot.</p>",
          excerpt: "Job fair attracts 30+ companies and 200+ job seekers.",
          category: "Employment",
          status: "published",
          publishedAt: new Date(Date.now() - 259200000), // 3 days ago
          authorId: adminUser.id,
          views: 156,
        },
        {
          title: "Electricity Board Announces Power Supply Upgrades",
          titleTamil: "மின்வாரியம் மின் விநியோக மேம்பாடுகளை அறிவிக்கிறது",
          slug: "electricity-board-power-supply-upgrades",
          content:
            "<p>The Tamil Nadu Electricity Board has announced major upgrades to the power supply infrastructure in Kilpennathur. The improvements include installation of new transformers and underground cabling to reduce power outages.</p>",
          excerpt: "EB announces infrastructure upgrades to improve power supply.",
          category: "EB News",
          status: "published",
          publishedAt: new Date(Date.now() - 345600000), // 4 days ago
          authorId: adminUser.id,
          views: 89,
        },
      ];

      for (const newsData of sampleNews) {
        await prisma.news.upsert({
          where: { slug: newsData.slug },
          update: {},
          create: newsData,
        });
      }

      console.log("✅ Sample news articles created");
    }

    // ==========================================
    // SEED VILLAGES
    // ==========================================

    console.log("🏘️  Seeding villages...");

    const villages = [
      {
        name: "Kilpennathur",
        nameTamil: "கீழ்பென்னாத்தூர்",
        slug: "kilpennathur",
        description: "Kilpennathur is the main town and administrative center of the region. Known for its temples, markets, and educational institutions.",
      },
      {
        name: "Aniyalai",
        nameTamil: "அணியாலை",
        slug: "aniyalai",
        description: "A peaceful village known for agriculture and traditional crafts.",
      },
      {
        name: "Amirthi",
        nameTamil: "அமிர்தி",
        slug: "amirthi",
        description: "Famous for its scenic beauty and water bodies.",
      },
      {
        name: "Aridharimangalam",
        nameTamil: "அரிதாரிமங்கலம்",
        slug: "aridharimangalam",
        description: "Historic village with ancient temples and rich cultural heritage.",
      },
      {
        name: "Arunagirimangalam",
        nameTamil: "அருணகிரிமங்கலம்",
        slug: "arunagirimangalam",
        description: "Agricultural village known for paddy cultivation.",
      },
      {
        name: "Alangaramangalam",
        nameTamil: "அலங்காரமங்கலம்",
        slug: "alangaramangalam",
        description: "Village with strong community traditions and festivals.",
      },
      {
        name: "Alliyandal",
        nameTamil: "அல்லியந்தல்",
        slug: "alliyandal",
        description: "Small village known for its serene environment.",
      },
      {
        name: "Ananthapuram",
        nameTamil: "அனந்தபுரம்",
        slug: "ananthapuram",
        description: "Growing village with modern amenities.",
      },
      {
        name: "Annandal",
        nameTamil: "அன்னந்தல்",
        slug: "annandal",
        description: "Village known for its proximity to the river.",
      },
      {
        name: "Adamangalam",
        nameTamil: "ஆதமங்கலம்",
        slug: "adamangalam",
        description: "Traditional village with strong agricultural base.",
      },
      {
        name: "Alathur",
        nameTamil: "ஆலத்தூர்",
        slug: "alathur",
        description: "Village known for its banyan trees and shade.",
      },
      {
        name: "Anaivadi",
        nameTamil: "ஆனைவாடி",
        slug: "anaivadi",
        description: "Historic village with ancient references.",
      },
      {
        name: "Irumbili",
        nameTamil: "இரும்பிலி",
        slug: "irumbili",
        description: "Village known for traditional ironworks in the past.",
      },
      {
        name: "Eriyur",
        nameTamil: "எரியூர்",
        slug: "eriyur",
        description: "Village near water tank with good irrigation.",
      },
      {
        name: "Erumaiyanur",
        nameTamil: "எருமையனூர்",
        slug: "erumaiyanur",
        description: "Agricultural village with dairy farming.",
      },
      {
        name: "Kadaladi",
        nameTamil: "கடலாடி",
        slug: "kadaladi",
        description: "Village known for its unique name and culture.",
      },
      {
        name: "Kalasapakkam",
        nameTamil: "கலசபாக்கம்",
        slug: "kalasapakkam",
        description: "Important village in the region with government offices.",
      },
      {
        name: "Kalkuppam",
        nameTamil: "கல்குப்பம்",
        slug: "kalkuppam",
        description: "Village with stone quarries and construction materials.",
      },
      {
        name: "Kappalur",
        nameTamil: "காப்பலூர்",
        slug: "kappalur",
        description: "Historic village with temple significance.",
      },
      {
        name: "Melpalur",
        nameTamil: "மேல்பாலூர்",
        slug: "melpalur",
        description: "Upper region village with elevated terrain.",
      },
      {
        name: "Mottur",
        nameTamil: "மோட்டூர்",
        slug: "mottur",
        description: "Village famous for Murugan temple.",
      },
      {
        name: "Padavedu",
        nameTamil: "படவேடு",
        slug: "padavedu",
        description: "Growing village with educational institutions.",
      },
      {
        name: "Pudupattu",
        nameTamil: "புதுப்பட்டு",
        slug: "pudupattu",
        description: "New settlement with modern facilities.",
      },
      {
        name: "Pudur",
        nameTamil: "புதூர்",
        slug: "pudur",
        description: "Village with mixed agriculture.",
      },
      {
        name: "Veeranandal",
        nameTamil: "வீரானந்தல்",
        slug: "veeranandal",
        description: "Village named after historical warrior.",
      },
    ];

    for (const villageData of villages) {
      await prisma.village.upsert({
        where: { slug: villageData.slug },
        update: {},
        create: villageData,
      });
    }

    console.log(`✅ ${villages.length} villages seeded`);

    // ==========================================
    // SEED EVENTS
    // ==========================================

    console.log("📅 Seeding events...");

    const events = [
      {
        title: "Annual Temple Festival",
        titleTamil: "வருடாந்திர கோவில் திருவிழா",
        description: "Grand temple festival celebrating the deity with processions, cultural programs, and traditional rituals. Join us for three days of devotion and celebration.",
        date: new Date("2026-02-15"),
        image: null,
      },
      {
        title: "Pongal Celebration 2026",
        titleTamil: "பொங்கல் விழா 2026",
        description: "Community Pongal celebration with traditional games, kolam competition, and cultural performances. Celebrate the harvest festival with the entire community.",
        date: new Date("2026-01-14"),
        image: null,
      },
      {
        title: "Independence Day Celebration",
        titleTamil: "சுதந்திர தின கொண்டாட்டம்",
        description: "Flag hoisting ceremony followed by cultural programs, sports events, and distribution of sweets. Celebrating 79 years of independence.",
        date: new Date("2026-08-15"),
        image: null,
      },
      {
        title: "Free Medical Camp",
        titleTamil: "இலவச மருத்துவ முகாம்",
        description: "Free health checkup camp with specialist doctors, free medicines, and health awareness sessions. Open to all residents.",
        date: new Date("2026-03-10"),
        image: null,
      },
      {
        title: "Youth Sports Tournament",
        titleTamil: "இளைஞர் விளையாட்டு போட்டி",
        description: "Inter-village sports tournament featuring cricket, volleyball, kabaddi, and athletics. Prizes for winners in each category.",
        date: new Date("2026-04-20"),
        image: null,
      },
      {
        title: "Agricultural Training Workshop",
        titleTamil: "விவசாய பயிற்சி பட்டறை",
        description: "Workshop on modern agricultural techniques, organic farming, and government schemes for farmers. Expert speakers and demonstrations.",
        date: new Date("2026-05-05"),
        image: null,
      },
      {
        title: "Blood Donation Camp",
        titleTamil: "இரத்த தான முகாம்",
        description: "Blood donation camp organized in association with government hospital. All healthy individuals aged 18-65 can donate.",
        date: new Date("2026-06-12"),
        image: null,
      },
      {
        title: "Education Fair",
        titleTamil: "கல்வி கண்காட்சி",
        description: "Education fair featuring various schools, colleges, and career guidance. Scholarship information and admission assistance available.",
        date: new Date("2026-07-25"),
        image: null,
      },
      {
        title: "River Cleaning Drive",
        titleTamil: "ஆற்று சுத்தம் செய்யும் பணி",
        description: "Community river cleaning initiative. Volunteers needed. Refreshments and certificates provided to all participants.",
        date: new Date("2026-09-10"),
        image: null,
      },
      {
        title: "Diwali Festival Celebration",
        titleTamil: "தீபாவளி விழா",
        description: "Community Diwali celebration with fireworks display, cultural programs, and sweet distribution. Family-friendly event.",
        date: new Date("2026-10-30"),
        image: null,
      },
    ];

    for (const eventData of events) {
      await prisma.event.create({
        data: eventData,
      });
    }

    console.log(`✅ ${events.length} events seeded`);

    // ==========================================
    // SEED BUSINESSES
    // ==========================================

    console.log("🏢 Seeding businesses...");

    const businesses = [
      // Medical & Health
      {
        name: "Sri Venkateshwara Medical Store",
        nameTamil: "ஸ்ரீ வெங்கடேஸ்வரா மெடிக்கல் ஸ்டோர்",
        category: "medical",
        phone: "+91 9876543210",
        whatsapp: "919876543210",
        address: "Main Road, Kilpennathur",
        description: "24/7 pharmacy with all medicines, surgical items, and medical equipment. Home delivery available.",
        image: null,
        website: null,
      },
      {
        name: "Kilpennathur Primary Health Centre",
        nameTamil: "கீழ்பென்னாத்தூர் ஆரம்ப சுகாதார நிலையம்",
        category: "medical",
        phone: "+91 9876543211",
        whatsapp: null,
        address: "Hospital Road, Kilpennathur",
        description: "Government primary health center providing free medical services, vaccinations, and maternal care.",
        image: null,
        website: null,
      },
      {
        name: "Dr. Kumar's Clinic",
        nameTamil: "டாக்டர் குமார் கிளினிக்",
        category: "medical",
        phone: "+91 9876543212",
        whatsapp: "919876543212",
        address: "Near Bus Stand, Kilpennathur",
        description: "General physician clinic. Consultations available daily 9 AM - 9 PM.",
        image: null,
        website: null,
      },

      // Electronics
      {
        name: "Raj Electronics",
        nameTamil: "ராஜ் எலக்ட்ரானிக்ஸ்",
        category: "electronics",
        phone: "+91 9876543220",
        whatsapp: "919876543220",
        address: "Market Street, Kilpennathur",
        description: "TVs, refrigerators, washing machines, and home appliances. Sales and service.",
        image: null,
        website: null,
      },
      {
        name: "Modern Mobile Shop",
        nameTamil: "மாடர்ன் மொபைல் கடை",
        category: "electronics",
        phone: "+91 9876543221",
        whatsapp: "919876543221",
        address: "Main Road, Kilpennathur",
        description: "Latest smartphones, accessories, and mobile repairs. All brands available.",
        image: null,
        website: null,
      },

      // Hardware
      {
        name: "Lakshmi Hardware",
        nameTamil: "லட்சுமி ஹார்ட்வேர்",
        category: "hardware",
        phone: "+91 9876543230",
        whatsapp: null,
        address: "Bazaar Street, Kilpennathur",
        description: "Construction materials, tools, paints, and electrical items. Wholesale and retail.",
        image: null,
        website: null,
      },
      {
        name: "Sri Sakthi Traders",
        nameTamil: "ஸ்ரீ சக்தி டிரேடர்ஸ்",
        category: "hardware",
        phone: "+91 9876543231",
        whatsapp: "919876543231",
        address: "Industrial Area, Kilpennathur",
        description: "Cement, steel, sand, and all building materials. Free home delivery.",
        image: null,
        website: null,
      },

      // Bakery
      {
        name: "New Bombay Bakery",
        nameTamil: "நியூ பம்பாய் பேக்கரி",
        category: "bakery",
        phone: "+91 9876543240",
        whatsapp: "919876543240",
        address: "Bus Stand Road, Kilpennathur",
        description: "Fresh bread, cakes, pastries daily. Special orders for birthdays and celebrations.",
        image: null,
        website: null,
      },
      {
        name: "Krishna Sweets & Bakery",
        nameTamil: "கிருஷ்ணா ஸ்வீட்ஸ் & பேக்கரி",
        category: "bakery",
        phone: "+91 9876543241",
        whatsapp: "919876543241",
        address: "Temple Street, Kilpennathur",
        description: "Traditional sweets, savories, and fresh bakery items. Known for quality and taste.",
        image: null,
        website: null,
      },

      // Textiles
      {
        name: "Pothys Textiles",
        nameTamil: "போத்திஸ் டெக்ஸ்டைல்ஸ்",
        category: "textiles",
        phone: "+91 9876543250",
        whatsapp: "919876543250",
        address: "Main Bazaar, Kilpennathur",
        description: "Silk sarees, readymade garments, dress materials. Wide collection for all occasions.",
        image: null,
        website: null,
      },
      {
        name: "Aavin Readymades",
        nameTamil: "ஆவின் ரெடிமேட்ஸ்",
        category: "textiles",
        phone: "+91 9876543251",
        whatsapp: "919876543251",
        address: "Market Road, Kilpennathur",
        description: "Men's, women's, and kids' clothing. Latest fashion at affordable prices.",
        image: null,
        website: null,
      },

      // Restaurants
      {
        name: "Saravana Bhavan",
        nameTamil: "சரவணா பவன்",
        category: "restaurant",
        phone: "+91 9876543260",
        whatsapp: null,
        address: "Near Temple, Kilpennathur",
        description: "Pure vegetarian restaurant. South Indian breakfast, meals, and snacks.",
        image: null,
        website: null,
      },
      {
        name: "Ananda Bhavan",
        nameTamil: "ஆனந்தா பவன்",
        category: "restaurant",
        phone: "+91 9876543261",
        whatsapp: "919876543261",
        address: "Bus Stand, Kilpennathur",
        description: "Family restaurant serving breakfast, lunch, and dinner. AC and non-AC seating.",
        image: null,
        website: null,
      },

      // Grocery
      {
        name: "Sri Balaji Super Market",
        nameTamil: "ஸ்ரீ பாலாஜி சூப்பர் மார்க்கெட்",
        category: "grocery",
        phone: "+91 9876543270",
        whatsapp: "919876543270",
        address: "Main Road, Kilpennathur",
        description: "All grocery items, vegetables, fruits, and household products. Free home delivery.",
        image: null,
        website: null,
      },
      {
        name: "Amma Provisions",
        nameTamil: "அம்மா மளிகை",
        category: "grocery",
        phone: "+91 9876543271",
        whatsapp: null,
        address: "Market Street, Kilpennathur",
        description: "Traditional provisions store. Rice, dal, spices, and all grocery items.",
        image: null,
        website: null,
      },

      // Education
      {
        name: "Bright Future Tuition Centre",
        nameTamil: "பிரைட் ஃப்யூச்சர் டியூஷன் சென்டர்",
        category: "education",
        phone: "+91 9876543280",
        whatsapp: "919876543280",
        address: "School Road, Kilpennathur",
        description: "Tuition for classes 1-12, all subjects. Experienced teachers. Small batch size.",
        image: null,
        website: null,
      },
      {
        name: "Computer Training Institute",
        nameTamil: "கம்ப்யூட்டர் பயிற்சி நிறுவனம்",
        category: "education",
        phone: "+91 9876543281",
        whatsapp: "919876543281",
        address: "Near College, Kilpennathur",
        description: "Computer courses, DTP, Tally, programming. Job-oriented training.",
        image: null,
        website: null,
      },

      // Services
      {
        name: "Siva Auto Works",
        nameTamil: "சிவா ஆட்டோ ஒர்க்ஸ்",
        category: "automobile",
        phone: "+91 9876543290",
        whatsapp: "919876543290",
        address: "Bypass Road, Kilpennathur",
        description: "Two-wheeler and four-wheeler service and repairs. Authorized dealer service.",
        image: null,
        website: null,
      },
      {
        name: "Beauty Paradise Salon",
        nameTamil: "பியூட்டி பாரடைஸ் சலூன்",
        category: "beauty",
        phone: "+91 9876543291",
        whatsapp: "919876543291",
        address: "Women's Street, Kilpennathur",
        description: "Ladies salon. Haircut, makeup, bridal services, facials, and beauty treatments.",
        image: null,
        website: null,
      },

      // Finance
      {
        name: "Canara Bank - Kilpennathur Branch",
        nameTamil: "கேனரா வங்கி - கீழ்பென்னாத்தூர் கிளை",
        category: "banking",
        phone: "+91 9876543300",
        whatsapp: null,
        address: "Main Road, Kilpennathur",
        description: "Full-service bank branch. Savings accounts, loans, deposits, and all banking services.",
        image: null,
        website: "www.canarabank.com",
      },
    ];

    for (const businessData of businesses) {
      await prisma.business.create({
        data: businessData,
      });
    }

    console.log(`✅ ${businesses.length} businesses seeded`);

    // ==========================================
    // SEED JOBS
    // ==========================================

    console.log("💼 Seeding jobs...");

    const jobs = [
      {
        title: "Primary School Teacher",
        titleTamil: "ஆரம்ப பள்ளி ஆசிரியர்",
        slug: "primary-school-teacher-kilpennathur",
        description:
          "We are looking for a qualified Primary School Teacher to join our team. Responsibilities include teaching classes 1-5, preparing lesson plans, and conducting parent-teacher meetings. Must have B.Ed degree and fluency in Tamil and English.",
        company: "Kilpennathur Government Primary School",
        companyTamil: "கீழ்பென்னாத்தூர் அரசு ஆரம்ப பள்ளி",
        location: "Kilpennathur",
        locationTamil: "கீழ்பென்னாத்தூர்",
        jobType: "full-time",
        category: "Education",
        salaryDescription: "As per Tamil Nadu Government norms",
        contactEmail: "school@kilpennathur.gov.in",
        contactPhone: "+91 9876543210",
        applicationDeadline: new Date("2026-03-15"),
        experience: "1-3 years",
        qualifications: "B.Ed mandatory. Tamil and English fluency required.",
        benefits: "Government benefits, pension, medical insurance",
        status: "published",
        publishedAt: new Date(),
      },
      {
        title: "Staff Nurse",
        titleTamil: "ஸ்டாஃப் நர்ஸ்",
        slug: "staff-nurse-phc-kilpennathur",
        description:
          "Primary Health Centre requires Staff Nurse for day shift. Duties include patient care, medication administration, and maintaining health records. Candidate must be registered with Tamil Nadu Nursing Council.",
        company: "Kilpennathur Primary Health Centre",
        companyTamil: "கீழ்பென்னாத்தூர் ஆரம்ப சுகாதார நிலையம்",
        location: "Kilpennathur",
        locationTamil: "கீழ்பென்னாத்தூர்",
        jobType: "full-time",
        category: "Healthcare",
        salaryDescription: "₹25,000 - ₹35,000 per month",
        contactEmail: "phc.kilpennathur@tn.gov.in",
        contactPhone: "+91 9876543211",
        applicationDeadline: new Date("2026-02-28"),
        experience: "Freshers welcome",
        qualifications: "B.Sc Nursing or GNM. TN Nursing Council registration required.",
        benefits: "Government employment benefits",
        status: "published",
        publishedAt: new Date(Date.now() - 86400000),
      },
      {
        title: "Computer Operator",
        titleTamil: "கம்ப்யூட்டர் ஆபரேட்டர்",
        slug: "computer-operator-tahsildar-office",
        description:
          "Tahsildar Office requires Computer Operator for data entry and office computer work. Knowledge of MS Office, TNPSC registration portal, and Tamil typing essential.",
        company: "Tahsildar Office, Kilpennathur",
        companyTamil: "தாலுகா அலுவலகம், கீழ்பென்னாத்தூர்",
        location: "Kilpennathur",
        locationTamil: "கீழ்பென்னாத்தூர்",
        jobType: "contract",
        category: "Government",
        salaryDescription: "As per government contract norms",
        contactEmail: "tahsildar.kilpennathur@tn.gov.in",
        contactPhone: null,
        applicationDeadline: new Date("2026-03-10"),
        experience: "6 months - 1 year",
        qualifications: "Any degree. Computer certificate preferred.",
        benefits: null,
        status: "published",
        publishedAt: new Date(Date.now() - 172800000),
      },
      {
        title: "Sales Associate",
        titleTamil: "விற்பனை உதவியாளர்",
        slug: "sales-associate-raj-electronics",
        description:
          "Electronics showroom looking for Sales Associate. Must have good communication skills in Tamil and basic English. Experience in retail preferred but freshers can apply.",
        company: "Raj Electronics",
        companyTamil: "ராஜ் எலக்ட்ரானிக்ஸ்",
        location: "Kilpennathur Main Road",
        locationTamil: "கீழ்பென்னாத்தூர் மெயின் ரோடு",
        jobType: "full-time",
        category: "Retail",
        salaryDescription: "₹12,000 - ₹18,000 + incentives",
        contactEmail: null,
        contactPhone: "+91 9876543220",
        applicationDeadline: new Date("2026-02-20"),
        experience: "Fresher or 1 year",
        qualifications: "10th pass minimum. Friendly and sales-oriented.",
        benefits: "Incentives on sales, annual bonus",
        status: "published",
        publishedAt: new Date(Date.now() - 259200000),
      },
      {
        title: "Accountant",
        titleTamil: "கணக்காளர்",
        slug: "accountant-canara-bank-kilpennathur",
        description:
          "Canara Bank Kilpennathur branch requires experienced Accountant. Responsibilities include day-to-day accounts, reconciliation, and banking operations. Tally knowledge essential.",
        company: "Canara Bank - Kilpennathur Branch",
        companyTamil: "கேனரா வங்கி - கீழ்பென்னாத்தூர் கிளை",
        location: "Kilpennathur",
        locationTamil: "கீழ்பென்னாத்தூர்",
        jobType: "full-time",
        category: "Banking",
        salaryDescription: "As per bank norms",
        contactEmail: "kilpennathur@canarabank.com",
        contactPhone: null,
        applicationDeadline: new Date("2026-03-01"),
        experience: "2-5 years in accounting",
        qualifications: "B.Com/M.Com. Tally certified. Banking experience preferred.",
        benefits: "Bank benefits, PF, gratuity",
        status: "published",
        publishedAt: new Date(Date.now() - 345600000),
      },
      {
        title: "Field Assistant - Agriculture",
        titleTamil: "கள உதவியாளர் - விவசாயம்",
        slug: "field-assistant-agriculture-department",
        description:
          "Agriculture Department requires Field Assistant for farmer outreach programs. Will involve village visits, data collection, and assisting with government schemes. Two-wheeler license mandatory.",
        company: "Agriculture Department, Tiruvannamalai",
        companyTamil: "விவசாய துறை, திருவண்ணாமலை",
        location: "Kilpennathur Block",
        locationTamil: "கீழ்பென்னாத்தூர் வட்டம்",
        jobType: "contract",
        category: "Government",
        salaryDescription: "₹15,000 - ₹20,000 per month",
        contactEmail: "agri.tvm@tn.gov.in",
        contactPhone: "+91 9876543300",
        applicationDeadline: new Date("2026-03-25"),
        experience: "Fresher or 1 year",
        qualifications: "B.Sc Agriculture or related. Valid two-wheeler license.",
        benefits: "Travel allowance",
        status: "published",
        publishedAt: new Date(Date.now() - 432000000),
      },
      {
        title: "Pharmacist",
        titleTamil: "மருந்து செய்பவர்",
        slug: "pharmacist-sri-venkateshwara-medical",
        description:
          "Leading medical store requires qualified Pharmacist. Must be registered with Pharmacy Council. Duties include dispensing medicines, inventory management, and customer consultation.",
        company: "Sri Venkateshwara Medical Store",
        companyTamil: "ஸ்ரீ வெங்கடேஸ்வரா மெடிக்கல் ஸ்டோர்",
        location: "Kilpennathur Main Road",
        locationTamil: "கீழ்பென்னாத்தூர் மெயின் ரோடு",
        jobType: "full-time",
        category: "Healthcare",
        salaryDescription: "₹18,000 - ₹25,000 per month",
        contactEmail: null,
        contactPhone: "+91 9876543210",
        applicationDeadline: new Date("2026-02-25"),
        experience: "1-3 years",
        qualifications: "B.Pharm or D.Pharm. Tamil Nadu Pharmacy Council registration.",
        benefits: "ESI, annual leave",
        status: "published",
        publishedAt: new Date(Date.now() - 518400000),
      },
      {
        title: "Tuition Teacher - Mathematics",
        titleTamil: "பயிற்சி ஆசிரியர் - கணிதம்",
        slug: "tuition-teacher-maths-bright-future",
        description:
          "Tuition centre requires Mathematics teacher for classes 8-12. Part-time or full-time. Must have strong subject knowledge and teaching experience.",
        company: "Bright Future Tuition Centre",
        companyTamil: "பிரைட் ஃப்யூச்சர் டியூஷன் சென்டர்",
        location: "Kilpennathur",
        locationTamil: "கீழ்பென்னாத்தூர்",
        jobType: "part-time",
        category: "Education",
        salaryDescription: "₹8,000 - ₹15,000 per month (based on hours)",
        contactEmail: null,
        contactPhone: "+91 9876543280",
        applicationDeadline: new Date("2026-03-05"),
        experience: "2+ years teaching experience",
        qualifications: "B.Sc Mathematics or B.Ed. Strong communication skills.",
        benefits: "Flexible hours",
        status: "published",
        publishedAt: new Date(Date.now() - 604800000),
      },
    ];

    for (const jobData of jobs) {
      await prisma.job.upsert({
        where: { slug: jobData.slug },
        update: {},
        create: jobData,
      });
    }

    console.log(`✅ ${jobs.length} jobs seeded`);

    // ==========================================
    // SEED SITE SETTINGS
    // ==========================================

    console.log("⚙️  Seeding site settings...");

    const siteSettings = [
      {
        key: "news_per_page",
        value: "9",
        label: "News Items Per Page",
        description: "Number of news items to display per page",
        category: "pagination"
      },
      {
        key: "businesses_per_page",
        value: "12",
        label: "Businesses Per Page",
        description: "Number of businesses to display per page",
        category: "pagination"
      },
      {
        key: "villages_per_page",
        value: "15",
        label: "Villages Per Page",
        description: "Number of villages to display per page",
        category: "pagination"
      },
      {
        key: "events_per_page",
        value: "6",
        label: "Events Per Page",
        description: "Number of events to display per page",
        category: "pagination"
      },
      {
        key: "site_name",
        value: "Kilpennathur Community Portal",
        label: "Site Name",
        description: "Website name displayed in title and header",
        category: "general"
      },
      {
        key: "site_description",
        value: "Your trusted source for community news, business directory, and local information",
        label: "Site Description",
        description: "Default meta description for SEO",
        category: "seo"
      },
      {
        key: "show_archives",
        value: "true",
        label: "Show Archives Sidebar",
        description: "Display monthly archives in news pages",
        category: "display"
      }
    ];

    for (const setting of siteSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting
      });
    }

    console.log(`✅ ${siteSettings.length} site settings seeded`);

    // Final summary
    console.log("\n========================================");
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================");
    console.log(`✅ Admin user created`);
    console.log(`✅ ${villages.length} villages seeded`);
    console.log(`✅ ${events.length} events seeded`);
    console.log(`✅ ${businesses.length} businesses seeded`);
    console.log(`✅ ${jobs.length} jobs seeded`);
    console.log(`✅ ${siteSettings.length} site settings seeded`);
    console.log("========================================\n");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
