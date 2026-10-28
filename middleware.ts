import {NextRequest,NextResponse} from 'next/server';import {jwtVerify} from 'jose';
export async function middleware(req:NextRequest){
 const p=req.nextUrl.pathname;if(p==='/admin/login'||p==='/api/admin/login')return NextResponse.next();
 try{await jwtVerify(req.cookies.get('adm')?.value??'',new TextEncoder().encode(process.env.SESSION_SECRET!));return NextResponse.next()}
 catch{return p.startsWith('/api')?NextResponse.json({erro:'Não autorizado'},{status:401}):NextResponse.redirect(new URL('/admin/login',req.url))}}
export const config={matcher:['/admin/:path*','/api/admin/:path*']};
