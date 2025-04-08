// app/test-supabase/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function TestSupabasePage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data, error } = await supabase.from("clients").select("*");

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">🧪 Supabase Connection Test</h1>
      {error ? (
        <p className="text-red-500">❌ Error: {error.message}</p>
      ) : (
        <>
          <p className="text-green-600 mb-2">✅ Connection successful!</p>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
