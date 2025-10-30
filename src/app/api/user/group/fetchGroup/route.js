import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Group from "@/model/groupModel";

connect();

export async function GET(request) {
  const userId = getData(request);

  const findGroup = await Group.find({ members: userId });
}
