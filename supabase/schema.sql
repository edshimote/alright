create extension if not exists pgcrypto;
create table alunos(
 id uuid primary key default gen_random_uuid(),
 nome_completo text not null,
 cpf_cifrado text not null,          -- AES-256-GCM (aplicação)
 cpf_hash text not null,             -- HMAC p/ busca exata
 data_nascimento date not null,
 serie text not null,
 departamento text not null check (departamento in ('Currículo','Como se comportar em entrevistas','Simulação de entrevista','Consultas de vagas ONLINE','Teste Vocacional')),
 criado_em timestamptz not null default now(),
 atualizado_em timestamptz not null default now());
create index on alunos(cpf_hash); create index on alunos(criado_em desc);
create table administradores(
 id uuid primary key default gen_random_uuid(),
 email text unique not null,
 senha_hash text not null,
 criado_em timestamptz not null default now());
create table logs_administrativos(
 id uuid primary key default gen_random_uuid(),
 administrador_id uuid references administradores(id) on delete set null,
 acao text not null, registro_afetado text,
 data_hora timestamptz not null default now());
-- RLS ligado SEM políticas: anon/authenticated não leem nada. Só o backend (service role).
alter table alunos enable row level security;
alter table administradores enable row level security;
alter table logs_administrativos enable row level security;
revoke all on alunos, administradores, logs_administrativos from anon, authenticated;
