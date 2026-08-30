import { PrismaClient, CollegeType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Curated high-resolution campus photos for realistic cards and galleries
const CAMPUS_PHOTO_POOL = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
];

interface RawCollegeDef {
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  nirf: number;
  ranking: number;
  annualFees: number;
  accreditation: string;
  establishedYear: number;
}

const COLLEGE_DEFINITIONS: RawCollegeDef[] = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "GOVERNMENT",
    nirf: 3,
    ranking: 1,
    annualFees: 240000,
    accreditation: "A++",
    establishedYear: 1958,
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "GOVERNMENT",
    nirf: 2,
    ranking: 2,
    annualFees: 245000,
    accreditation: "A++",
    establishedYear: 1961,
  },
  {
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "GOVERNMENT",
    nirf: 1,
    ranking: 3,
    annualFees: 230000,
    accreditation: "A++",
    establishedYear: 1959,
  },
  {
    name: "Indian Institute of Technology Kanpur",
    slug: "iit-kanpur",
    city: "Kanpur",
    state: "Uttar Pradesh",
    type: "GOVERNMENT",
    nirf: 4,
    ranking: 4,
    annualFees: 235000,
    accreditation: "A++",
    establishedYear: 1959,
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    slug: "iit-kharagpur",
    city: "Kharagpur",
    state: "West Bengal",
    type: "GOVERNMENT",
    nirf: 5,
    ranking: 5,
    annualFees: 225000,
    accreditation: "A++",
    establishedYear: 1951,
  },
  {
    name: "Indian Institute of Technology Roorkee",
    slug: "iit-roorkee",
    city: "Roorkee",
    state: "Uttarakhand",
    type: "GOVERNMENT",
    nirf: 6,
    ranking: 6,
    annualFees: 230000,
    accreditation: "A++",
    establishedYear: 1847,
  },
  {
    name: "Indian Institute of Technology Guwahati",
    slug: "iit-guwahati",
    city: "Guwahati",
    state: "Assam",
    type: "GOVERNMENT",
    nirf: 7,
    ranking: 7,
    annualFees: 220000,
    accreditation: "A++",
    establishedYear: 1994,
  },
  {
    name: "BITS Pilani",
    slug: "bits-pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "PRIVATE",
    nirf: 20,
    ranking: 8,
    annualFees: 540000,
    accreditation: "A",
    establishedYear: 1964,
  },
  {
    name: "National Institute of Technology Tiruchirappalli",
    slug: "nit-trichy",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "GOVERNMENT",
    nirf: 9,
    ranking: 9,
    annualFees: 155000,
    accreditation: "A+",
    establishedYear: 1964,
  },
  {
    name: "National Institute of Technology Surathkal",
    slug: "nit-surathkal",
    city: "Mangalore",
    state: "Karnataka",
    type: "GOVERNMENT",
    nirf: 12,
    ranking: 10,
    annualFees: 160000,
    accreditation: "A+",
    establishedYear: 1960,
  },
  {
    name: "International Institute of Information Technology Hyderabad",
    slug: "iiit-hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    type: "DEEMED",
    nirf: 55,
    ranking: 11,
    annualFees: 380000,
    accreditation: "A++",
    establishedYear: 1998,
  },
  {
    name: "National Institute of Technology Rourkela",
    slug: "nit-rourkela",
    city: "Rourkela",
    state: "Odisha",
    type: "GOVERNMENT",
    nirf: 16,
    ranking: 12,
    annualFees: 150000,
    accreditation: "A+",
    establishedYear: 1961,
  },
  {
    name: "National Institute of Technology Warangal",
    slug: "nit-warangal",
    city: "Warangal",
    state: "Telangana",
    type: "GOVERNMENT",
    nirf: 21,
    ranking: 13,
    annualFees: 165000,
    accreditation: "A+",
    establishedYear: 1959,
  },
  {
    name: "Delhi Technological University",
    slug: "dtu-delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "GOVERNMENT",
    nirf: 29,
    ranking: 14,
    annualFees: 190000,
    accreditation: "A",
    establishedYear: 1941,
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "PRIVATE",
    nirf: 11,
    ranking: 15,
    annualFees: 198000,
    accreditation: "A++",
    establishedYear: 1984,
  },
  {
    name: "Netaji Subhas University of Technology",
    slug: "nsut-delhi",
    city: "New Delhi",
    state: "Delhi",
    type: "GOVERNMENT",
    nirf: 60,
    ranking: 16,
    annualFees: 185000,
    accreditation: "A",
    establishedYear: 1983,
  },
  {
    name: "BITS Pilani - Goa Campus",
    slug: "bits-goa",
    city: "Zuarinagar",
    state: "Goa",
    type: "PRIVATE",
    nirf: 25,
    ranking: 17,
    annualFees: 540000,
    accreditation: "A",
    establishedYear: 2004,
  },
  {
    name: "International Institute of Information Technology Bangalore",
    slug: "iiit-bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    type: "DEEMED",
    nirf: 74,
    ranking: 18,
    annualFees: 420000,
    accreditation: "A+",
    establishedYear: 1999,
  },
  {
    name: "BITS Pilani - Hyderabad Campus",
    slug: "bits-hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    type: "PRIVATE",
    nirf: 28,
    ranking: 19,
    annualFees: 540000,
    accreditation: "A",
    establishedYear: 2008,
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    slug: "thapar-patiala",
    city: "Patiala",
    state: "Punjab",
    type: "DEEMED",
    nirf: 22,
    ranking: 20,
    annualFees: 480000,
    accreditation: "A+",
    establishedYear: 1956,
  },
  {
    name: "College of Engineering Pune",
    slug: "coep-pune",
    city: "Pune",
    state: "Maharashtra",
    type: "GOVERNMENT",
    nirf: 73,
    ranking: 21,
    annualFees: 90000,
    accreditation: "A+",
    establishedYear: 1854,
  },
  {
    name: "Manipal Institute of Technology",
    slug: "mit-manipal",
    city: "Manipal",
    state: "Karnataka",
    type: "PRIVATE",
    nirf: 61,
    ranking: 22,
    annualFees: 460000,
    accreditation: "A++",
    establishedYear: 1957,
  },
  {
    name: "Motilal Nehru National Institute of Technology",
    slug: "mnnit-allahabad",
    city: "Prayagraj",
    state: "Uttar Pradesh",
    type: "GOVERNMENT",
    nirf: 49,
    ranking: 23,
    annualFees: 145000,
    accreditation: "A",
    establishedYear: 1961,
  },
  {
    name: "Malaviya National Institute of Technology",
    slug: "mnit-jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    type: "GOVERNMENT",
    nirf: 37,
    ranking: 24,
    annualFees: 150000,
    accreditation: "A",
    establishedYear: 1963,
  },
  {
    name: "National Institute of Technology Calicut",
    slug: "nit-calicut",
    city: "Kozhikode",
    state: "Kerala",
    type: "GOVERNMENT",
    nirf: 23,
    ranking: 25,
    annualFees: 155000,
    accreditation: "A+",
    establishedYear: 1961,
  },
  {
    name: "Amrita Vishwa Vidyapeetham",
    slug: "amrita-coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    type: "DEEMED",
    nirf: 19,
    ranking: 26,
    annualFees: 350000,
    accreditation: "A++",
    establishedYear: 2003,
  },
  {
    name: "PSG College of Technology",
    slug: "psg-tech",
    city: "Coimbatore",
    state: "Tamil Nadu",
    type: "PRIVATE",
    nirf: 63,
    ranking: 27,
    annualFees: 120000,
    accreditation: "A+",
    establishedYear: 1951,
  },
  {
    name: "Veermata Jijabai Technological Institute",
    slug: "vjti-mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    type: "GOVERNMENT",
    nirf: 82,
    ranking: 28,
    annualFees: 85000,
    accreditation: "A",
    establishedYear: 1887,
  },
  {
    name: "Jadavpur University Faculty of Engineering",
    slug: "jadavpur-engg",
    city: "Kolkata",
    state: "West Bengal",
    type: "GOVERNMENT",
    nirf: 10,
    ranking: 29,
    annualFees: 52000,
    accreditation: "A",
    establishedYear: 1955,
  },
  {
    name: "SRM Institute of Science and Technology",
    slug: "srm-chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "PRIVATE",
    nirf: 28,
    ranking: 30,
    annualFees: 320000,
    accreditation: "A++",
    establishedYear: 1985,
  },
  {
    name: "RV College of Engineering",
    slug: "rvce-bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    type: "PRIVATE",
    nirf: 96,
    ranking: 31,
    annualFees: 280000,
    accreditation: "A+",
    establishedYear: 1963,
  },
  {
    name: "PES University",
    slug: "pes-bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    type: "PRIVATE",
    nirf: 100,
    ranking: 32,
    annualFees: 410000,
    accreditation: "A",
    establishedYear: 1972,
  },
  {
    name: "Shiv Nadar University",
    slug: "snu-noida",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    type: "PRIVATE",
    nirf: 62,
    ranking: 33,
    annualFees: 650000,
    accreditation: "A",
    establishedYear: 2011,
  },
  {
    name: "Kalinga Institute of Industrial Technology",
    slug: "kiit-bhubaneswar",
    city: "Bhubaneswar",
    state: "Odisha",
    type: "DEEMED",
    nirf: 39,
    ranking: 34,
    annualFees: 385000,
    accreditation: "A++",
    establishedYear: 1992,
  },
  {
    name: "Ashoka University",
    slug: "ashoka-sonipat",
    city: "Sonipat",
    state: "Haryana",
    type: "PRIVATE",
    nirf: 88,
    ranking: 35,
    annualFees: 780000,
    accreditation: "A",
    establishedYear: 2014,
  },
];

