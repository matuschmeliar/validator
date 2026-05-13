import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownView({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {source}
    </ReactMarkdown>
  );
}
