import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import CommentSection from "@/components/CommentSection";

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  profiles: { name: string } | null;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, profiles:author_id(name)")
        .eq("id", id!)
        .single();
      if (data) setPost(data as unknown as Post);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id!);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Post not found</h1>
        <Link to="/" className="text-primary hover:underline">Go back home</Link>
      </main>
    );
  }

  const isAuthor = user?.id === post.author_id;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to posts
      </Link>

      <article>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
          <span>{post.profiles?.name || "Anonymous"}</span>
          <span>·</span>
          <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
          {isAuthor && (
            <>
              <span>·</span>
              <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                <Link to={`/edit/${post.id}`}>
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
              <button onClick={handleDelete} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        <div className="prose prose-neutral max-w-none text-foreground/85 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <CommentSection postId={post.id} />
    </main>
  );
};

export default PostDetail;
