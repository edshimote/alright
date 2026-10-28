import 'server-only';
import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {createCipheriv,createDecipheriv,createHmac,randomBytes} from 'crypto';
import {SignJWT,jwtVerify} from 'jose';import {cookies} from 'next/headers';
let _db:any;
export const db:SupabaseClient<any,'public',any>=new Proxy({} as any,{get(_,k){if(!_db){if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('Variáveis do Supabase ausentes (.env.local)');_db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}})}return _db[k]}});
const key=()=>Buffer.from(process.env.ENCRYPTION_KEY!,'hex');
export const encrypt=(t:string)=>{const iv=randomBytes(12);const c=createCipheriv('aes-256-gcm',key(),iv);const e=Buffer.concat([c.update(t,'utf8'),c.final()]);return [iv,c.getAuthTag(),e].map(b=>b.toString('base64')).join('.')};
export const decrypt=(s:string)=>{const [iv,tag,e]=s.split('.').map(x=>Buffer.from(x,'base64'));const d=createDecipheriv('aes-256-gcm',key(),iv);d.setAuthTag(tag);return Buffer.concat([d.update(e),d.final()]).toString('utf8')};
export const cpfHash=(cpf:string)=>createHmac('sha256',key()).update(cpf).digest('hex');
const secret=()=>new TextEncoder().encode(process.env.SESSION_SECRET!);
export const signSession=(id:string)=>new SignJWT({}).setSubject(id).setProtectedHeader({alg:'HS256'}).setExpirationTime('8h').sign(secret());
export async function adminId():Promise<string|null>{try{const t=cookies().get('adm')?.value;if(!t)return null;return (await jwtVerify(t,secret())).payload.sub??null}catch{return null}}
export const audit=(admin:string,acao:string,reg?:string)=>db.from('logs_administrativos').insert({administrador_id:admin,acao,registro_afetado:reg??null});
const tries=new Map<string,{n:number;t:number}>();
export function limited(k:string,max=5,win=15*60e3){const now=Date.now();const r=tries.get(k);if(!r||now-r.t>win){tries.set(k,{n:1,t:now});return false}r.n++;return r.n>max}
