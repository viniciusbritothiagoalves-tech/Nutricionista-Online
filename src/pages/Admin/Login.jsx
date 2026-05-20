import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config';
import { Lock } from 'lucide-react';

export const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === CONFIG.admin.usuario && pass === CONFIG.admin.senha) {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6 text-primary">
          <div className="bg-primary/10 p-4 rounded-full">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-serif text-center text-primary mb-6">Painel Administrativo</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 font-medium transition-colors">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
