import { db } from "./prisma";
import { getAuthUserId } from "./auth";

export const checkUser = async () => {
  const userId = await getAuthUserId();

  if (!userId) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            // Only get transactions from current month
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return loggedInUser;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