const COURSE_CATALOG = [
  { name: "Computer Science & Engineering", degree: "B.Tech", duration: 4, seats: 120, feeFactor: 1.0 },
  { name: "Electronics & Communication Engineering", degree: "B.Tech", duration: 4, seats: 120, feeFactor: 0.95 },
  { name: "Electrical & Electronics Engineering", degree: "B.Tech", duration: 4, seats: 90, feeFactor: 0.9 },
  { name: "Mechanical Engineering", degree: "B.Tech", duration: 4, seats: 120, feeFactor: 0.85 },
  { name: "Data Science & Artificial Intelligence", degree: "B.Tech", duration: 4, seats: 60, feeFactor: 1.05 },
  { name: "Master of Business Administration (MBA)", degree: "MBA", duration: 2, seats: 60, feeFactor: 1.15 },
  { name: "Information Technology", degree: "B.Tech", duration: 4, seats: 90, feeFactor: 0.95 },
];

const RECRUITER_POOL = [
  "Google",
  "Microsoft",
  "Amazon",
  "Goldman Sachs",
  "Morgan Stanley",
  "Qualcomm",
  "NVIDIA",
  "Adobe",
  "Apple",
  "Texas Instruments",
  "Deloitte",
  "McKinsey & Co",
  "TCS Innovations",
  "Infosys",
  "L&T Technology",
  "Tata Motors",
  "Samsung R&D",
  "Oracle",
  "Cisco",
  "Intel",
];

