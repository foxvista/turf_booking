import { connect } from "@/lib/db";
import bcrypt from "bcrypt";
import Admin from "@/model/adminModel";
connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { fullName, userName, phoneNumber, password } = reqBody;

    //verification for empty fields

    if (!fullName || !password || !phoneNumber || !userName) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    console.log(reqBody);

    // Check if admin already exists

    const existingAdmin = await Admin.findOne({
      $or: [{ phoneNumber }, { userName }],
    });

    if (existingAdmin) {
      return new Response(
        JSON.stringify({
          error: "Admin with this phone number or username already exists.",
        }),
        { status: 400 }
      );
    }

    //password hashing

    const hashedPassword = await bcrypt.hash(password, 10);

    // mobile number validation

    // Create new admin
    const newAdmin = new Admin({
      fullName,
      userName,
      phoneNumber,
      hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    return new Response(
      JSON.stringify({ message: "Admin registered successfully." }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
