'use client';

export function OceanBackground() {
  return (
    <>
      <div className="ocean-bg fixed inset-0 pointer-events-none">
        <div className="wave-1"></div>
        <div className="wave-2"></div>
        <div className="wave-3"></div>
      </div>
      <div className="lens-effect fixed inset-0 pointer-events-none"></div>

      <style jsx global>{`
        .ocean-bg {
          background: linear-gradient(180deg, #1a1a1a 0%, #0F172A 100%);
          overflow: hidden;
        }

        .wave-1,
        .wave-2,
        .wave-3 {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 200px;
          background: linear-gradient(transparent, rgba(255, 255, 255, 0.05));
          border-radius: 100%;
          animation: wave 8s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .wave-2 {
          animation-delay: -2s;
          opacity: 0.3;
        }

        .wave-3 {
          animation-delay: -4s;
          opacity: 0.2;
        }

        .lens-effect {
          background: radial-gradient(
            circle at center,
            transparent 30%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.2) translateY(-20px);
          }
        }
      `}</style>
    </>
  );
} 