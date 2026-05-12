import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-dark-blue/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 bg-primary-orange rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-orange/30 mb-6 group hover:rotate-12 transition-transform duration-500">
             <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-dark-blue tracking-tight">MABBITI</h1>
          <div className="h-1 w-12 bg-primary-orange mt-2 rounded-full" />
        </div>
        <Outlet />
      </motion.div>
    </div>
  );
}
