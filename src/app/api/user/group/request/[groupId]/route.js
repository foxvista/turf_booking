import { handleError } from "@/helpers/errorHelper";
import { connect } from "@/lib/db";
import Group from "@/model/groupModel";
import User from "@/model/userModel";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
  try {
    const { groupId } = await params;
    const reqBody = await request.json();
    const { userId, accept } = reqBody;

    // check user already added

    const groupData = await Group.findById(groupId);

    const checkMembers = groupData.members.some(
      (member) => member.userId === userId
    );

    if (!checkMembers) {
      return NextResponse.json({ message: "already a member" });
    }

    await Group.findByIdAndUpdate(
      groupId,
      {
        $push: { members: { userId, accept } },
      },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          addedGroups: groupId,
        },
      },
      { new: true }
    );

    return NextResponse.json({ status: 200, message: "Added to the group" });
  } catch (error) {
    return handleError(error);
  }
}
