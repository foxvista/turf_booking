import { NextResponse } from "next/server";

export function handleError(error) {
  console.log(error);
  return NextResponse.json(
    { error: error.message || "An unexpected error occurred" },
    { status: 500 }
  );
}
