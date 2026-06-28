export default function NotFound() {
  return (
    <div
      style={{
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9EDEA',
        fontFamily: 'system-ui, sans-serif',
        gap: '0.75rem',
      }}
    >
      <p style={{ fontSize: 13, letterSpacing: '0.1em', color: '#C38C91', textTransform: 'uppercase', fontWeight: 600 }}>
        404
      </p>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2D1B1E', margin: 0 }}>Page not found</h1>
      <p style={{ fontSize: 13, color: '#9B7A7A', margin: 0 }}>
        <a href="/" style={{ color: '#2D1B1E', textDecoration: 'underline' }}>Go back home</a>
      </p>
    </div>
  );
}
