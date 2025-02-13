import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orcaId = searchParams.get('orca');

    if (!orcaId) {
      return NextResponse.json(
        { error: 'Orca ID is required' },
        { status: 400 }
      );
    }

    // Get count of entries for the specified orca
    const { count, error } = await supabase
      .from('entries')
      .select('*', { count: 'exact', head: true })
      .eq('orca_id', orcaId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch entry count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 