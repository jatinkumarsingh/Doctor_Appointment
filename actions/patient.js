import { db } from "@/lib/prisma";
import { requireAuthUserId } from "@/lib/auth";

/**
 * Get all appointments for the authenticated patient
 */
export async function getPatientAppointments() {
  const userId = await requireAuthUserId();

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
        role: "PATIENT",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("Patient not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        patientId: user.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    console.error("Failed to get patient appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
}
