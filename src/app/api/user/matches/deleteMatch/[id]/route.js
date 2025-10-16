import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
connect();

export async function PUT(request, { params }) {
  const { id } = params;
  const reqBody = await request.json();
  const { deleted } = reqBody;
  await Match.findByIdAndUpdate(id, deleted);

  return NextResponse.json(
    { status: 200 },
    { message: "match deleted succesfully" }
  );
}
