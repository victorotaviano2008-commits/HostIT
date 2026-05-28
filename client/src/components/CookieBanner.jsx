import React, { useState, useEffect } from 'react';

const getCookie = (name) => {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? v.pop() : null;
};

const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl shadow-lg max-w-3xl w-full mx-4 z-50">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política de cookies.
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setCookie('cookieConsent','declined'); setVisible(false); }} className="px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Recusar</button>
          <button onClick={() => { setCookie('cookieConsent','accepted'); setVisible(false); }} className="px-3 py-1 rounded bg-indigo-600 text-white">Aceitar</button>
        </div>
      </div>
    </div>
  );
}
