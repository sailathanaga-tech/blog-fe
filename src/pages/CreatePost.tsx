import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    const { error, data } = await supabase
      .from("posts")
      .insert({ title, content, author_id: user.id })
      .select()
      .single();
    if (error) {
      toast.error("Failed to create post");
    } else {
      toast.success("Post published!");
      navigate(`/post/${data.id}`);
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Write a new post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your post title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your story…" rows={12} required className="resize-none" />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Publishing…" : "Publish Post"}
        </Button>
      </form>
    </main>
  );
};

export default CreatePost;
