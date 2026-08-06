import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "../utils/supabase";

export const Route = createFileRoute("/test-supabase")({
  loader: async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*");

    return { data, error };
  },
  component: TestSupabase,
});

function TestSupabase() {
  const { data, error } = Route.useLoaderData();

  if (error) {
    return (
      <div>
        <h2>Lỗi</h2>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div>
      <h2>Kết nối thành công 🎉</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}