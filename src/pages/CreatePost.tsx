import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiService } from "@/services/api";

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const data = await apiService.createPost({
        title,
        content,
        author: user?.user_metadata?.name || user?.email || "Anonymous",
      });
      toast.success("Post published!");
      navigate(`/post/${data.id}`);
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Write a new post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your post title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story…"
            rows={12}
            required
            className="resize-none"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Publishing…" : "Publish Post"}
        </Button>
      </form>
    </main>
  );
};

export default CreatePost;
