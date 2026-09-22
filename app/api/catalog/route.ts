export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import {catalog,errorResponse} from '@/lib/providers';
export async function GET(){try{const c=await catalog();return Response.json({stocks:c.stocks,fetchedAt:c.fetchedAt},{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
