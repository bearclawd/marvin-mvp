import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // For the prototype, simulate website analysis with realistic results
    // In production, this would use Firecrawl or similar to actually scrape
    const domain = new URL(url).hostname;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const analysis = {
      companyName: domain.includes("precision") ? "Precision CNC AG" : extractCompanyName(domain),
      services: [
        "CNC Milling (3-axis, 5-axis)",
        "CNC Turning",
        "Wire EDM",
        "Surface Grinding",
      ],
      materials: [
        "Aluminum (6061, 7075)",
        "Stainless Steel (316L, 304)",
        "Titanium",
        "Brass",
        "PEEK",
      ],
      certifications: ["ISO 9001:2015"],
      contactInfo: {
        email: `info@${domain}`,
        phone: "+41 52 XXX XX XX",
        address: "Switzerland",
      },
      specializations: [
        "Precision machining",
        "Prototype to series production",
        "Tight tolerances (±0.01mm)",
      ],
    };

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 });
  }
}

function extractCompanyName(domain: string): string {
  const name = domain.replace(/\.(com|ch|de|at|net|org)$/, "").replace(/^www\./, "");
  return name.charAt(0).toUpperCase() + name.slice(1) + " GmbH";
}
