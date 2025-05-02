import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const alreadyExists = await prisma.user.findFirst({
      where: { email },
    });

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, message: "User created!" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "Invalid JSON or server error." },
      { status: 500 }
    );
  }
}
