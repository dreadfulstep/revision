import { deleteSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await deleteSession();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL!));
}