import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRandomNumber } from "@/utility/random-number";
import { sendVerificationEmail } from "@/utility/send-email";

const generateOTPCode = () =>
  getRandomNumber(0, 1000000).toString().padStart(6, "0");

export async function POST(req: Request) {
  const { email, type } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid email" },
      { status: 400 }
    );
  }

  if (type === "signin") {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "No user found with that email." },
        { status: 404 }
      );
    }
  }

  const recent = await prisma.otpVerification.findUnique({
    where: {
      email,
      createdAt: {
        gte: new Date(Date.now() - 60 * 1000),
      },
    },
  });

  if (recent) {
    return NextResponse.json(
      {
        success: false,
        message: "Please wait before requesting another code.",
      },
      { status: 429 }
    );
  }

  const code = generateOTPCode();

  try {
    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    await sendVerificationEmail(email, code);

    await prisma.otpVerification.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`Sent OTP ${code} to ${email}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending the code.",
      },
      { status: 500 }
    );
  }
}
