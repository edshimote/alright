import {NextResponse} from 'next/server';import bcrypt from 'bcryptjs';import {db,signSession,limited,audit} from '@/lib/server';
export async function POST(req:Request){
 const {email,senha}=await req.json().catch(()=>({}));const k=(req.headers.get('x-forwarded-for')??'x')+String(email);
 if(limited(k))return NextResponse.json({erro:'Muitas tentativas. Tente em 15 minutos.'},{status:429});
 const {data:a}=await db.from('administradores').select('id,senha_hash').eq('email',String(email).toLowerCase()).maybeSingle();
 const ok=await bcrypt.compare(String(senha??''),a?.senha_hash??'$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali');
 if(!a||!ok)return NextResponse.json({erro:'E-mail ou senha inválidos'},{status:401});
 await audit(a.id,'login');const r=NextResponse.json({ok:true});
 r.cookies.set('adm',await signSession(a.id),{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:28800});return r}
