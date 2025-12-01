import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        // 1. Check Environment Variables (Masked)
        const hasUrl = !!process.env.KV_REST_API_URL;
        const hasToken = !!process.env.KV_REST_API_TOKEN;

        // 2. Get Raw Hash Data
        const hashData = await kv.hgetall('crictrend:posts_hash');

        // 3. Get Raw List Data (Old)
        const listData = await kv.get('crictrend:posts');

        // 4. Test Write (Temporary Key)
        const testKey = 'debug:test-write-' + Date.now();
        await kv.set(testKey, 'ok');
        const testRead = await kv.get(testKey);
        await kv.del(testKey);

        return NextResponse.json({
            env: { hasUrl, hasToken },
            storage: {
                hashType: typeof hashData,
                hashSize: hashData ? Object.keys(hashData).length : 0,
                hashData: hashData,
                listType: typeof listData,
                listSize: Array.isArray(listData) ? listData.length : 0,
                listData: listData
            },
            writeTest: {
                success: testRead === 'ok',
                value: testRead
            }
        });
    } catch (error) {
        return NextResponse.json({
            error: String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
