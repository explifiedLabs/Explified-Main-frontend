import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

const Lurphfe = () => {
  return (
    // Outer container: Black background, full screen height, flexbox for centering
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#000000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Framer Motion container: Fades in and slides up slightly */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        {/* Animated Lucide Icon: Floats up and down continuously */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Package size={56} color="#ffffff" strokeWidth={1.2} />
        </motion.div>

        {/* The Text */}
        <h1 style={{
          fontSize: '2rem',
          letterSpacing: '0.25em',
          fontWeight: '300',
          textTransform: 'uppercase',
          margin: 0,
          textAlign: 'center'
        }}>
          Products Coming Soon
        </h1>
        
      </motion.div>
    </div>
  );
};

export default Lurphfe;