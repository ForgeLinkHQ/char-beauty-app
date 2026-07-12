// Cron-triggered edge function: sweeps expired booking holds.
// Schedule via Supabase Dashboard → Database → Extensions → pg_cron:
//   SELECT cron.schedule('sweep-holds', '*/5 * * * *',
//     $$SELECT net.http_post(
//       url := 'https://vsqdjobrpdtfhzxfptny.supabase.co/functions/v1/sweep-expired-holds',
//       headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
//     )$$
//   );
//
// Or call public.cancel_expired_holds() directly via pg_cron:
//   SELECT cron.schedule('sweep-holds', '*/5 * * * *', 'SELECT public.cancel_expired_holds()');

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase.rpc("cancel_expired_holds");

    if (error) throw error;

    return new Response(
      JSON.stringify({ swept: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
