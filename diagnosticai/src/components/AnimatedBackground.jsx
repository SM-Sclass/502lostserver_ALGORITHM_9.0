'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Generate random positions only on client-side
    setPositions([...Array(3)].map(() => ({
      left: 20 + Math.random() * 60,
      top: 20 + Math.random() * 60,
    })));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-white to-purple-200"></div>
      
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {positions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-lg"
            animate={{
              x: ['0%', '50%', '0%'],
              y: ['0%', '50%', '0%'],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              backgroundColor: ['#60A5FA', '#818CF8', '#C084FC'][i],
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/40"></div>
    </div>
  );
}
