export default function Loading() {
  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div
        className="fa-chrome fa-shell-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          height: "calc(100vh - 48px)",
        }}
      >
        {/* Sidebar skeleton */}
        <aside
          className="fa-desktop-only"
          style={{
            padding: "20px 16px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            background: "linear-gradient(180deg, rgba(12,12,14,0.85) 0%, rgba(6,6,8,0.85) 100%)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px" }}>
            <div className="fa-skel" style={{ width: 18, height: 18, borderRadius: "50%" }} />
            <div className="fa-skel" style={{ width: 110, height: 14 }} />
          </div>
          <div className="fa-skel" style={{ height: 38, marginTop: 14, borderRadius: 10 }} />
          <div className="fa-skel" style={{ height: 30, borderRadius: 8 }} />
          <div style={{ height: 12 }} />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
              }}
            >
              <div className="fa-skel" style={{ width: 30, height: 30, borderRadius: 8 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="fa-skel" style={{ width: "60%", height: 11 }} />
                <div className="fa-skel" style={{ width: "80%", height: 9 }} />
              </div>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main style={{ overflow: "hidden" }}>
          {/* Topbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "22px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="fa-skel" style={{ width: 220, height: 22 }} />
              <div className="fa-skel" style={{ width: 320, height: 12 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="fa-skel" style={{ width: 260, height: 32, borderRadius: 999 }} />
              <div className="fa-skel" style={{ width: 120, height: 32, borderRadius: 999 }} />
              <div className="fa-skel" style={{ width: 100, height: 32, borderRadius: 999 }} />
            </div>
          </div>

          {/* KPI strip */}
          <div
            className="fa-kpi-grid"
            style={{
              padding: "18px 24px 12px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="fa-card">
                <div
                  className="fa-card-inner"
                  style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div className="fa-skel" style={{ width: 120, height: 11 }} />
                  <div className="fa-skel" style={{ width: 90, height: 40 }} />
                  <div className="fa-skel" style={{ width: 140, height: 11 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Mid charts */}
          <div
            className="fa-mid-grid"
            style={{
              padding: "6px 24px 12px",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="fa-card">
                <div
                  className="fa-card-inner"
                  style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div className="fa-skel" style={{ width: 140, height: 11 }} />
                  <div className="fa-skel" style={{ height: 120, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Filter rail */}
          <div
            style={{
              padding: "10px 24px",
              display: "flex",
              gap: 8,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="fa-skel" style={{ width: 70, height: 22, borderRadius: 999 }} />
            <div className="fa-skel" style={{ width: 100, height: 22, borderRadius: 999 }} />
            <div className="fa-skel" style={{ width: 200, height: 22, borderRadius: 999 }} />
            <div style={{ marginLeft: "auto" }}>
              <div className="fa-skel" style={{ width: 200, height: 28, borderRadius: 999 }} />
            </div>
          </div>

          {/* Table rows */}
          <div style={{ padding: "16px 24px" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 140px 60px 60px 120px",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="fa-skel" style={{ height: 13, width: "60%" }} />
                  <div className="fa-skel" style={{ height: 10, width: "30%" }} />
                </div>
                <div className="fa-skel" style={{ height: 13 }} />
                <div className="fa-skel" style={{ height: 13 }} />
                <div className="fa-skel" style={{ height: 13 }} />
                <div className="fa-skel" style={{ height: 13 }} />
                <div className="fa-skel" style={{ height: 11 }} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
