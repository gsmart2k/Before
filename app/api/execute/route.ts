export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import {execute,errorResponse} from '@/lib/providers';
export async function POST(request:Request){try{if(Number(request.headers.get('content-length')||0)>24000)return Response.json({error:'Request too large'},{status:413});const b=await request.json() as {signedTransaction:string;requestId:string};return Response.json(await execute(b.signedTransaction,b.requestId),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
