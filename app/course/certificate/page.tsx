import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { PrintButton } from "@/components/certificate/PrintButton";
import LogoutButton from "@/components/LogoutButton";

type Certificate = {
  id: string;
  user_name: string;
  brief: string;
  issued_at: string;
};

const BRIEF_LABELS: Record<string, string> = {
  A: "Thirroul Beachside Café (Brief A)",
  B: "Illawarra Physio Clinic (Brief B)",
  C: "Local Electrician — Sparkwise Electrical (Brief C)",
};

export default async function CertificatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const certRaw = await sql`
    SELECT id, user_name, brief, issued_at
    FROM   certificates
    WHERE  user_id = ${user.userId}
    LIMIT  1
  `;
  const cert = (certRaw as unknown as Certificate[])[0];
  if (!cert) notFound();

  const issuedDate = new Date(cert.issued_at).toLocaleDateString("en-AU", {
    day: "numeric", month: "long", year: "numeric",
  });

  const briefLabel = BRIEF_LABELS[cert.brief] ?? `Brief ${cert.brief}`;

  return (
    <>
      {/* Print button — hidden in print */}
      <div
        className="certificate-screen-ui fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background:   "rgba(8,15,30,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <a
          href="/course"
          className="text-xs"
          style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
        >
          ← Back to course
        </a>
        <div className="flex items-center gap-4">
          <PrintButton />
          <LogoutButton />
        </div>
      </div>

      {/* Certificate */}
      <div
        className="certificate-page min-h-screen flex items-center justify-center p-3 sm:p-8"
        style={{ background: "#0d1526" }}
      >
        <div
          className="certificate-body relative w-full max-w-[780px]"
          style={{
            background:   "#fff",
            aspectRatio:  "1.414 / 1",
            padding:      "clamp(40px, 8vw, 72px)",
            fontFamily:   "'Georgia', 'Times New Roman', serif",
            boxShadow:    "0 40px 120px rgba(0,0,0,0.6)",
          }}
        >
          {/* Gold corner decorations */}
          <Corner pos="top-left"     />
          <Corner pos="top-right"    />
          <Corner pos="bottom-left"  />
          <Corner pos="bottom-right" />

          {/* Double-rule border */}
          <div
            className="absolute inset-6"
            style={{ border: "1.5px solid #c9a227" }}
          />
          <div
            className="absolute"
            style={{ inset: "10px", border: "0.5px solid #c9a22740" }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center gap-5">

            {/* Seal / logo mark */}
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="#c9a227" strokeWidth="1.2" />
              <circle cx="26" cy="26" r="20" stroke="#c9a22760" strokeWidth="0.6" />
              <path d="M16 26l7 7 13-14" stroke="#c9a227" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Issuer */}
            <div>
              <p
                style={{
                  fontSize:      "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color:         "#c9a227",
                  marginBottom:  "2px",
                }}
              >
                Baxoptimized
              </p>
              <p
                style={{
                  fontSize:      "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "#888",
                }}
              >
                presents this certificate to
              </p>
            </div>

            {/* Recipient name */}
            <div>
              <p
                style={{
                  fontSize:      "clamp(28px, 5vw, 42px)",
                  fontWeight:    "normal",
                  color:         "#111",
                  lineHeight:    1.15,
                  letterSpacing: "-0.01em",
                  fontStyle:     "italic",
                }}
              >
                {cert.user_name}
              </p>
              <div style={{ height: "1.5px", background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginTop: "10px" }} />
            </div>

            {/* Course name */}
            <div>
              <p
                style={{
                  fontSize:      "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         "#999",
                  marginBottom:  "6px",
                }}
              >
                for successfully completing
              </p>
              <p
                style={{
                  fontSize:      "clamp(16px, 2.5vw, 22px)",
                  fontWeight:    "bold",
                  color:         "#1a1a1a",
                  letterSpacing: "0.02em",
                  fontFamily:    "'Georgia', serif",
                }}
              >
                The Baxoptimized Method
              </p>
              <p
                style={{
                  fontSize:      "12px",
                  color:         "#666",
                  marginTop:     "4px",
                  fontStyle:     "italic",
                }}
              >
                Web Design &amp; Development — Professional Practice
              </p>
            </div>

            {/* Brief */}
            <p
              style={{
                fontSize:   "10px",
                color:      "#aaa",
                letterSpacing: "0.05em",
              }}
            >
              Capstone project: {briefLabel}
            </p>

            {/* Date + signature line */}
            <div className="flex w-full items-end justify-between" style={{ marginTop: "auto", paddingTop: "16px" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ height: "1px", width: "140px", background: "#c9a22760", marginBottom: "6px" }} />
                <p style={{ fontSize: "10px", color: "#999", letterSpacing: "0.1em" }}>
                  Issued {issuedDate}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ height: "1px", width: "140px", background: "#c9a22760", marginBottom: "6px", marginLeft: "auto" }} />
                <p style={{ fontSize: "10px", color: "#999", letterSpacing: "0.1em" }}>
                  Baxter Hanley · Instructor
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Print + screen styles */}
      <style>{`
        @media print {
          .certificate-screen-ui { display: none !important; }
          .certificate-page {
            background: #fff !important;
            padding: 0 !important;
            min-height: 0 !important;
          }
          .certificate-body {
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            aspect-ratio: auto !important;
            page-break-inside: avoid;
          }
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
        }
      `}</style>
    </>
  );
}

function Corner({ pos }: { pos: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const isTop    = pos.startsWith("top");
  const isLeft   = pos.endsWith("left");
  const rotation = isTop
    ? (isLeft ? "0deg"   : "90deg")
    : (isLeft ? "270deg" : "180deg");
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      style={{
        position:  "absolute",
        top:       isTop   ? "16px" : undefined,
        bottom:    !isTop  ? "16px" : undefined,
        left:      isLeft  ? "16px" : undefined,
        right:     !isLeft ? "16px" : undefined,
        transform: `rotate(${rotation})`,
      }}
    >
      <path d="M2 26V6a4 4 0 0 1 4-4h20" stroke="#c9a227" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
