import {z} from 'zod';import {validCpf} from './cpf';
export const DEPTS=['Currículo','Como se comportar em entrevistas','Simulação de entrevista','Consultas de vagas ONLINE','Teste Vocacional'] as const;
export const SERIES=['6º ano','7º ano','8º ano','9º ano','1º ano EM','2º ano EM','3º ano EM','Outra'] as const;
export const alunoSchema=z.object({
 nome_completo:z.string().trim().min(5,'Informe o nome completo').max(120),
 cpf:z.string().refine(validCpf,'CPF inválido'),
 data_nascimento:z.string().refine(d=>{const t=Date.parse(d);return !isNaN(t)&&t<=Date.now()&&t>=Date.parse('1930-01-01')},'Data de nascimento inválida'),
 serie:z.enum(SERIES,{errorMap:()=>({message:'Selecione a série'})}),
 departamento:z.enum(DEPTS,{errorMap:()=>({message:'Selecione um departamento'})}),
});
