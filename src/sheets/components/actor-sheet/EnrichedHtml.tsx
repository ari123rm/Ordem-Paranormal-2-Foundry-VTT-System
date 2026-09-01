import React, { useEffect, useState } from "react";

export const EnrichedHtml = ({ content }: { content: string }) => {
  const [enriched, setEnriched] = useState("");

  useEffect(() => {
    // O TextEditor do Foundry transforma links, fórmulas e UUIDs em elementos interativos
    TextEditor.enrichHTML(content, { async: true }).then(setEnriched);
  }, [content]);

  // A classe "editor-content" injeta o CSS global do Foundry para textos
  return (
    <div 
      className="editor-content" 
      dangerouslySetInnerHTML={{ __html: enriched }} 
    />
  );
};