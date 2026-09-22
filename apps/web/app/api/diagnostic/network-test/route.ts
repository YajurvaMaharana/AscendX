import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Diagnostic network speed and latency test endpoint.
 * - GET with type=ping: returns immediate lightweight JSON for roundtrip latency calculation.
 * - GET with type=download: returns a generated 300KB payload to measure download throughput.
 * - POST: accepts an uploaded payload to measure client-to-server upload throughput.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "ping";

  const clientTimestamp = searchParams.get("t");

  if (type === "ping") {
    return NextResponse.json({
      status: "ok",
      serverTime: Date.now(),
      clientTime: clientTimestamp ? Number(clientTimestamp) : null,
      message: "pong",
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }

  // Download bandwidth test payload (approx 300 KB of deterministic data)
  const sizeKb = Math.min(Number(searchParams.get("size") || 300), 1024);
  const chunk = "AscendX-Diagnostic-Network-Payload-Byte-Stream-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz\n";
  const repeatCount = Math.ceil((sizeKb * 1024) / chunk.length);
  const payload = chunk.repeat(repeatCount).slice(0, sizeKb * 1024);

  return new NextResponse(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": payload.length.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Server-Timestamp": Date.now().toString(),
    },
  });
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const body = await req.arrayBuffer();
  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    status: "ok",
    bytesReceived: body.byteLength,
    serverProcessingMs: durationMs,
    serverTime: Date.now(),
  }, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
