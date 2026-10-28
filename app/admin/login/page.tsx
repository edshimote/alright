'use client';import {useState} from 'react';
export default function Login(){const [e,setE]=useState(''),[l,setL]=useState(false);
 async function go(f:React.FormEvent<HTMLFormElement>){f.preventDefault();setL(true);const d=new FormData(f.currentTarget);
  const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:d.get('email'),senha:d.get('senha')})});
  if(r.ok)location.href='/admin';else{setE((await r.json()).erro);setL(false)}}
 return <main className="hero grid min-h-screen place-items-center p-4"><form onSubmit={go} className="fade w-full max-w-sm space-y-5 rounded-3xl bg-white p-8 shadow-2xl">
  <div className="text-center"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">🔐</div><h1 className="text-xl font-extrabold text-brand-900">Área administrativa</h1><p className="text-sm text-slate-500">Acesso restrito a administradores</p></div>
  <div><label>Usuário ou e-mail</label><input name="email" type="text" required autoComplete="username" className="inp" placeholder="seu usuário"/></div>
  <div><label>Senha</label><input name="senha" type="password" required className="inp" placeholder="••••••••••••"/></div>
  {e&&<p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{e}</p>}<button className="btn w-full" disabled={l}>{l?'Entrando…':'Entrar'}</button>
  <a href="/" className="block text-center text-xs text-slate-400 hover:text-brand-600">← Voltar ao site</a></form></main>}
