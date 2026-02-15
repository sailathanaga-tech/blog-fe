import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const PostCard = ({ id, title, content, authorName, createdAt }: PostCardProps) => {
  const excerpt = content.length > 160 ? content.slice(0, 160) + "…" : content;

  return (
    <Link to={`/post/${id}`}>
      <Card className="group transition-all hover:shadow-lg hover:-translate-y-0.5 border-border/60">
        <CardHeader className="pb-2">
          <h2
            className="text-xl font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {authorName} · {format(new Date(createdAt), "MMM d, yyyy")}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
