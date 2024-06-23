import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function POST(res) {
  const { title, description } = await res.json();
  await connectMongoDB();
  await Topic.create({ title, description });
  return NextResponse.json({ message: "Topic Createed" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const topics = await Topic.find();
  return NextResponse.json({ topics });
}

// export async function DELETE(req, res) {
//   const id = res.nextUrl.searchParams.get("id");
//   await connectMongoDB();
//   await Topic.findByIdAndDelete(id);
//   return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
// }

export default async function handler(req, res) {
  // Ensure it's a DELETE request
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const id = req.query.id;

  try {
    await connectMongoDB();

    const result = await Topic.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Topic not found" });
    }

    return res.status(200).json({ message: "Topic deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
