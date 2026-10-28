import {NextResponse} from 'next/server';import {db,adminId,decrypt,encrypt,cpfHash,audit} from '@/lib/server';import {alunoSchema} from '@/lib/schema';import {onlyDigits,maskCpf} from '@/lib/cpf';
const no=()=>NextResponse.json({erro:'Não autorizado'},{status:401});
export async function GET(_:Request,{params}:{params:{id:string}}){const a=await adminId();if(!a)return no();
 const {data}=await db.from('alunos').select('*').eq('id',params.id).maybeSingle();if(!data)return NextResponse.json({erro:'Não encontrado'},{status:404});
 await audit(a,'visualizou ficha (CPF completo)',params.id);return NextResponse.json({...data,cpf:maskCpf(decrypt(data.cpf_cifrado)),cpf_cifrado:undefined,cpf_hash:undefined})}
export async function PATCH(req:Request,{params}:{params:{id:string}}){const a=await adminId();if(!a)return no();
 const p=alunoSchema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({erro:p.error.issues[0].message},{status:400});
 const d=p.data,c=onlyDigits(d.cpf);const {error}=await db.from('alunos').update({nome_completo:d.nome_completo,cpf_cifrado:encrypt(c),cpf_hash:cpfHash(c),data_nascimento:d.data_nascimento,serie:d.serie,departamento:d.departamento,atualizado_em:new Date().toISOString()}).eq('id',params.id);
 if(error)return NextResponse.json({erro:'Falha ao atualizar'},{status:500});await audit(a,'editou cadastro',params.id);return NextResponse.json({ok:true})}
export async function DELETE(_:Request,{params}:{params:{id:string}}){const a=await adminId();if(!a)return no();
 const {error}=await db.from('alunos').delete().eq('id',params.id);if(error)return NextResponse.json({erro:'Falha ao excluir'},{status:500});
 await audit(a,'excluiu cadastro',params.id);return NextResponse.json({ok:true})}