async function main() {
  console.log("🌱 Starting Comprehensive CollegeHunt Database Seed (35 Institutions)...");

  // ─── 1. Clean Database (Delete dependent rows in order) ─────────
  console.log("🧹 Clearing old seed data...");
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.collegeCutoff.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.savedCollege.deleteMany({});
  await prisma.savedComparison.deleteMany({});
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  // ─── 2. Seed Users (Admins, Students, Reviewers) ────────────────
  console.log("👥 Seeding users...");
  const adminPassword = await bcrypt.hash("Admin@1234", 10);
  const studentPassword = await bcrypt.hash("Student@1234", 10);

  const admin = await prisma.user.create({
    data: {
      name: "CollegeHunt Administrator",
      email: "admin@collegehunt.in",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Rohan Sharma",
      email: "student@example.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  // Create 15 distinct reviewer students for diverse authentic reviews
  const reviewers = [];
  for (let i = 1; i <= 15; i++) {
    const reviewer = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `reviewer${i}@collegehunt.in`,
        password: studentPassword,
        role: "STUDENT",
      },
    });
    reviewers.push(reviewer);
  }
  console.log(`✅ Seeded ${reviewers.length + 2} users`);

  // ─── 3. Seed 35 Colleges with Courses, Placements, Reviews ──────
  console.log("🏛️ Seeding 35 colleges with rich data...");

  let collegeCounter = 0;
  for (const c of COLLEGE_DEFINITIONS) {
    collegeCounter++;
    // Assign 3 campus photos from the pool
    const img1 = CAMPUS_PHOTO_POOL[(collegeCounter - 1) % CAMPUS_PHOTO_POOL.length];
    const img2 = CAMPUS_PHOTO_POOL[(collegeCounter + 2) % CAMPUS_PHOTO_POOL.length];
    const img3 = CAMPUS_PHOTO_POOL[(collegeCounter + 5) % CAMPUS_PHOTO_POOL.length];

    const college = await prisma.college.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: `${c.name} is a premier educational institution located in ${c.city}, ${c.state}. ${faker.lorem.paragraph(3)} It provides modern academic infrastructure, global research partnerships, and exceptional career opportunities.`,
        location: `${c.city}, ${c.state}`,
        city: c.city,
        state: c.state,
        type: c.type,
        ranking: c.ranking,
        nirf: c.nirf,
        establishedYear: c.establishedYear,
        website: `https://${c.slug}.edu.in`,
        annualFees: c.annualFees,
        maxFees: Math.round(c.annualFees * 1.2),
        accreditation: c.accreditation,
        approvedBy: ["UGC", "AICTE"],
        totalStudents: Math.round(faker.number.int({ min: 4500, max: 18000 })),
        totalFaculty: Math.round(faker.number.int({ min: 280, max: 850 })),
        campusArea: Math.round(faker.number.int({ min: 65, max: 550 })),
        isVerified: true,
        images: [img1, img2, img3],
      },
    });

    // ─── 3a. Add 2–4 Courses ──────────────────────────────────────
    const courseCount = (collegeCounter % 3) + 2; // 2, 3, or 4 courses
    const selectedCatalog = COURSE_CATALOG.slice(0, courseCount);

    for (const courseDef of selectedCatalog) {
      const courseFee = Math.round(c.annualFees * courseDef.feeFactor);
      const course = await prisma.course.create({
        data: {
          name: courseDef.name,
          degree: courseDef.degree,
          duration: courseDef.duration,
          seats: courseDef.seats,
          fees: courseFee,
          eligibility:
            c.type === "GOVERNMENT"
              ? "JEE Advanced / JEE Main qualified with 75%+ in 12th PCM"
              : "State CET / JEE Main / Direct Merit 70%+ in PCM",
          mode: "Full-time",
          collegeId: college.id,
        },
      });

      // Cutoff rank for the course
      const baseRank = c.ranking * 180 + (courseDef.feeFactor < 1 ? 800 : 150);
      await prisma.collegeCutoff.create({
        data: {
          exam: c.type === "GOVERNMENT" ? "JEE Advanced" : "JEE Main",
          category: "General",
          cutoffRank: baseRank + faker.number.int({ min: 50, max: 400 }),
          round: "Round 1",
          year: 2024,
          collegeId: college.id,
          courseId: course.id,
        },
      });
    }

    // ─── 3b. Add 1–2 Placement Year Records ───────────────────────
    const baseAvgLPA =
      c.type === "GOVERNMENT" && c.ranking <= 10
        ? faker.number.float({ min: 18.5, max: 28.5, fractionDigits: 1 })
        : c.annualFees > 400000
        ? faker.number.float({ min: 12.0, max: 21.0, fractionDigits: 1 })
        : faker.number.float({ min: 7.5, max: 14.5, fractionDigits: 1 });

    const placementYears = [2024, 2023];
    for (const yr of placementYears) {
      const topCompanies = faker.helpers.arrayElements(RECRUITER_POOL, 6);
      const yrAvg = yr === 2024 ? baseAvgLPA : Number((baseAvgLPA * 0.92).toFixed(1));
      const highest = Number((yrAvg * faker.number.float({ min: 2.5, max: 4.5 })).toFixed(1));
      const median = Number((yrAvg * 0.88).toFixed(1));
      const rate = faker.number.float({ min: 82.0, max: 98.5, fractionDigits: 1 });

      await prisma.placement.create({
        data: {
          year: yr,
          avgPackage: yrAvg,
          highestPackage: highest,
          medianPackage: median,
          placementRate: rate,
          totalPlaced: faker.number.int({ min: 450, max: 1800 }),
          topRecruiters: topCompanies,
          collegeId: college.id,
        },
      });
    }

    // ─── 3c. Add 3–5 Reviews per College ─────────────────────────
    // Hand-author sensible ratings between 3.0 and 4.9
    const reviewCount = faker.number.int({ min: 3, max: 5 });
    // Pick unique reviewers for this college (ensuring unique composite key)
    const assignedReviewers = faker.helpers.arrayElements(reviewers, reviewCount);

    for (let rIdx = 0; rIdx < reviewCount; rIdx++) {
      const revUser = assignedReviewers[rIdx];
      // Hand-author numeric rating between 3.0 and 4.9
      const rating = Number(
        (c.ranking <= 10
          ? faker.number.float({ min: 4.2, max: 4.9, fractionDigits: 1 })
          : faker.number.float({ min: 3.2, max: 4.6, fractionDigits: 1 })
        ).toFixed(1)
      );

      await prisma.review.create({
        data: {
          rating,
          academics: Math.min(5, Math.max(1, Number((rating + faker.number.float({ min: -0.3, max: 0.3 })).toFixed(1)))),
          infrastructure: Math.min(5, Math.max(1, Number((rating + faker.number.float({ min: -0.4, max: 0.4 })).toFixed(1)))),
          faculty: Math.min(5, Math.max(1, Number((rating + faker.number.float({ min: -0.3, max: 0.3 })).toFixed(1)))),
          placement: Math.min(5, Math.max(1, Number((rating + faker.number.float({ min: -0.2, max: 0.3 })).toFixed(1)))),
          hostel: Math.min(5, Math.max(1, Number((rating + faker.number.float({ min: -0.5, max: 0.2 })).toFixed(1)))),
          title: faker.helpers.arrayElement([
            "Exceptional academic exposure and stellar campus placements",
            "Great faculty mentorship with strong peer coding culture",
            "State-of-the-art research laboratories and vibrant fest season",
            "Good return on investment with supportive alumni network",
            "Demanding coursework but unmatched career opportunities",
          ]),
          content: faker.lorem.paragraph(2),
          pros: faker.helpers.arrayElement([
            "World-class professors, 24/7 library access, top tech recruiters visit every season.",
            "Strong alumni support, modern labs, high student autonomy, vibrant coding clubs.",
            "Green expansive campus, high package domestic and international offers, great sports ground.",
          ]),
          cons: faker.helpers.arrayElement([
            "Relatively rigorous exam schedules, hostel mess food is average on certain days.",
            "High competition among peers, strict attendance requirements in foundational subjects.",
            "Location is slightly distant from main city hub, campus travel requires bicycles.",
          ]),
          batch: faker.helpers.arrayElement([2023, 2024, 2025]),
          program: "B.Tech Computer Science",
          verified: true,
          helpfulCount: faker.number.int({ min: 3, max: 45 }),
          userId: revUser.id,
          collegeId: college.id,
        },
      });
    }

    process.stdout.write(`.`);
  }

  console.log(`\n✅ 35 Colleges seeded with courses, placements, and reviews!`);

  // ─── 4. Seed Community Discussions & Answers ────────────────────
  console.log("💬 Seeding community discussions...");

  const firstCollege = await prisma.college.findFirst();

  const q1 = await prisma.question.create({
    data: {
      title: "Is early round counseling worth it for highly selective engineering programs?",
      content:
        "I'm finalizing my application & counseling strategy for 2025 admissions. My stats are solid (AIR 1120 in JEE, 99.2%ile), but I'm debating whether locking an early seat at IIIT-H or BITS Pilani CS gives a significant statistical advantage over waiting for subsequent rounds.",
      userId: student.id,
      collegeId: firstCollege!.id,
    },
  });

  await prisma.answer.create({
    data: {
      content:
        "From my experience and tracking recent branch change and seat withdrawal trends, if your primary goal is core computer science research or premier algorithmic placements, taking the confirmed seat gives massive mental peace. Early counseling locks you in before cutoff volatility kicks in.",
      isAccepted: true,
      helpfulCount: 48,
      userId: admin.id,
      questionId: q1.id,
    },
  });

  const q2 = await prisma.question.create({
    data: {
      title: "What is the real hostel condition and food quality at top residential campuses?",
      content:
        "I am looking into hostel allocation rules, mess quality, and Wi-Fi infrastructure across top institutions. Any honest senior feedback on first-year living conditions?",
      userId: reviewers[0].id,
      collegeId: firstCollege!.id,
    },
  });

  await prisma.answer.create({
    data: {
      content:
        "Most premier campuses have dedicated first-year hostels with twin-sharing rooms. Mess food is decent with rotational student committees. High-speed LAN/Wi-Fi (100Mbps+) is accessible in hostels, and senior students usually get single rooms from 3rd year onwards.",
      isAccepted: true,
      helpfulCount: 32,
      userId: student.id,
      questionId: q2.id,
    },
  });

  console.log("\n========================================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("   • Total Colleges: 35");
  console.log("   • Courses per college: 2–4 (Fees ₹50,000 – ₹8,00,000)");
  console.log("   • Placement records: 2 years (2024 & 2023)");
  console.log("   • Reviews per college: 3–5 (Ratings 3.0 – 4.9)");
  console.log("   • Discussions & verified answers seeded");
  console.log("--------------------------------------------------------");
  console.log("🔑 Default Credentials:");
  console.log("   Admin:   admin@collegehunt.in / Admin@1234");
  console.log("   Student: student@example.com / Student@1234");
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
