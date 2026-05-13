export default function Loading() {
  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div
        className="fa-chrome"
        style={{ padding: "28px 40px 48px", minHeight: "calc(100vh - 48px)" }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          {/* Back link */}
          <div className="fa-skel" style={{ width: 140, height: 14 }} />

          {/* Title block */}
          <div style={{ marginTop: 16 }}>
            <div className="fa-skel" style={{ width: 260, height: 12, marginBottom: 14 }} />
            <div className="fa-skel" style={{ width: "70%", height: 36, marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              {[60, 80, 70].map((w, i) => (
                <div key={i} className="fa-skel" style={{ width: w, height: 22, borderRadius: 999 }} />
              ))}
            </div>
          </div>

          {/* Body */}
          <section style={{ marginTop: 32 }}>
            <SkelLabel />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              <div className="fa-skel" style={{ height: 14, width: "92%" }} />
              <div className="fa-skel" style={{ height: 14, width: "88%" }} />
              <div className="fa-skel" style={{ height: 14, width: "94%" }} />
              <div className="fa-skel" style={{ height: 14, width: "76%" }} />
              <div className="fa-skel" style={{ height: 14, width: "84%" }} />
            </div>
          </section>

          {/* Amendments */}
          <section style={{ marginTop: 32 }}>
            <SkelLabel />
            <div className="fa-skel" style={{ width: 180, height: 32, marginTop: 12, borderRadius: 999 }} />
          </section>

          {/* Validation header */}
          <section style={{ marginTop: 36 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
                gap: 12,
              }}
            >
              <div>
                <SkelLabel />
                <div className="fa-skel" style={{ width: 200, height: 12, marginTop: 8 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="fa-skel" style={{ width: 96, height: 32, borderRadius: 999 }} />
                <div className="fa-skel" style={{ width: 110, height: 32, borderRadius: 999 }} />
                <div className="fa-skel" style={{ width: 64, height: 32, borderRadius: 999 }} />
              </div>
            </div>

            {/* Report card skeleton */}
            <div
              className="fa-card"
              style={{ marginBottom: 16 }}
            >
              <div className="fa-card-inner" style={{ padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div className="fa-skel" style={{ width: 110, height: 18, borderRadius: 999 }} />
                      <div className="fa-skel" style={{ width: 80, height: 18, borderRadius: 999 }} />
                    </div>
                    <div className="fa-skel" style={{ width: 280, height: 12 }} />
                  </div>
                  <div className="fa-skel" style={{ width: 96, height: 50 }} />
                </div>

                {/* Score rows */}
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 140px 80px",
                        gap: 12,
                        padding: "14px 14px",
                        borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}
                    >
                      <div className="fa-skel" style={{ height: 12, width: "60%" }} />
                      <div className="fa-skel" style={{ height: 12 }} />
                      <div className="fa-skel" style={{ height: 12 }} />
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="fa-skel" style={{ height: 12, width: "92%" }} />
                  <div className="fa-skel" style={{ height: 12, width: "85%" }} />
                  <div className="fa-skel" style={{ height: 12, width: "70%" }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SkelLabel() {
  return <div className="fa-skel" style={{ width: 90, height: 11 }} />;
}
