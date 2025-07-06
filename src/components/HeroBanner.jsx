export default function HeroBanner() {
  // Scroll to the shop section
  const handleShopNow = () => {
    const el = document.getElementById('shop-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      style={{
        width: '100%',
        height: '420px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '18px',
        marginTop: 32,
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(30,41,59,0.18)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/labubu_banner.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          color: '#fff',
          textShadow:
            '0 4px 24px rgba(0,0,0,0.45), 0 1.5px 6px rgba(0,0,0,0.32)',
        }}
      >
        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 1000,
            marginBottom: 10,
            color: '#fff',
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            textShadow:
              '0 4px 24px rgba(0,0,0,0.45), 0 1.5px 6px rgba(0,0,0,0.32)',
          }}
        >
          Shop your favorite
          <br />
          Labubu outfits!
        </h1>
        <p
          style={{
            fontSize: '1.45rem',
            fontWeight: 600,
            color: '#fff',
            maxWidth: 700,
            marginTop: 10,
            marginBottom: 12,
            textShadow:
              '0 4px 24px rgba(0,0,0,0.45), 0 1.5px 6px rgba(0,0,0,0.32)',
          }}
        >
          LabuStyles brings fashion right here
          <br />
          to make your Labubus stand out.
        </p>
        <button
          className="featured-card-btn hero-shop-btn"
          style={{
            opacity: 1,
            pointerEvents: 'auto',
            marginTop: 8,
            fontSize: '1.08rem',
            fontWeight: 700,
            padding: '14px 40px',
            boxShadow: '0 2px 8px rgba(79,140,255,0.10)',
            background: '#fff',
            color: '#111',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s',
            display: 'inline-block',
          }}
          onClick={handleShopNow}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#111';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#111';
          }}
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}
