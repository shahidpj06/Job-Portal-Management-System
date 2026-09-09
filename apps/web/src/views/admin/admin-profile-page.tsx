import { Mail, MapPin, Building2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common";
import { useMockSession } from "@/providers/mock-session-provider";
import { getInitials, formatDate } from "@/utils/formatters";

export function AdminProfilePage() {
  const { user } = useMockSession();

  if (!user) return null;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <PageHeader title="Admin Profile" description="Your account information" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{user.firstName} {user.lastName}</h2>
                {user.headline && <p className="text-sm text-muted-foreground">{user.headline}</p>}
                <Badge className="mt-1" variant="secondary">{user.role}</Badge>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Joined {formatDate(user.joinedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Admin Permissions</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {[
                "Post and manage job listings",
                "View and filter all applications",
                "Access analytics dashboard",
                "Manage candidate profiles",
              ].map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-tertiary shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
