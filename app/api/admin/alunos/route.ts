import {NextResponse} from 'next/server';import {db,adminId,decrypt,cpfHash} from '@/lib/server';import {hideCpf,onlyDigits} from '@/lib/cpf';
export async function GET(req:Request){
 if(!await adminId())return NextResponse.json({erro:'Não autorizado'},{status:401});
 const u=new URL(req.url).searchParams,q=(u.get('q')??'').trim(),page=Math.max(1,+(u.get('page')??1)),size=15;
 let s=db.from('alunos').select('*',{count:'exact'});
 if(u.get('serie'))s=s.eq('serie',u.get('serie')!);if(u.get('dep'))s=s.eq('departamento',u.get('dep')!);
 if(q){const d=onlyDigits(q);if(d.length===11)s=s.eq('cpf_hash',cpfHash(d));else s=s.ilike('nome_completo','%'+q.replace(/[%,()]/g,'')+'%')}
 const col=u.get('ord')==='nome'?'nome_completo':'criado_em';
 const {data,count}=await s.order(col,{ascending:u.get('dir')==='asc'}).range((page-1)*size,page*size-1);
 const {data:all}=await db.from('alunos').select('departamento,criado_em');
 const hoje=new Date().toISOString().slice(0,10),por:Record<string,number>={};
 all?.forEach(a=>por[a.departamento]=(por[a.departamento]||0)+1);
 const top=Object.entries(por).sort((a,b)=>b[1]-a[1])[0]?.[0]??'—';
 return NextResponse.json({alunos:(data??[]).map(a=>({...a,cpf:hideCpf(decrypt(a.cpf_cifrado)),cpf_cifrado:undefined,cpf_hash:undefined})),total:count??0,size,
  stats:{total:all?.length??0,hoje:all?.filter(a=>a.criado_em.slice(0,10)===hoje).length??0,por,top}})}
