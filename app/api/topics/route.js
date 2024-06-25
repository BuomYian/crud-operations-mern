import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

// Creating a topic
export async function POST(req) {
  try {
    const { title, description } = await req.json(); // Parsing JSON payload

    await connectMongoDB();

    const topic = await Topic.create({ title, description });

    return new Response(JSON.stringify({ message: "Topic created", topic }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Getting all the topics
export async function GET() {
  try {
    await connectMongoDB();

    const topics = await Topic.find();

    return new Response(JSON.stringify({ topics }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Deleting a topic
export async function handler(req, res) {
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
