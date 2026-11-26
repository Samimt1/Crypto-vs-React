export type DemoUser = { name: string; email: string; country: string; joinedAt: string; };
const KEY = 'cryptox-demo-user-v1';
export function loadDemoUser():DemoUser|null {
 try { const raw=sessionStorage.getItem(KEY); if(!raw)return null; const u=JSON.parse(raw) as DemoUser;
  if(typeof u.name==='string'&&typeof u.email==='string'&&typeof u.country==='string'&&typeof u.joinedAt==='string')return u;
 }catch{} return null;
}
export function saveDemoUser(user:DemoUser|null):void {
 try{if(user)sessionStorage.setItem(KEY,JSON.stringify(user));else sessionStorage.removeItem(KEY);}catch{}
}
