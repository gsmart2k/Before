import {preview,errorResponse} from '@/lib/providers';
export async function GET(request:Request){try{const p=new URL(request.url).searchParams;return Response.json(await preview(p.get('mint')||'',Number(p.get('amount')),p.get('taker')||undefined),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
