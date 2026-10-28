// Uso: node --env-file=.env.local scripts/create-admin.mjs email@x.com 'SenhaForte123!'
import {createClient} from '@supabase/supabase-js';import bcrypt from 'bcryptjs';
const [email,senha]=process.argv.slice(2);if(!email||!senha||senha.length<12){console.error('Informe e-mail e senha (mín. 12 caracteres)');process.exit(1)}
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const {error}=await db.from('administradores').insert({email:email.toLowerCase(),senha_hash:await bcrypt.hash(senha,12)});
console.log(error?error.message:'Administrador criado.');
