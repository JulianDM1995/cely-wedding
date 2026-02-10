import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{
            height: '100dvh',
            width: '100dvw',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fffcf5', // Warm paper color
            position: 'relative',
            fontFamily: 'var(--font-cormorant)'
        }}>
            {/* Background Texture */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.4,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`
            }} />

            {/* 404 Content */}
            <div style={{
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div style={{ position: 'relative', marginBottom: '40px', height: '200px', width: '300px' }}>
                    {/* Left Cat (GatoL) Peeking */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '20px',
                        width: '120px',
                        height: '140px',
                        transform: 'rotate(-10deg)',
                        zIndex: 2
                    }}>
                        <Image
                            src="/designs/gatoL.png"
                            alt="Gato Curioso"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    {/* Right Cat (GatoR) Confused */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: '20px',
                        width: '120px',
                        height: '140px',
                        transform: 'rotate(10deg)',
                        zIndex: 1
                    }}>
                        <Image
                            src="/designs/gatoR.png"
                            alt="Gato Confundido"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    {/* 404 Text behind cats */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '8rem',
                        lineHeight: 1,
                        fontWeight: 'bold',
                        color: 'rgba(212, 175, 55, 0.2)', // Lite Gold
                        zIndex: 0,
                        fontFamily: 'var(--font-playfair)'
                    }}>
                        404
                    </div>
                </div>

                <h1 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '2.5rem',
                    color: '#1a1a1a',
                    marginBottom: '16px'
                }}>
                    Uy, aquí no hay boda...
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    marginBottom: '32px',
                    maxWidth: '400px',
                    fontStyle: 'italic'
                }}>
                    Parece que los gatos han estado jugando con los enlaces y esta página se ha perdido.
                </p>

                <Link
                    href="/"
                    style={{
                        padding: '12px 32px',
                        backgroundColor: '#d4af37', // Gold button
                        color: '#fff',
                        fontFamily: 'transparency', // Fallback
                        textDecoration: 'none',
                        borderRadius: '50px',
                        fontSize: '14px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    )
}
