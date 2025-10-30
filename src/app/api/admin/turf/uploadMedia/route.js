import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Turf from "@/model/turfModel";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  try {
    const adminId = getData(request);
    const reqBody = await request.formData();
    const files = reqBody.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: file.name,
        folder: "/turf_uploads",
      });

      return uploadResponse.url; // return only the URL
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    await Turf.findOneAndUpdate(
      { adminId: adminId },
      { $push: { turfUrls: { $each: uploadedUrls } } },
      { new: true, runValidators: false }
    );

    return NextResponse.json({
      success: true,
      message: "File uploaded and saved successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
