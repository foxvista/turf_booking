import { NextResponse } from "next/server";

export function handleError(error) {
  return NextResponse.json(
    { error: error.message || "An unexpected error occurred" },
    { status: 500 }
  );
}
