import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer, getSupabaseAdmin } from '@/lib/supabase/server';

interface ImportData {
  settings: {
    niche: string;
    goals: {
      pitchesPerWeek: number;
      deepWorkBlocksPerWeek: number;
      invoicesPerWeek: number;
    };
  };
  quests: Array<{
    id: string;
    date: string;
    category: string;
    title: string;
    mvwTitle: string;
    status: string;
    source: string;
    tags: string[];
    createdAt: string;
    completedAt: string | null;
  }>;
  dayStates: Array<{
    date: string;
    shield: boolean;
    recovery: boolean;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin client not available' }, { status: 500 });
    }

    const data: ImportData = await request.json();

    // Upsert user settings
    await admin.from('user_settings').upsert({
      user_id: user.id,
      niche: data.settings.niche,
      goals: data.settings.goals,
      updated_at: new Date().toISOString(),
    });

    // Import quests (avoid duplicates by id)
    if (data.quests && data.quests.length > 0) {
      const questsToInsert = data.quests.map((quest) => ({
        id: quest.id,
        user_id: user.id,
        date: quest.date,
        category: quest.category,
        title: quest.title,
        mvw_title: quest.mvwTitle,
        status: quest.status,
        source: quest.source,
        tags: quest.tags,
        created_at: quest.createdAt,
        completed_at: quest.completedAt,
      }));

      await admin.from('quests').upsert(questsToInsert, {
        onConflict: 'id',
      });
    }

    // Import day states
    if (data.dayStates && data.dayStates.length > 0) {
      const dayStatesToInsert = data.dayStates.map((ds) => ({
        user_id: user.id,
        date: ds.date,
        shield: ds.shield,
        recovery: ds.recovery,
      }));

      await admin.from('day_states').upsert(dayStatesToInsert, {
        onConflict: 'user_id,date',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
