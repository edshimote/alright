import {NextResponse} from 'next/server';import * as XLSX from 'xlsx';import {db,adminId,decrypt,audit} from '@/lib/server';import {maskCpf} from '@/lib/cpf';
export async function GET(req:Request){const a=await adminId();if(!a)return NextResponse.json({erro:'Não autorizado'},{status:401});
 const fmt=new URL(req.url).searchParams.get('fmt')==='csv'?'csv':'xlsx';
 const {data}=await db.from('alunos').select('*').order('criado_em',{ascending:false});
 const rows=(data??[]).map(r=>({'Nome completo':r.nome_completo,CPF:maskCpf(decrypt(r.cpf_cifrado)),'Data de nascimento':r.data_nascimento,'Série':r.serie,Departamento:r.departamento,'Data do cadastro':new Date(r.criado_em).toLocaleString('pt-BR')}));
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),'Alunos');
 await audit(a,'exportou '+fmt);
 const buf=XLSX.write(wb,{type:'buffer',bookType:fmt});
 return new NextResponse(buf,{headers:{'Content-Type':fmt==='csv'?'text/csv; charset=utf-8':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':`attachment; filename="alunos.${fmt}"`}})}
