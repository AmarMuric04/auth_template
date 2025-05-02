import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ user: null }, { status: 401 });
  }

  try {
    const payload = (await verifyJwt(token)) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return Response.json({ user: null }, { status: 404 });
    }

    return Response.json({ user });
  } catch (err) {
    console.log(err);
    return Response.json({ user: null }, { status: 401 });
  }
}
