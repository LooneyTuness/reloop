export async function GET() {
  return Response.json({
    status: "ok",
    message: "Debug endpoint working",
    timestamp: new Date().toISOString()
  });
}
