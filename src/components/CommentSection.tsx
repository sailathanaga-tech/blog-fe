import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Comment {
  id: string;
  text: string;
  user_id: string;
  created_at: string;
  profiles: { name: string } | null;
}

const CommentSection = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments(data as unknown as Comment[]);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      text: newComment.trim(),
      post_id: postId,
      user_id: user.id,
    });
    if (error) {
      toast.error("Failed to add comment");
    } else {
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) toast.error("Failed to delete comment");
    else fetchComments();
  };

  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Comments ({comments.length})
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <Textarea
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
            {loading ? "Posting…" : "Post Comment"}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{c.profiles?.name || "Anonymous"}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(c.created_at), "MMM d, yyyy")}
                </span>
                {user?.id === c.user_id && (
                  <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
