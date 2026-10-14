'use client';

import { useState, useEffect } from 'react';
import { X, User, Lock, Mail, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userSession, setUserSession] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('bk_user_session');
    if (session) setUserSession(JSON.parse(session));
  }, []);

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { name: name || email.split('@')[0], email };
    localStorage.setItem('bk_user_session', JSON.stringify(userData));
    setUserSession(userData);
    alert(isLogin ? '¡Sesión iniciada!' : '¡Cuenta creada con éxito!');
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('bk_user_session');
    setUserSession(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700 w-full max-w-md rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white cursor-pointer">
          <X className="w-6 h-6" />
        </button>

        {userSession ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              {userSession.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">¡Hola, {userSession.name}!</h3>
              <p className="text-sm text-cyan-500 mt-1">{userSession.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/50 text-red-400 hover:text-white font-bold py-4 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" className="w-full bg-[#0B1120] border border-slate-700 text-white rounded-xl px-4 py-3.5 outline-none focus:border-cyan-500" />
                </div>
              )}
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className="w-full bg-[#0B1120] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-cyan-500" />
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full bg-[#0B1120] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-cyan-500" />
              </div>

              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] mt-4">
                {isLogin ? 'Entrar' : 'Registrarse'}
              </button>
            </form>

            <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-6 text-sm text-slate-400 hover:text-cyan-400 font-bold">
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}