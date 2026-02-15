import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: { name: string } | null;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, profiles:author_id(name)")
        .order("created_at", { ascending: false });
      if (data) setPosts(data as unknown as Post[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Latest Posts
        </h1>
        <p className="mt-2 text-muted-foreground">Thoughts, stories, and ideas.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Be the first to write something!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              authorName={post.profiles?.name || "Anonymous"}
              createdAt={post.created_at}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Index;
