import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiService } from "@/services/api";

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await apiService.getPost(id!);
        if (post.author !== user?.name && post.author !== user?.email) {
          toast.error("You can only edit your own posts");
          navigate("/");
          return;
        }
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        toast.error("Failed to fetch post");
        navigate("/");
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiService.updatePost(id!, {
        title,
        content,
        author: user?.name || user?.email || "Anonymous",
      });
      toast.success("Post updated!");
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error("Failed to update post");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Edit post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            className="resize-none"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </main>
  );
};

export default EditPost;
