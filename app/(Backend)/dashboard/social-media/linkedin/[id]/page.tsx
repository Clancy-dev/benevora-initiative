import { getLinkedinLink } from "@/actions/linkedin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Link as LinkIcon,
  Activity,
  Calendar,
  RefreshCw,
} from "lucide-react";

export default async function LinkedinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getLinkedinLink(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const link = result.data;

  return (
    <div className="w-full px-6 lg:px-10 py-8">
      {/* CONTENT WRAPPER */}
      <div className="w-full space-y-8 mx-auto lg:mx-0">

        {/* BACK + HEADER */}
        <div className="space-y-4">
          <Link
            href="/dashboard/social-media/linkedin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to LinkedIn Integration Manager
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mt-4">
              LinkedIn Link Details
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage LinkedIn profile configuration
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <Card className="shadow-sm border border-border/60 w-full">
          <CardHeader>
            <CardTitle className="text-lg">
              LinkedIn Information
            </CardTitle>
            <CardDescription>
              Detailed overview of this LinkedIn integration
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* INFO GRID */}
            <div className="grid gap-5">

              {/* URL */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <LinkIcon className="h-5 w-5 text-muted-foreground mt-1" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    LinkedIn URL
                  </p>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-blue-700 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Activity className="h-5 w-5 text-muted-foreground mt-1" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Status
                  </p>

                  <span
                    className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                      link.isActive
                        ? "bg-blue-100/80 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {link.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* CREATED */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(link.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* UPDATED */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <RefreshCw className="h-5 w-5 text-muted-foreground mt-1" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(link.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4 border-t">
              <Link
                href={`/dashboard/linkedin/edit?id=${link.id}`}
                className="flex-1"
              >
                <Button className="w-full cursor-pointer">
                  Edit Link
                </Button>
              </Link>

              <Link
                href="/dashboard/linkedin"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Back to List
                </Button>
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}