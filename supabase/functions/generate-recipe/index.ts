// Mesā — AI Recipe Generator (Supabase Edge Function, Deno runtime)
//
// Takes the ingredients a user has on hand and returns a structured recipe with
// macro estimates. The OpenAI key lives only as a function secret, never in the
// app bundle:
//   supabase secrets set OPENAI_API_KEY=sk-...
//   supabase functions deploy generate-recipe
//
// Call it from the client with supabase.functions.invoke('generate-recipe', {
//   body: { ingredients: ['chicken', 'rice', 'broccoli'], direction: 'high protein' }
// }).

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const MODEL = 'gpt-4o-mini';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface RecipeRequest {
  ingredients: string[];
  direction?: string;
  servings?: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return json({ error: 'OPENAI_API_KEY is not configured.' }, 500);
  }

  let body: RecipeRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const ingredients = (body.ingredients ?? []).filter(Boolean);
  if (ingredients.length === 0) {
    return json({ error: 'Provide at least one ingredient.' }, 400);
  }

  const servings = body.servings ?? 2;
  const direction = body.direction ?? 'anything';

  const prompt = [
    `You are Mesā's chef. Create one approachable recipe for ${servings} serving(s)`,
    `using mainly these ingredients: ${ingredients.join(', ')}.`,
    `Bias toward a "${direction}" style. Assume common pantry staples`,
    `(oil, salt, pepper, basic spices) are available. Keep steps tight and clear.`,
    `Return ONLY JSON matching this shape:`,
    `{"title": string, "minutes": number, "servings": number,`,
    ` "ingredients": string[], "steps": string[],`,
    ` "macros": {"calories": number, "protein": number, "carbs": number, "fat": number}}`,
    `Macros are per serving, integers.`,
  ].join(' ');

  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!aiRes.ok) {
    const detail = await aiRes.text();
    return json({ error: 'Recipe generation failed.', detail }, 502);
  }

  const completion = await aiRes.json();
  const content = completion.choices?.[0]?.message?.content ?? '{}';

  let recipe: unknown;
  try {
    recipe = JSON.parse(content);
  } catch {
    return json({ error: 'Model returned malformed JSON.' }, 502);
  }

  return json({ recipe }, 200);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
