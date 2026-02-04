'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';

// ============================================================================
// STUNNING LANDING PAGE - $50M Startup Quality
// Inspired by: Stripe, Linear, Vercel
// Features: Scroll animations, gradients, particles, 3D, micro-interactions
// ============================================================================

// ----------------------------------------------------------------------------
// Particle System Component
// ----------------------------------------------------------------------------
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 200, // Blue to purple range
        });
      }
    };
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.opacity})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    resize();
    createParticles();
    animate();
    
    // BUG-001 fix: Store resize handler reference for cleanup
    const handleResize = () => {
      resize();
      createParticles();
    };
    
    // PERF-001 fix: Pause animation when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// ----------------------------------------------------------------------------
// Floating Orbs Background
// ----------------------------------------------------------------------------
const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - top right */}
      <motion.div
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      
      {/* Secondary orb - bottom left */}
      <motion.div
        animate={{
          x: [0, -50, -100, 0],
          y: [0, -100, -50, 0],
          scale: [1, 1.3, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(168,85,247,0.1) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Accent orb - center */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -80, 80, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
};

// ----------------------------------------------------------------------------
// Animated Gradient Text
// ----------------------------------------------------------------------------
const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-[length:200%_auto] animate-gradient ${className}`}
      style={{
        animation: 'gradient 8s linear infinite',
      }}
    >
      {children}
    </span>
  );
};

// ----------------------------------------------------------------------------
// Typing Animation Hook (BUG-003 fix: proper timeout cleanup)
// ----------------------------------------------------------------------------
const useTypingAnimation = (texts: string[], typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const currentText = texts[currentIndex];
    
    // Handle pause state separately
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Set pause state instead of nested setTimeout
          setIsPaused(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration]);
  
  return displayText;
};

// ----------------------------------------------------------------------------
// 3D Card Component
// ----------------------------------------------------------------------------
const Card3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotateX(-mouseY / 20);
    setRotateY(mouseX / 20);
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------------------------------
// Magnetic Button Component
// ----------------------------------------------------------------------------
const MagneticButton = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setPosition({
      x: (e.clientX - centerX) * 0.3,
      y: (e.clientY - centerY) * 0.3,
    });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// ----------------------------------------------------------------------------
// Animated Counter
// ----------------------------------------------------------------------------
const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// ----------------------------------------------------------------------------
// Testimonial Card with Typing Effect
// ----------------------------------------------------------------------------
const TestimonialCard = ({ testimonial, author, role, company, avatar, delay }: {
  testimonial: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowText(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);
  
  useEffect(() => {
    if (showText && displayedText.length < testimonial.length) {
      const timer = setTimeout(() => {
        setDisplayedText(testimonial.slice(0, displayedText.length + 1));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [showText, displayedText, testimonial]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
    >
      <Card3D className="h-full">
        <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group">
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: delay / 1000 + i * 0.1 }}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed mb-6 min-h-[120px]">
              "{testimonial}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                {avatar}
              </div>
              <div>
                <p className="text-white font-semibold">{author}</p>
                <p className="text-white/60 text-sm">{role} at {company}</p>
              </div>
            </div>
          </div>
        </div>
      </Card3D>
    </motion.div>
  );
};

// ----------------------------------------------------------------------------
// Feature Card
// ----------------------------------------------------------------------------
const FeatureCard = ({ icon, title, description, gradient, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Card3D className="h-full">
        <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-sm border border-white/10 group hover:border-white/20 transition-all duration-300">
          {/* Icon container */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
          >
            {icon}
          </motion.div>
          
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/60 leading-relaxed">{description}</p>
          
          {/* Hover arrow */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute bottom-8 right-8 text-white/40"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>
        </div>
      </Card3D>
    </motion.div>
  );
};

// ----------------------------------------------------------------------------
// Pricing Card
// ----------------------------------------------------------------------------
const PricingCard = ({ name, price, period, description, features, popular, delay, priceId }: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  delay: number;
  priceId?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`relative ${popular ? 'z-10' : ''}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-white text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <Card3D className="h-full">
        <div className={`relative h-full p-8 rounded-2xl backdrop-blur-xl border transition-all duration-300
          ${popular 
            ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/50 shadow-2xl shadow-violet-500/20' 
            : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
            <p className="text-white/60 text-sm">{description}</p>
          </div>
          
          <div className="mb-8">
            <span className="text-5xl font-bold text-white">{price}</span>
            <span className="text-white/60 ml-2">{period}</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: delay + 0.1 * i }}
                className="flex items-center gap-3 text-white/80"
              >
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </motion.li>
            ))}
          </ul>
          
          <a href={priceId ? `/api/checkout?price=${priceId}` : '#contact'} className="block w-full">
            <MagneticButton
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300
                ${popular
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {priceId ? 'Start Free Trial' : 'Contact Sales'}
            </MagneticButton>
          </a>
        </div>
      </Card3D>
    </motion.div>
  );
};

// ----------------------------------------------------------------------------
// Scroll Progress Indicator
// ----------------------------------------------------------------------------
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 origin-left z-50"
    />
  );
};

// ----------------------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------------------
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change or escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [mobileMenuOpen]);

  const navItems = ['Features', 'Pricing', 'Testimonials', 'About'];
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || mobileMenuOpen ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Clawdbot</span>
            </motion.div>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ y: -2 }}
                  className="text-white/70 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>
            
            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/70 hover:text-white transition-colors min-h-[44px] px-4"
              >
                Sign In
              </motion.button>
              <MagneticButton className="px-6 py-2.5 min-h-[44px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300">
                Start Free Trial
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg 
                className="w-6 h-6 text-white transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/90 backdrop-blur-xl md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="pt-24 px-6 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Nav Links */}
              <div className="space-y-1 mb-8">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-lg font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[48px] flex items-center"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="space-y-3">
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  href="#"
                  className="block w-full py-3 px-6 text-center text-white/80 hover:text-white border border-white/20 rounded-xl font-medium min-h-[48px] flex items-center justify-center"
                >
                  Sign In
                </motion.a>
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  href="/api/checkout?price=price_1SwtCbBfSldKMuDjDmRHqErh"
                  className="block w-full py-3 px-6 text-center text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-medium min-h-[48px] flex items-center justify-center"
                >
                  Start Free Trial
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ----------------------------------------------------------------------------
// Hero Section
// ----------------------------------------------------------------------------
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const typedText = useTypingAnimation([
    'remembers you.',
    'works 24/7.',
    'never forgets.',
    'gets smarter.',
  ], 80, 50, 2500);
  
  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white/80 text-sm">🚀 Deploy in 45 seconds</span>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
        >
          Your AI that
          <br />
          <GradientText>{typedText}</GradientText>
          <span className="inline-block w-1 h-10 sm:h-16 md:h-20 bg-violet-400 ml-1 sm:ml-2 animate-pulse" />
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0"
        >
          Clawdbot is the AI assistant that remembers everything. Unlike ChatGPT, 
          it knows your context, projects, and preferences across every session.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0"
        >
          <a href="/api/checkout?price=price_1SwtCbBfSldKMuDjDmRHqErh" className="w-full sm:w-auto">
            <MagneticButton className="group w-full sm:w-auto px-6 sm:px-8 py-4 min-h-[52px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 flex items-center justify-center gap-2">
              Start Free Trial
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </MagneticButton>
          </a>
          
          <a href="#pricing" className="w-full sm:w-auto">
            <MagneticButton className="w-full sm:w-auto px-6 sm:px-8 py-4 min-h-[52px] rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              See Pricing
            </MagneticButton>
          </a>
        </motion.div>
        
        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex -space-x-3">
            {['JD', 'AK', 'MR', 'SL', 'PK'].map((initials, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-xs font-bold"
              >
                {initials}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="w-10 h-10 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold"
            >
              +5k
            </motion.div>
          </div>
          <p className="text-white/60">
            <span className="text-white font-semibold">4.9/5</span> from over 2,000 reviews
          </p>
        </motion.div>
        
        {/* Hero Image/Product Preview - Hidden on mobile for performance, shown on tablets+ */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 sm:mt-20 relative hidden sm:block"
        >
          <div className="relative mx-auto max-w-5xl px-4">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-2xl blur-2xl opacity-30" />
            
            {/* Dashboard mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-1">
              <div className="rounded-xl bg-gray-900/90 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border-b border-white/10">
                  <div className="flex gap-1 sm:gap-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-2 sm:px-4 py-1 rounded-lg bg-white/10 text-white/60 text-xs sm:text-sm">
                      app.clawdbot.ai/chat
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {[
                      { label: 'Emails Processed', value: '1,247', change: '+18%' },
                      { label: 'Tasks Completed', value: '89', change: '+24%' },
                      { label: 'Time Saved', value: '12.5h', change: '+32%' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="p-2 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10"
                      >
                        <p className="text-white/60 text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{stat.label}</p>
                        <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-emerald-400 text-xs sm:text-sm">{stat.change}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Chart placeholder - fewer bars on tablet */}
                  <div className="h-32 sm:h-48 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-end justify-around p-2 sm:p-4">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].slice(0, typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 12).map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 1.3 + i * 0.05, duration: 0.5 }}
                        className="w-3 sm:w-6 rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-violet-500 to-fuchsia-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile-only: Simple illustration/badge instead of dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:hidden"
        >
          <div className="mx-auto w-48 h-48 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">🤖</div>
              <p className="text-white/60 text-sm">Your AI is ready</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Logos Section
// ----------------------------------------------------------------------------
const LogosSection = () => {
  const logos = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack', 'Discord', 'GitHub'];
  
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/40 mb-12"
        >
          Trusted by professionals at leading companies
        </motion.p>
        
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-16"
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-2xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-pointer"
              >
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Features Section
// ----------------------------------------------------------------------------
const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Perfect Memory',
      description: 'Remembers every conversation, preference, and project. Never repeat yourself to AI again.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '45-Second Setup',
      description: 'No VMs, no SSH, no config files. Click, pay, deploy. Your AI assistant is ready in under a minute.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Proactive Agent',
      description: 'Works 24/7 in the background. Monitors your email, calendar, and tasks automatically.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Multi-Channel',
      description: 'Chat via web, Telegram, Discord, or WhatsApp. Your AI assistant goes where you are.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      title: 'Powerful Integrations',
      description: 'Connect Gmail, Calendar, Slack, GitHub, and more. Your AI becomes part of your workflow.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Enterprise Security',
      description: 'Your data is encrypted at rest and in transit. Private, secure, and yours alone.',
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];
  
  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4 sm:mb-6">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            Everything you need to{' '}
            <GradientText>10x your productivity</GradientText>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto px-4">
            Powerful features designed to help your team move faster and build better products.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Stats Section
// ----------------------------------------------------------------------------
const StatsSection = () => {
  const stats = [
    { value: 45, prefix: '', suffix: 's', label: 'Setup Time' },
    { value: 99.9, prefix: '', suffix: '%', label: 'Uptime SLA' },
    { value: 10, prefix: '', suffix: 'x', label: 'Faster Than ChatGPT' },
    { value: 14, prefix: '', suffix: ' days', label: 'Free Trial' },
  ];
  
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          
          <div className="relative p-6 sm:p-12 md:p-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                    <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/60 text-sm sm:text-base">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Testimonials Section
// ----------------------------------------------------------------------------
const TestimonialsSection = () => {
  const testimonials = [
    {
      testimonial: "I was drowning in 200+ emails a day. Clawdbot now triages everything, drafts responses, and I only touch what matters. Saved me 2+ hours daily.",
      author: "Sarah Chen",
      role: "Founder",
      company: "TechFlow",
      avatar: "SC",
    },
    {
      testimonial: "Unlike ChatGPT, Clawdbot actually remembers our projects, our clients, our preferences. It's like having a chief of staff who never forgets.",
      author: "Marcus Rodriguez",
      role: "CEO",
      company: "ScaleUp",
      avatar: "MR",
    },
    {
      testimonial: "Set it up in literally 2 minutes. No servers, no config. It was scheduling meetings and summarizing docs within an hour. Mind-blowing.",
      author: "Emily Watson",
      role: "Head of Ops",
      company: "GrowthLabs",
      avatar: "EW",
    },
  ];
  
  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4 sm:mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            Loved by{' '}
            <GradientText>power users</GradientText>
            {' '}everywhere
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto px-4">
            Don't just take our word for it. Here's what leaders at top companies have to say.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} {...testimonial} delay={i * 200} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Pricing Section
// ----------------------------------------------------------------------------
const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals getting started',
      priceId: 'price_1SwtCbBfSldKMuDjM3p0kyG4',
      features: [
        '5,000 messages/month',
        '3 AI agents',
        'Chat + Memory + Web search',
        'Email support',
        'API access',
      ],
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      description: 'For power users who want it all',
      priceId: 'price_1SwtCbBfSldKMuDjDmRHqErh',
      features: [
        '20,000 messages/month',
        'Unlimited memory',
        'Gmail + Calendar integration',
        'Browser automation',
        'Priority support',
        'Advanced analytics',
        'Custom workflows',
      ],
      popular: true,
    },
    {
      name: 'Team',
      price: '$199',
      period: '/month',
      description: 'For teams that need unlimited power',
      priceId: 'price_1SwtCcBfSldKMuDjEKBqQ6lH',
      features: [
        '100,000 messages/month',
        'Unlimited agents',
        'All Pro features',
        '5 team seats',
        'Shared workspaces',
        'Dedicated support',
        'Custom integrations',
      ],
    },
  ];
  
  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4 sm:mb-6">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            Simple,{' '}
            <GradientText>transparent</GradientText>
            {' '}pricing
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto px-4">
            No hidden fees. No surprises. Start free, upgrade when you're ready.
          </p>
        </motion.div>
        
        {/* Mobile: Stack cards with popular in middle. Desktop: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {plans.map((plan, i) => (
            <PricingCard key={i} {...plan} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// CTA Section
// ----------------------------------------------------------------------------
const CTASection = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 animate-gradient-shift" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
          </div>
          
          {/* Floating shapes - hidden on mobile for performance */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-10 right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full border border-white/20 hidden sm:block"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-10 left-10 w-16 sm:w-24 h-16 sm:h-24 rounded-2xl border border-white/20 hidden sm:block"
          />
          
          <div className="relative p-6 sm:p-12 md:p-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            >
              Ready to transform
              <br />
              your workflow?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-10 px-2"
            >
              Stop repeating yourself to ChatGPT. Get an AI assistant that actually remembers.
              Start your free 14-day trial today.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <MagneticButton className="w-full sm:w-auto px-6 sm:px-8 py-4 min-h-[52px] rounded-full bg-white text-violet-600 font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center justify-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </MagneticButton>
              
              <MagneticButton className="w-full sm:w-auto px-6 sm:px-8 py-4 min-h-[52px] rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
                Talk to Sales
              </MagneticButton>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-6 text-white/60 text-xs sm:text-sm"
            >
              No credit card required · 14-day free trial · Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Footer
// ----------------------------------------------------------------------------
const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Documentation'],
    Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    Resources: ['Community', 'Help Center', 'Support', 'Status', 'API'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies', 'Compliance'],
  };
  
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Clawdbot</span>
            </div>
            <p className="text-white/60 mb-4 sm:mb-6 max-w-xs text-sm sm:text-base">
              Your AI assistant that remembers everything. Manages email, calendar, tasks, and more — across every session.
            </p>
            <div className="flex gap-3">
              {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map((social) => (
                <motion.a
                  key={social}
                  whileHover={{ y: -3 }}
                  href="#"
                  className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  {social[0]}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Links - Collapsible on mobile */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-white transition-colors text-sm sm:text-base py-1 inline-block min-h-[44px] flex items-center">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs sm:text-sm text-center sm:text-left">
            © 2026 Clawdbot, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#" className="text-white/40 hover:text-white/60 text-xs sm:text-sm transition-colors py-2 min-h-[44px] flex items-center">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-white/60 text-xs sm:text-sm transition-colors py-2 min-h-[44px] flex items-center">
              Terms of Service
            </a>
            <a href="#" className="text-white/40 hover:text-white/60 text-xs sm:text-sm transition-colors py-2 min-h-[44px] flex items-center">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ----------------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------------
export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background-position: 0% 50%;
            filter: hue-rotate(0deg);
          }
          50% { 
            background-position: 100% 50%;
            filter: hue-rotate(30deg);
          }
        }
        
        .animate-gradient {
          animation: gradient 8s linear infinite;
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 10s ease infinite;
          background-size: 200% 200%;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        ::selection {
          background: rgba(139, 92, 246, 0.4);
          color: white;
        }
      `}</style>
      
      {/* Background layers */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a2e_0%,_#000_100%)]" />
      <ParticleField />
      <FloatingOrbs />
      
      {/* Content */}
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
