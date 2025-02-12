import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { supabase } from '@/lib/supabase/client';
import { entrySchema } from '@/lib/supabase/types';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const orcaId = formData.get('orcaId') as string;
    const location = formData.get('location') as string;
    const message = formData.get('message') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;

    if (!photo || !name || !company || !orcaId || !location || !message || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload photo to Vercel Blob
    const blob = await put(photo.name, photo, {
      access: 'public',
    });

    // Create entry in Supabase
    const { data, error } = await supabase
      .from('entries')
      .insert([
        {
          name,
          company,
          'orca_id': orcaId,
          location,
          message,
          photo_url: blob.url,
          coordinates: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create entry' },
        { status: 500 }
      );
    }

    // Validate the response
    const validatedEntry = entrySchema.parse(data);

    return NextResponse.json(validatedEntry);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orcaId = searchParams.get('orca');

    let query = supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply orca filter if provided
    if (orcaId) {
      query = query.eq('orca_id', orcaId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      );
    }

    // Validate the response
    const validatedEntries = data.map((entry) => entrySchema.parse(entry));

    return NextResponse.json(validatedEntries);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 