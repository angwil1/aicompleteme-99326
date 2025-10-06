import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DigestRequest {
  userId: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId }: DigestRequest = await req.json();
    console.log('[generate-ai-digest-v2] Start for user:', userId);

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase env not configured');
    if (!lovableApiKey) throw new Error('LOVABLE_API_KEY is not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Beta: all features unlocked. No subscription check.
    console.log('[generate-ai-digest-v2] Beta period active - features unlocked');

    // Get user's profile data
    const { data: userProfile, error: userErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userErr) throw userErr;

    // Prepare matches (try real, fallback to mock)
    const mockMatches = [
      {
        matched_user_id: 'mock-1',
        compatibility_score: 0.85,
        ai_match_summary: 'Great compatibility based on shared interests in hiking and photography',
        matched_user_profiles: { name: 'Alex', age: 28, interests: ['hiking', 'photography'] }
      },
      {
        matched_user_id: 'mock-2',
        compatibility_score: 0.78,
        ai_match_summary: 'Strong potential connection through love of books and travel',
        matched_user_profiles: { name: 'Sam', age: 26, interests: ['reading', 'travel'] }
      },
      {
        matched_user_id: 'mock-3',
        compatibility_score: 0.82,
        ai_match_summary: 'Creative souls unite - shared passion for music and art',
        matched_user_profiles: { name: 'Jordan', age: 30, interests: ['music', 'art'] }
      }
    ];

    const { data: realMatches, error: matchesErr } = await supabase
      .from('premium_matches')
      .select(`*, matched_user_profiles:profiles!premium_matches_matched_user_id_fkey(*)`)
      .eq('user_id', userId)
      .order('match_timestamp', { ascending: false })
      .limit(5);

    if (matchesErr) console.warn('[generate-ai-digest-v2] premium_matches query error:', matchesErr.message);

    const recentMatches = realMatches && realMatches.length > 0 ? realMatches : mockMatches;

    // Check existing digest for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingDigest, error: digestCheckErr } = await supabase
      .from('compatibility_digests')
      .select('*')
      .eq('user_id', userId)
      .eq('digest_date', today)
      .maybeSingle();

    if (digestCheckErr) console.warn('[generate-ai-digest-v2] digest check warning:', digestCheckErr.message);

    // Build AI prompt
    const prompt = `
You are a dating app AI assistant creating a personalized daily digest. Generate insights based on this user's profile and recent matches.

User Profile:
${JSON.stringify(userProfile ?? {}, null, 2)}

Recent Matches:
${JSON.stringify(recentMatches, null, 2)}

Please generate:
1. A warm, personalized greeting
2. 3-5 insights about their recent matches
3. 2-3 AI-generated conversation starters for their best matches
4. A motivational closing message

Keep the tone friendly, encouraging, and insightful. Focus on meaningful connections rather than superficial aspects.

Return the response as a JSON object with this structure:
{
  "greeting": "Personalized greeting here",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "conversationStarters": [
    {"matchId": "match_id", "name": "match_name", "starter": "conversation starter"},
    {"matchId": "match_id", "name": "match_name", "starter": "conversation starter"}
  ],
  "motivation": "Motivational closing message"
}
`;

    // Call Lovable AI Gateway
    console.log('[generate-ai-digest-v2] Calling Lovable AI Gateway...');
    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI dating coach that creates personalized daily digest summaries. Always respond with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error('[generate-ai-digest-v2] AI Gateway error:', aiResp.status, txt);
      const status = aiResp.status === 429 || aiResp.status === 402 ? aiResp.status : 500;
      const msg = aiResp.status === 429
        ? 'Rate limit exceeded. Please try again shortly.'
        : aiResp.status === 402
          ? 'Payment required for AI usage. Please add credits to Lovable AI.'
          : `AI gateway error: ${aiResp.statusText}`;
      return new Response(JSON.stringify({ error: msg, details: txt }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiResp.json();

    let digestContent: any;
    try {
      digestContent = JSON.parse(aiJson.choices?.[0]?.message?.content ?? '{}');
    } catch (e) {
      console.error('[generate-ai-digest-v2] Failed to parse AI response as JSON:', aiJson.choices?.[0]?.message?.content);
      digestContent = {
        greeting: 'Welcome to your daily AI Complete Me digest!',
        insights: [
          'Your profile shows great authenticity and depth',
          "You're attracting quality matches based on shared interests",
          'Your communication style suggests strong emotional intelligence'
        ],
        conversationStarters: [
          { matchId: 'sample', name: 'Your Match', starter: 'I noticed we both love adventure - what\'s the most spontaneous trip you\'ve ever taken?' }
        ],
        motivation: 'Keep being your authentic self - the right connections are finding you!'
      };
    }

    // Prepare data for database
    const newCompatibleProfiles = (recentMatches ?? []).slice(0, 3).map((m: any) => ({
      id: m.matched_user_id,
      name: m.matched_user_profiles?.name || 'Anonymous',
      compatibility_score: m.compatibility_score,
      summary: m.ai_match_summary,
    }));

    const scoreDeltas = (recentMatches ?? []).map((m: any) => ({
      match_id: m.matched_user_id,
      score_change: '+new',
      previous_score: 0,
      current_score: m.compatibility_score,
    }));

    const conversationStarters = digestContent.conversationStarters || [];

    const digestData = {
      user_id: userId,
      digest_date: today,
      new_compatible_profiles: newCompatibleProfiles,
      profile_score_deltas: scoreDeltas,
      ai_conversation_starters: conversationStarters,
      digest_content: {
        greeting: digestContent.greeting,
        insights: digestContent.insights,
        motivation: digestContent.motivation,
      },
    };

    let digestResult: any = null;
    if (existingDigest) {
      const { data, error } = await supabase
        .from('compatibility_digests')
        .update(digestData)
        .eq('id', (existingDigest as any).id)
        .select()
        .maybeSingle();
      if (error) throw error;
      digestResult = data;
    } else {
      const { data, error } = await supabase
        .from('compatibility_digests')
        .insert(digestData)
        .select()
        .maybeSingle();
      if (error) throw error;
      digestResult = data;
    }

    console.log('[generate-ai-digest-v2] Success id:', digestResult?.id);

    return new Response(JSON.stringify({ success: true, digest: digestResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[generate-ai-digest-v2] Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to generate AI digest',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});