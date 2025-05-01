import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { getRandomNumber } from "@/utility/random-number";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid email" },
      { status: 400 }
    );
  }

  // Throttle OTP requests (1 per minute)
  const recent = await prisma.otpVerification.findFirst({
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

  const code = getRandomNumber(0, 1000000).toString().padStart(6, "0");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Thanks for choosing us!\n\nYour verification code is: ${code}`,
    });

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
  } catch (error: any) {
    console.error("OTP Send Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message || "Something went wrong while sending the code.",
        error: error?.stack || error,
      },
      { status: 500 }
    );
  }
}
