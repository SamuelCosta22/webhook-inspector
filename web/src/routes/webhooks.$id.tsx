import { createFileRoute } from "@tanstack/react-router";
import { SectionDataTable } from "../components/section-data-table";
import { SectionTitle } from "../components/section-title";
import { CodeBlock } from "../components/ui/code-block";

export const Route = createFileRoute("/webhooks/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const overviewData = [
    { key: "Method", value: "POST" },
    { key: "Status Code", value: "200" },
    { key: "Contet-Type", value: "application/json" },
    { key: "Content-Length", value: "12323 bytes" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <SectionTitle>Request Overview</SectionTitle>
          <SectionDataTable data={overviewData} />
        </div>

        <div className="space-y-2">
          <SectionTitle>Query Parameters</SectionTitle>
          <SectionDataTable data={overviewData} />
        </div>

        <div className="space-y-2">
          <SectionTitle>Headers</SectionTitle>
          <SectionDataTable data={overviewData} />
        </div>

        <div className="space-y-2">
          <SectionTitle>Request Body</SectionTitle>
          <CodeBlock code={JSON.stringify(overviewData, null, 2)} />
        </div>
      </div>
    </div>
  );
}

