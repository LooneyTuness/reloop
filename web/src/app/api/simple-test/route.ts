export async function GET() {
  return Response.json({
    status: "ok",
    message: "Simple test endpoint working",
    timestamp: new Date().toISOString()
  });
}
