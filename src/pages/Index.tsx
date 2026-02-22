import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService, Post } from "@/services/api";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Latest Posts
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thoughts, stories, and ideas.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">
          No posts yet. Be the first to write something!
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id.toString()}
              title={post.title}
              content={post.content}
              authorName={post.author}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Index;
