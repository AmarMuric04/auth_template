import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { success: false, message: "Email and code are required." },
      { status: 400 }
    );
  }

  const otp = await prisma.otpVerification.findFirst({
    where: {
      email,
      code,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!otp) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired OTP." },
      { status: 400 }
    );
  }

  try {
    await prisma.otpVerification.delete({
      where: { id: otp.id },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying the OTP.",
      },
      { status: 500 }
    );
  }
}
