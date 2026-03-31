import { supabase } from "@/lib/supabase";

export async function signIn(email: string) {
  return await supabase.auth.signInWithOtp({ email });
}
