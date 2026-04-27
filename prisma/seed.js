const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DOCTORS = [
  {
    name: "Dr. Aarav Mehta",
    email: "aarav.mehta@demo-health.com",
    specialty: "Cardiology",
    experience: 11,
    description:
      "Interventional cardiologist focused on preventive care, hypertension, and long-term heart health planning.",
    credentialUrl: "https://example.com/credentials/aarav-mehta",
  },
  {
    name: "Dr. Isha Kapoor",
    email: "isha.kapoor@demo-health.com",
    specialty: "Dermatology",
    experience: 8,
    description:
      "Treats acne, eczema, and pigment disorders with evidence-based plans tailored to skin type and lifestyle.",
    credentialUrl: "https://example.com/credentials/isha-kapoor",
  },
  {
    name: "Dr. Rohan Sen",
    email: "rohan.sen@demo-health.com",
    specialty: "Neurology",
    experience: 13,
    description:
      "Specializes in headache disorders, neuropathy, and movement conditions with structured follow-up care.",
    credentialUrl: "https://example.com/credentials/rohan-sen",
  },
  {
    name: "Dr. Naina Verma",
    email: "naina.verma@demo-health.com",
    specialty: "Pediatrics",
    experience: 9,
    description:
      "Pediatrician focused on preventive visits, nutrition counseling, and developmental milestone tracking.",
    credentialUrl: "https://example.com/credentials/naina-verma",
  },
  {
    name: "Dr. Karan Bhatia",
    email: "karan.bhatia@demo-health.com",
    specialty: "Orthopedics",
    experience: 14,
    description:
      "Orthopedic consultant for joint pain, sports injuries, and post-fracture rehabilitation guidance.",
    credentialUrl: "https://example.com/credentials/karan-bhatia",
  },
  {
    name: "Dr. Mira Nair",
    email: "mira.nair@demo-health.com",
    specialty: "Psychiatry",
    experience: 10,
    description:
      "Supports anxiety, depression, and sleep issues using a patient-centered approach and clear care plans.",
    credentialUrl: "https://example.com/credentials/mira-nair",
  },
];

function buildDailyAvailabilityWindow() {
  const base = new Date();

  const startTime = new Date(base);
  startTime.setHours(10, 0, 0, 0);

  const endTime = new Date(base);
  endTime.setHours(17, 0, 0, 0);

  return { startTime, endTime };
}

async function seedDoctors() {
  const passwordHash = await bcrypt.hash("Doctor@123", 10);
  const seededDoctorIds = [];

  for (const doctor of DOCTORS) {
    const stableId = `seed-${doctor.email}`;

    const seededDoctor = await prisma.user.upsert({
      where: { email: doctor.email },
      create: {
        id: stableId,
        clerkUserId: stableId,
        email: doctor.email,
        name: doctor.name,
        passwordHash,
        role: "DOCTOR",
        specialty: doctor.specialty,
        experience: doctor.experience,
        description: doctor.description,
        credentialUrl: doctor.credentialUrl,
        verificationStatus: "VERIFIED",
      },
      update: {
        name: doctor.name,
        passwordHash,
        role: "DOCTOR",
        specialty: doctor.specialty,
        experience: doctor.experience,
        description: doctor.description,
        credentialUrl: doctor.credentialUrl,
        verificationStatus: "VERIFIED",
      },
    });

    seededDoctorIds.push(seededDoctor.id);
  }

  const { startTime, endTime } = buildDailyAvailabilityWindow();

  for (const doctorId of seededDoctorIds) {
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        doctorId,
        status: "AVAILABLE",
      },
      orderBy: {
        startTime: "asc",
      },
    });

    if (existingAvailability) {
      await prisma.availability.update({
        where: { id: existingAvailability.id },
        data: { startTime, endTime, status: "AVAILABLE" },
      });
      continue;
    }

    await prisma.availability.create({
      data: {
        doctorId,
        startTime,
        endTime,
        status: "AVAILABLE",
      },
    });
  }
}

async function main() {
  await seedDoctors();
  console.log(`Seeded ${DOCTORS.length} doctors.`);
}

main()
  .catch((error) => {
    console.error("Doctor seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
