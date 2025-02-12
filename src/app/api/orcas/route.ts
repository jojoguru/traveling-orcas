import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { orcaSchema } from '@/lib/supabase/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if orca with this name already exists
    const { data: existingOrca } = await supabase
      .from('orcas')
      .select('*')
      .eq('name', name)
      .single();

    if (existingOrca) {
      return NextResponse.json(
        { error: 'An orca with this name already exists' },
        { status: 409 }
      );
    }

    // Create orca in Supabase
    const { data, error } = await supabase
      .from('orcas')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create orca' },
        { status: 500 }
      );
    }

    // Validate the response
    const validatedOrca = orcaSchema.parse(data);

    return NextResponse.json(validatedOrca);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orcas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orcas' },
        { status: 500 }
      );
    }

    // Validate the response
    const validatedOrcas = data.map((orca) => orcaSchema.parse(orca));

    return NextResponse.json(validatedOrcas);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 