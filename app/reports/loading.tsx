export default function Loading() {
  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div
        className="fa-chrome fa-page-pad"
        style={{ padding: "32px 40px 40px", minHeight: "calc(100vh - 48px)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="fa-skel" style={{ width: 140, height: 14 }} />
          <div className="fa-skel" style={{ width: 200, height: 28, marginTop: 14 }} />
          <div className="fa-skel" style={{ width: 360, height: 12, marginTop: 8 }} />
          <div className="fa-card" style={{ marginTop: 28 }}>
            <div className="fa-card-inner" style={{ padding: 0 }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 120px 120px 120px",
                    gap: 16,
                    padding: "14px 16px",
                    borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    alignItems: "center",
                  }}
                >
                  <div className="fa-skel" style={{ height: 12 }} />
                  <div className="fa-skel" style={{ height: 14, width: "55%" }} />
                  <div className="fa-skel" style={{ height: 12 }} />
                  <div className="fa-skel" style={{ height: 14 }} />
                  <div className="fa-skel" style={{ height: 11 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
