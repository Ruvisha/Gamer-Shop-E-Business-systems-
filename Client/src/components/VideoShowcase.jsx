import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, ArrowRight, Wrench, ShieldCheck, Flame } from 'lucide-react';

export default function VideoShowcase({ onExploreClick, onBuilderClick }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Reliable high-resolution gaming/hardware trailer MP4 video URLs
  const primaryVideoSrc = "https://cdn.coverr.co/videos/coverr-playing-a-computer-game-4847/1080p.mp4";
  const fallbackVideoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  return (
    <section style={{
      padding: '3rem 0',
      backgroundColor: '#070911',
      position: 'relative',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div className="container">

        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#00f0ff',
              fontSize: '0.78rem',
              fontWeight: 800,
              fontFamily: 'var(--font-stats)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0.3rem'
            }}>
              <Sparkles size={14} color="#00f0ff" />

            </div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.2
            }}>

            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <span style={{
              backgroundColor: 'rgba(0, 255, 102, 0.1)',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              color: '#00ff66',
              borderRadius: '20px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-stats)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00ff66',
                boxShadow: '0 0 8px #00ff66'
              }} />

            </span>
          </div>
        </div>

        {/* Full Size Video Player Card */}
        <div
          className="cyber-card"
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#080a12',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 240, 255, 0.2)',
            height: '480px'
          }}
        >
          {/* HTML5 Full-Width Video Element */}
          <video
            ref={videoRef}
            src={primaryVideoSrc}
            poster="gaminpc.jpg"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onError={(e) => {
              // Switch to fallback URL if primary encounters network/CORS issue
              if (e.currentTarget.src !== fallbackVideoSrc) {
                e.currentTarget.src = fallbackVideoSrc;
                e.currentTarget.play().catch(() => { });
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Dark Ambient Gradient Mask over Video */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7, 9, 17, 0.4) 0%, transparent 40%, rgba(7, 9, 17, 0.85) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Top Left Floating Information Badge */}
          <div style={{
            position: 'absolute',
            top: '1.2rem',
            left: '1.2rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(7, 9, 17, 0.85)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              backdropFilter: 'blur(10px)',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Flame size={18} color="#ff0055" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  RTX 5090 OC 32GB • LIQUID RIG 2026
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8e9bb0' }}>
                  240Hz Ultra Ray-Tracing & DLSS 5 AI Benchmark
                </div>
              </div>
            </div>
          </div>

          {/* Center Play Button overlay when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 12,
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 240, 255, 0.2)',
                border: '2px solid #00f0ff',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s ease'
              }}
            >
              <Play size={36} color="#fff" style={{ marginLeft: '4px' }} />
            </div>
          )}

          {/* Bottom Cyber Video Control Bar & Progress Indicator */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(7, 9, 17, 0.88)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.8rem 1.4rem'
          }}>
            {/* Interactive Progress Bar */}
            <div
              onClick={handleSeek}
              style={{
                width: '100%',
                height: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '3px',
                marginBottom: '0.8rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00f0ff 0%, #7000ff 50%, #ff0055 100%)',
                boxShadow: '0 0 10px #00f0ff',
                transition: 'width 0.1s linear'
              }} />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Controls Group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  style={{
                    backgroundColor: '#121624',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    color: '#00f0ff',
                    borderRadius: '10px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#121624'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Mute/Unmute Button */}
                <button
                  onClick={toggleMute}
                  style={{
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: isMuted ? '#8e9bb0' : '#00ff66',
                    borderRadius: '10px',
                    padding: '0 12px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-stats)'
                  }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span>{isMuted ? 'UNMUTE AUDIO' : 'AUDIO ON'}</span>
                </button>
              </div>

              {/* Action Buttons & Fullscreen */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <button
                  onClick={onExploreClick}
                  className="btn-primary"
                  style={{
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.82rem'
                  }}
                >
                  <span>SHOP FEATURED HARDWARE</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={onBuilderClick}
                  className="btn-secondary"
                  style={{
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.82rem'
                  }}
                >
                  <Wrench size={15} color="#00f0ff" />
                  <span>BUILD THIS RIG</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  title="Toggle Fullscreen"
                  style={{
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    borderRadius: '10px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
