import { connect } from "@/lib/db";
import Group from "@/model/groupModel";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
  const groupId = params;
  const reqBody = request.json();

  await Group.findByIdAndUpdate(groupId, { $set: reqBody }, { new: true });

  return NextResponse.json(
    { status: 200 },
    { message: "group deleted successfully" }
  );
}
