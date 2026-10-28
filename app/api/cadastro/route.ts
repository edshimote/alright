import {NextResponse} from 'next/server';import {alunoSchema} from '@/lib/schema';import {db,encrypt,cpfHash,limited} from '@/lib/server';import {onlyDigits} from '@/lib/cpf';
export async function POST(req:Request){
 const ip=req.headers.get('x-forwarded-for')??'x';if(limited('cad:'+ip,20,60*60e3))return NextResponse.json({erro:'Muitas tentativas. Aguarde.'},{status:429});
 const p=alunoSchema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({erro:p.error.issues[0].message},{status:400});
 const d=p.data,cpf=onlyDigits(d.cpf);
 const {error}=await db.from('alunos').insert({nome_completo:d.nome_completo,cpf_cifrado:encrypt(cpf),cpf_hash:cpfHash(cpf),data_nascimento:d.data_nascimento,serie:d.serie,departamento:d.departamento});
 if(error)return NextResponse.json({erro:'Não foi possível salvar o cadastro.'},{status:500});return NextResponse.json({ok:true})}
