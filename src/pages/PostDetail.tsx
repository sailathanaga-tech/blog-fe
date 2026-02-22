import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import CommentSection from "@/components/CommentSection";
import { apiService, Post } from "@/services/api";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await apiService.getPost(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    if (!id) return;

    try {
      await apiService.deletePost(id);
      toast.success("Post deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Error deleting post:", error);
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
        <Link to="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </main>
    );
  }

  const isAuthor = user?.name === post.author || user?.email === post.author;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to posts
      </Link>

      <article>
        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
          <span>{post.author}</span>
          <span>·</span>
          <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
          {isAuthor && (
            <>
              <span>·</span>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                <Link to={`/edit/${post.id}`}>
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
              <button
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        <div className="prose prose-neutral max-w-none text-foreground/85 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <CommentSection postId={post.id.toString()} />
    </main>
  );
};

export default PostDetail;
