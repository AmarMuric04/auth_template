import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, code, type, username, firstName, lastName } = await req.json();
  if (!email || !code || !["signup", "signin"].includes(type)) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid parameters." },
      { status: 400 }
    );
  }

  const otp = await prisma.otpVerification.findFirst({
    where: {
      email,
      code,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired OTP." },
      { status: 400 }
    );
  }

  try {
    await prisma.otpVerification.delete({ where: { id: otp.id } });

    let user = await prisma.user.findFirst({ where: { email } });

    if (type === "signup") {
      user = await prisma.user.create({
        data: { email, username, firstName, lastName },
      });
    }

    console.log(user);

    // TODO: ISSUE SESSION / JWT HERE
    // e.g.: const token = signJwt({ userId: user.id });
    // and set as cookie or return in body.

    return NextResponse.json({
      success: true,
      message: "OTP verified.",
      // user, token
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
