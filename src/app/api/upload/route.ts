import { saveImage, uploadsRecentlyBusy } from "@/lib/uploads";

// Only Sweet Main's own pages may upload (a browser always sends the page's origin).
function fromOurSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = new URL(origin).hostname;
  return host === "www.sweetmain.com" || host === "sweetmain.com" || host === "localhost" || host.endsWith(".vercel.app");
}

export async function POST(request: Request) {
  if (!fromOurSite(request)) {
    return Response.json({ error: "Uploads only work from the Sweet Main site." }, { status: 403 });
  }
  if (await uploadsRecentlyBusy()) {
    return Response.json({ error: "Lots of photos are being uploaded right now. Please try again in a few minutes." }, { status: 429 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No photo was sent." }, { status: 400 });
  }
  try {
    return Response.json({ name: await saveImage(file) });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
