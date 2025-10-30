import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Group from "@/model/groupModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request) {
  try {
    const createdUser = getData(request);
    const reqBody = await request.json();
    const { groupName, description, totalMembers } = reqBody;

    if (!groupName) {
      return NextResponse.json({
        status: 404,
        message: "Group name is required",
      });
    }
    const code = generateGroupCode(groupName);

    function generateGroupCode(name) {
      const now = new Date();

      const namePart = name.trim().substring(0, 2).toUpperCase() || "XX";
      const dayPart = String(now.getDate()).padStart(2, "0");

      const uniquePart = (
        now.getMilliseconds() + Math.floor(Math.random() * 10000)
      )
        .toString(36)
        .toUpperCase()
        .slice(-4);

      const groupCode = `${namePart}${uniquePart}${dayPart}`;

      return groupCode;
    }

    const newGroup = new Group({
      createdBy: createdUser,
      groupName,
      description,
      totalMembers,
      groupCode: code,
      createdBy: createdUser,
      members: [
        {
          userId: createdUser,
          accept: true,
          admin: true,
        },
      ],
    });

    const savedGroup = await newGroup.save();

    return NextResponse.json({
      status: 200,
      message: "New group created succesfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
