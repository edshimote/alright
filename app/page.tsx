'use client';
import {useRef,useState} from 'react';import {useForm} from 'react-hook-form';import {zodResolver} from '@hookform/resolvers/zod';
import {alunoSchema,DEPTS,SERIES} from '@/lib/schema';import {maskCpf} from '@/lib/cpf';
type F={nome_completo:string;cpf:string;data_nascimento:string;serie:string;departamento:string};
const ICON:Record<string,string>={'Currículo':'📄','Como se comportar em entrevistas':'🤝','Simulação de entrevista':'🎤','Consultas de vagas ONLINE':'💻','Teste Vocacional':'🧭'};
export default function Home(){
 const [ok,setOk]=useState(false),[ciente,setCiente]=useState(false),[err,setErr]=useState(''),form=useRef<HTMLDivElement>(null);
 const {register,handleSubmit,setValue,watch,formState:{errors,isSubmitting}}=useForm<F>({resolver:zodResolver(alunoSchema) as any});
 const dep=watch('departamento');
 const E=({m}:{m?:string})=>m?<p className="mt-1.5 text-xs font-medium text-red-600">{m}</p>:null;
 const go=(d?:string)=>{if(d)setValue('departamento',d,{shouldValidate:true});form.current?.scrollIntoView({behavior:'smooth',block:'start'})};
 async function send(d:F){setErr('');const r=await fetch('/api/cadastro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
  if(r.ok)setOk(true);else setErr((await r.json()).erro||'Erro ao enviar. Tente novamente.')}
 return <main>
  <section className="hero hero-photo relative overflow-hidden text-white">
   <div className="blob -left-20 top-10 h-72 w-72 bg-amber-400"/><div className="blob -right-10 bottom-0 h-80 w-80 bg-sky-300"/>
   <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
    <div className="flex items-center gap-2 font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">🎓</span>Agendamento de Alunos</div>
    <a href="/admin/login" className="rounded-lg px-3 py-1.5 text-sm text-blue-100 transition hover:bg-white/10 hover:text-white">Login Administrativo</a></header>
   <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-32 pt-12 md:grid-cols-2 md:pt-20">
    <div className="fade"><span className="rounded-full bg-amber-400/90 px-3.5 py-1.5 text-xs font-bold text-amber-950">✨ Orientação profissional para estudantes</span>
     <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">Seu futuro começa <span className="grad-text">hoje</span></h1>
     <p className="mt-4 max-w-md text-lg text-blue-100">Currículo, entrevistas, vagas e teste vocacional. Escolha seu atendimento e faça o cadastro em 2 minutos, sem criar conta.</p>
     <div className="mt-8 flex flex-wrap gap-3"><button onClick={()=>go()} className="rounded-xl bg-amber-400 px-7 py-3.5 font-extrabold text-amber-950 shadow-xl shadow-amber-500/30 transition hover:-translate-y-0.5 hover:bg-amber-300">Realizar Agendamento →</button>
      <a href="#atendimentos" className="rounded-xl border border-white/30 px-6 py-3.5 font-semibold backdrop-blur transition hover:bg-white/10">Ver atendimentos</a></div></div>
    <div className="fade d2 hidden md:block"><div className="float relative mx-auto max-w-sm">
     <div className="ph aspect-[4/5] rounded-[2rem] shadow-2xl ring-4 ring-white/30" style={{backgroundImage:"url('/images/foto1.jpg'),linear-gradient(135deg,#60a5fa,#1d4ed8)"}}/>
     <div className="absolute -bottom-5 -left-8 flex items-center gap-3 rounded-2xl bg-white p-3.5 text-sm font-bold text-brand-900 shadow-xl"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-xl">🚀</span>Cadastro rápido<br/><span className="text-xs font-medium text-slate-500">em menos de 2 min</span></div>
     <div className="absolute -right-6 top-8 rounded-2xl bg-white p-3 text-2xl shadow-xl">🎯</div></div></div>
   </div>
   <div className="relative overflow-hidden border-t border-white/15 bg-black/10 py-3 text-sm font-semibold backdrop-blur"><div className="mq flex w-max gap-10 whitespace-nowrap">{[...DEPTS,...DEPTS,...DEPTS,...DEPTS].map((d,i)=><span key={i}>{ICON[d]} {d}</span>)}</div></div>
  </section>

  <section id="atendimentos" className="mx-auto max-w-6xl px-6 pb-4 pt-16 text-center">
   <h2 className="text-3xl font-extrabold text-brand-900">Escolha seu atendimento</h2><p className="mt-2 text-slate-500">Clique em um para já começar o cadastro.</p>
   <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{DEPTS.map((d,i)=><button key={d} onClick={()=>go(d)} className="card group p-5 text-center transition hover:-translate-y-1.5 hover:shadow-xl">
    <span className={`mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl text-2xl transition group-hover:scale-110 ${['bg-blue-100','bg-violet-100','bg-amber-100','bg-emerald-100','bg-rose-100'][i]}`}>{ICON[d]}</span><span className="text-sm font-bold text-brand-900">{d}</span></button>)}</div>
   <div className="mt-12 grid gap-4 md:grid-cols-3">{['/images/foto1.jpg','/images/foto2.jpg','/images/foto3.jpg'].map((f,i)=><div key={f} className="ph aspect-square overflow-hidden rounded-3xl shadow-lg ring-1 ring-slate-200 transition hover:scale-[1.02]" style={{backgroundImage:`url('${f}'),linear-gradient(135deg,${['#93c5fd,#2563eb','#fcd34d,#f97316','#a5b4fc,#7c3aed'][i]})`}}/>)}</div>
   <div className="mt-12 grid gap-4 md:grid-cols-3">{[['1','Preencha seus dados','Nome, CPF, nascimento e série.'],['2','Escolha o departamento','Um atendimento por cadastro.'],['3','Pronto!','Seu cadastro vai direto para a equipe.']].map(([n,t,x])=><div key={n} className="card p-6 text-left"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-sky-400 font-extrabold text-white">{n}</span><h3 className="mt-3 font-bold text-brand-900">{t}</h3><p className="text-sm text-slate-500">{x}</p></div>)}</div>
  </section>

  <section ref={form} className="relative mx-auto max-w-2xl scroll-mt-6 px-4 pb-20 pt-12">
   <div className="card fade d1 p-6 shadow-xl shadow-blue-900/5 md:p-9">
    {ok?<div className="py-8 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✓</div>
      <h2 className="text-xl font-extrabold text-brand-900">Cadastro realizado com sucesso!</h2>
      <p className="mt-2 text-slate-600">Suas informações foram registradas e encaminhadas para o departamento selecionado.</p></div>:
    <form onSubmit={handleSubmit(send)} className="space-y-6" noValidate>
     <div><h2 className="text-xl font-extrabold text-brand-900">Faça seu cadastro</h2><p className="text-sm text-slate-500">Todos os campos são obrigatórios.</p></div>
     <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2"><label>Nome completo</label><input className="inp" placeholder="Seu nome completo" {...register('nome_completo')}/><E m={errors.nome_completo?.message}/></div>
      <div><label>CPF</label><input className="inp" inputMode="numeric" placeholder="000.000.000-00" {...register('cpf',{onChange:e=>setValue('cpf',maskCpf(e.target.value))})}/><E m={errors.cpf?.message}/></div>
      <div><label>Data de nascimento</label><input type="date" className="inp" {...register('data_nascimento')}/><E m={errors.data_nascimento?.message}/></div>
      <div className="md:col-span-2"><label>Série escolar</label><select className="inp" defaultValue="" {...register('serie')}><option value="" disabled>Selecione…</option>{SERIES.map(s=><option key={s}>{s}</option>)}</select><E m={errors.serie?.message}/></div></div>
     <div><label>Departamento para agendamento</label>
      <div className="grid gap-2.5 sm:grid-cols-2">{DEPTS.map((d,i)=><label key={d} className={`mb-0 flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 text-sm font-semibold transition ${dep===d?'border-brand-600 bg-brand-50 text-brand-700 shadow-sm':'border-slate-200 hover:border-blue-300'} ${i===4?'sm:col-span-2':''}`}>
       <input type="radio" value={d} className="sr-only" {...register('departamento')}/><span className="text-xl">{ICON[d]}</span>{d}</label>)}</div>
      <E m={errors.departamento?.message}/></div>
     <label className="mb-0 flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm font-normal text-slate-600"><input type="checkbox" className="mt-0.5 h-4 w-4 accent-blue-700" checked={ciente} onChange={e=>setCiente(e.target.checked)}/>
      <span>Estou ciente de que meus dados serão usados apenas para este atendimento, conforme a <a className="font-semibold text-brand-600 underline" href="/privacidade" target="_blank">Política de Privacidade</a> (LGPD).</span></label>
     {err&&<p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
     <button className="btn w-full" disabled={!ciente||isSubmitting}>{isSubmitting?'Enviando…':'Enviar cadastro'}</button>
    </form>}</div></section>
  <footer className="pb-8 text-center text-xs text-slate-400">🔒 Seus dados são protegidos e criptografados · <a href="/privacidade" className="underline">Privacidade</a></footer>
 </main>}
