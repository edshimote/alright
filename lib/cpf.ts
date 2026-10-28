export const onlyDigits=(s:string)=>s.replace(/\D/g,'');
export function validCpf(v:string){const c=onlyDigits(v);if(c.length!==11||/^(\d)\1+$/.test(c))return false;
 for(const n of [9,10]){let s=0;for(let i=0;i<n;i++)s+=+c[i]*(n+1-i);const d=(s*10)%11%10;if(d!==+c[n])return false}return true}
export const maskCpf=(v:string)=>{const c=onlyDigits(v).slice(0,11);return c.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2')};
export const hideCpf=(v:string)=>{const c=onlyDigits(v);return `***.***.${c.slice(6,9)}-**`};
