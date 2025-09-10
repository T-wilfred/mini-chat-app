import React from "react";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownProps extends Options {
  className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ className, ...props }) => {
  return (
    <div className={className}>
      <ReactMarkdown {...props} />
    </div>
  );
};

export default Markdown;
