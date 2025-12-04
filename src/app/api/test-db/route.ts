import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to set and get a value
        const testKey = 'test-connection';
        const testValue = 'working';

        await kv.set(testKey, testValue);
        const retrieved = await kv.get(testKey);

        // Check if env vars are present (don't reveal values)
        const hasUrl = !!process.env.KV_REST_API_URL;
        const hasToken = !!process.env.KV_REST_API_TOKEN;

        return NextResponse.json({
            success: true,
            connection: retrieved === testValue ? 'OK' : 'Failed',
            env: {
                KV_REST_API_URL: hasUrl ? 'Set' : 'Missing',
                KV_REST_API_TOKEN: hasToken ? 'Set' : 'Missing'
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
            env: {
                KV_REST_API_URL: !!process.env.KV_REST_API_URL ? 'Set' : 'Missing',
                KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN ? 'Set' : 'Missing'
            }
        });
    }
}
