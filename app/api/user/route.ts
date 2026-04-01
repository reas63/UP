import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: NextRequest) {
  const { id, username, bio, avatar_url } = await req.json();
  const updates: any = {};
  if (username) updates.username = username;
  if (bio) updates.bio = bio;
  if (avatar_url) updates.avatar_url = avatar_url;

  const { data, error } = await supabase.from("users").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}
