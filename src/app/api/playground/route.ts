// src/app/api/playground/route.ts

import { NextResponse } from "next/server";

const JDLOODLE_ENDPOINT = "https://api.jdoodle.com/v1/execute";

export async function POST(req: Request) {
  // 凭据放在环境变量里，避免硬编码进仓库（Netlify: Site configuration → Environment variables）
  const clientId = process.env.JDLOODLE_CLIENT_ID;
  const clientSecret = process.env.JDLOODLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse(
      JSON.stringify({
        error:
          "代码运行服务尚未配置：请设置 JDLOODLE_CLIENT_ID 与 JDLOODLE_CLIENT_SECRET 环境变量。",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { code } = await req.json();

    const response = await fetch(JDLOODLE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: code,
        language: "java",
        versionIndex: process.env.JDLOODLE_VERSION_INDEX || "3", // Java 11
        clientId,
        clientSecret,
      }),
    });

    const data = await response.json();

    return new NextResponse(
      JSON.stringify({
        run: {
          output: data.output || "No output",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: "Execution failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
