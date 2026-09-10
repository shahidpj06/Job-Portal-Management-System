import { Link } from 'react-router-dom';
import { Briefcase, FileText, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATHS } from '@/utils/paths';
import { getInitials, formatDate } from '@/utils/formatters';
import { mockCandidate } from '@/mocks';
import { useAuthSession } from '@/services/auth';

export const ProfilePage = () => {
  const { user } = useAuthSession();

  if (!user) {
    return null;
  }

  const profile = mockCandidate;

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Profile sidebar */}
        <div className='space-y-4'>
          <Card>
            <CardContent className='p-6 text-center'>
              <Avatar className='mx-auto mb-4 h-20 w-20'>
                <AvatarFallback className='bg-primary text-primary-foreground text-2xl'>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <h2 className='text-lg font-bold'>
                {user.firstName} {user.lastName}
              </h2>
              {profile.headline && (
                <p className='mt-1 text-sm text-muted-foreground'>{profile.headline}</p>
              )}
              <div className='mt-3 space-y-1.5 text-sm text-muted-foreground text-left'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 shrink-0' />
                  <span className='truncate'>{user.email}</span>
                </div>
                {profile.location && (
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 shrink-0' />
                    {profile.location}
                  </div>
                )}
                {profile.phone && (
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 shrink-0' />
                    {profile.phone}
                  </div>
                )}
              </div>
              <Button className='mt-4 w-full' size='sm' variant='outline' asChild>
                <Link to={PATHS.PROFILE_RESUME}>
                  <Edit className='mr-1.5 h-4 w-4' />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-5'>
              <h3 className='mb-3 font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                Skills
              </h3>
              <div className='flex flex-wrap gap-2'>
                {(profile.skills ?? []).map((s) => (
                  <Badge key={s} variant='secondary'>
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {profile.resumeUrl && (
            <Card>
              <CardContent className='p-5'>
                <a
                  href={profile.resumeUrl}
                  className='flex items-center gap-2 text-sm font-medium text-primary hover:underline'
                >
                  <FileText className='h-4 w-4' />
                  View Resume
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main content */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='about'>
            <TabsList className='mb-4'>
              <TabsTrigger value='about'>About</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>

            <TabsContent value='about'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Briefcase className='h-4 w-4' />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.bio ? (
                    <p className='text-sm leading-relaxed text-muted-foreground'>{profile.bio}</p>
                  ) : (
                    <p className='text-sm text-muted-foreground italic'>No bio added yet.</p>
                  )}
                  <div className='mt-4 pt-4 border-t border-border text-sm text-muted-foreground'>
                    Member since {formatDate(profile.joinedAt)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='settings'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 text-sm text-muted-foreground'>
                  <p>
                    Email notifications, password changes, and account management options will
                    appear here.
                  </p>
                  <Button variant='outline' size='sm' asChild>
                    <Link to={PATHS.PROFILE_SECURITY}>Security Settings</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
