"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { codeToHtml } from "shiki";
import { CopyIcon, CheckIcon } from "lucide-react";
import { IconButton } from "./icon-button";
import { toast } from "sonner";

interface CodeBlockProps extends React.ComponentProps<"div"> {
  code: string;
  language?: string;
}

export function CodeBlock({
  className,
  code,
  language = "json",
  ...props
}: CodeBlockProps) {
  const [parsedCode, setParsedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const realScrollXRef = useRef<HTMLDivElement | null>(null);
  const fakeScrollXRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);

  // Guarda a largura total do conteúdo para o fake scrollbar
  const [contentWidth, setContentWidth] = useState(0);

  // Highlight
  useEffect(() => {
    codeToHtml(code, {
      lang: language,
      theme: "poimandres",
    }).then(setParsedCode);
  }, [code, language]);

  // Atualiza largura do conteúdo sempre que parsedCode mudar
  useEffect(() => {
    const el = contentInnerRef.current;
    if (el) {
      setContentWidth(el.scrollWidth);
    }
  }, [parsedCode]);

  // Sincroniza real → fake
  useEffect(() => {
    const real = realScrollXRef.current;
    const fake = fakeScrollXRef.current;
    if (!real || !fake) return;

    const handleRealScroll = () => {
      fake.scrollLeft = real.scrollLeft;
    };

    real.addEventListener("scroll", handleRealScroll);
    return () => real.removeEventListener("scroll", handleRealScroll);
  }, [parsedCode]);

  // Sincroniza fake → real
  useEffect(() => {
    const real = realScrollXRef.current;
    const fake = fakeScrollXRef.current;
    if (!real || !fake) return;

    const handleFakeScroll = () => {
      real.scrollLeft = fake.scrollLeft;
    };

    fake.addEventListener("scroll", handleFakeScroll);
    return () => fake.removeEventListener("scroll", handleFakeScroll);
  }, [parsedCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Falha ao copiar");
    }
  };

  return (
    <div
      className={twMerge(
        "relative rounded-lg border border-zinc-700 bg-zinc-900",
        className
      )}
      {...props}
    >
      {/* botão copiar */}
      <div className="absolute top-2 right-2 z-20 mr-0.5">
        <IconButton
          icon={
            copied ? (
              <CheckIcon className="size-3.5 text-emerald-500" />
            ) : (
              <CopyIcon className="size-3.5 text-zinc-400 cursor-pointer" />
            )
          }
          className="bg-zinc-800/90 border border-zinc-700 p-1.5 rounded-lg opacity-70 hover:opacity-100"
          onClick={handleCopy}
        />
      </div>

      {/* Scroll vertical */}
      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar relative">
        {/* Scroll horizontal real (oculto o nativo) */}
        <div
          ref={realScrollXRef}
          className="overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            ref={contentInnerRef}
            className="min-w-max [&_pre]:p-4 [&_pre]:text-xs [&_pre]:leading-relaxed [&_pre]:font-mono"
            dangerouslySetInnerHTML={{ __html: parsedCode }}
          />
        </div>
      </div>

      {/* Scrollbar horizontal fake */}
      <div
        ref={fakeScrollXRef}
        className="absolute left-0 right-0 bottom-0 h-4 overflow-x-auto overflow-y-hidden custom-scrollbar"
      >
        <div style={{ width: contentWidth, height: 1 }} />
      </div>
    </div>
  );
}
