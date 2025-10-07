import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMessageLimits } from '@/hooks/useMessageLimits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Heart, Crown, MessageCircle, Eye, EyeOff, Mail, RefreshCw, MapPin, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useEmailJourneys } from '@/hooks/useEmailJourneys';
import { useToast } from '@/hooks/use-toast';
import { InviteKindredSoul } from '@/components/InviteKindredSoul';
import { Navbar } from '@/components/Navbar';

interface MatchPreview {
  id: string;
  name: string;
  age: number;
  compatibility: number;
  commonInterests: string[];
  blurredPhoto?: string;
  location?: string;
  occupation?: string;
  bio?: string;
}

const QuizResults = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const { trackQuizCompletion } = useEmailJourneys();
  const { toast } = useToast();
  const { remainingMessages, canSendMessage, upgradePrompt } = useMessageLimits();
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user && !profileLoading) {
      loadMatchPreviews();
    }
    
    // Show success toast when results are ready
    toast({
      title: "✨ Your results are ready!",
      description: "Discover your personalized compatibility matches below",
      duration: 4000,
    });
  }, [user, profileLoading, toast]);


  const loadMatchPreviews = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get current user's profile with location
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('interests, personality_type, age, location, zip_code')
        .eq('id', user.id)
        .single();

      // Get other profiles to match with
      const { data: allProfiles, error } = await supabase
        .from('profiles')
        .select('id, name, age, personality_type, interests, photos, location, occupation, bio, zip_code')
        .neq('id', user.id)
        .not('personality_type', 'is', null)
        .not('name', 'is', null)
        .limit(20);
      
      // Filter out profiles that look fake or are placeholder profiles
      const excludedNames = ['jordan', 'marcus', 'jake', 'jackson'];
      const excludedPhotos = ['profile-silhouette', 'placeholder', 'default'];
      
      let filteredProfiles = (allProfiles || []).filter(profile => {
        const name = profile.name?.toLowerCase() || '';
        const hasExcludedName = excludedNames.some(excluded => name.includes(excluded));
        
        // Check if photos contain placeholder images
        const hasPlaceholderPhoto = profile.photos?.some((photo: string) => 
          excludedPhotos.some(excluded => photo.toLowerCase().includes(excluded))
        );
        
        return !hasExcludedName && !hasPlaceholderPhoto;
      });

      // Filter by location if user has a location/zip code set
      if (currentProfile?.location || currentProfile?.zip_code) {
        const userLocation = currentProfile.location?.toLowerCase() || '';
        const userState = userLocation.split(',').pop()?.trim() || '';
        
        filteredProfiles = filteredProfiles.filter(profile => {
          const profileLocation = profile.location?.toLowerCase() || '';
          const profileState = profileLocation.split(',').pop()?.trim() || '';
          
          // Match by state if available
          if (userState && profileState) {
            return userState === profileState;
          }
          
          return true; // Keep profile if we can't determine state
        });
      }

      const profiles = filteredProfiles;

      if (error) {
        console.error('Error loading profiles:', error);
        throw error;
      }

      if (!profiles || profiles.length === 0) {
        // Show Alex as placeholder with the specific encouraging message
        const placeholderPreviews: MatchPreview[] = [
          {
            id: 'sample-alex',
            name: 'Alex',
            age: 28,
            compatibility: 87,
            commonInterests: ['Photography', 'Hiking'],
            blurredPhoto: '/src/assets/alex-profile-realistic.jpg',
            location: currentProfile?.location || 'Hartford, CT',
            occupation: 'Photographer',
            bio: 'Adventure seeker who loves capturing moments through photography and exploring new trails.'
          }
        ];
        setMatchPreviews(placeholderPreviews);
        setLoading(false);
        return;
      }

      // Calculate compatibility scores based on interests and personality
      const matchedProfiles = profiles
        .map(profile => {
          let compatibilityScore = 50; // base score
          
          // Add points for shared interests
          if (currentProfile?.interests && profile.interests) {
            const userInterests = currentProfile.interests || [];
            const profileInterests = profile.interests || [];
            const sharedInterests = userInterests.filter(interest => 
              profileInterests.includes(interest)
            );
            compatibilityScore += Math.min(sharedInterests.length * 10, 30);
          }
          
          // Add points for similar personality type
          if (currentProfile?.personality_type && profile.personality_type) {
            if (currentProfile.personality_type === profile.personality_type) {
              compatibilityScore += 15;
            }
          }
          
          // Add points for similar age
          if (currentProfile?.age && profile.age) {
            const ageDiff = Math.abs(currentProfile.age - profile.age);
            if (ageDiff <= 2) compatibilityScore += 10;
            else if (ageDiff <= 5) compatibilityScore += 5;
          }
          
          // Ensure score is within range
          compatibilityScore = Math.min(Math.max(compatibilityScore, 60), 98);
          
          // Get common interests for display
          const userInterests = currentProfile?.interests || [];
          const profileInterests = profile.interests || [];
          const commonInterests = userInterests.filter(interest => 
            profileInterests.includes(interest)
          ).slice(0, 3);
          
          // If no common interests, show some of their interests
          const displayInterests = commonInterests.length > 0 
            ? commonInterests 
            : (profileInterests || []).slice(0, 2);
          
          return {
            id: profile.id,
            name: profile.name || 'Anonymous',
            age: profile.age || 25,
            compatibility: compatibilityScore,
            commonInterests: displayInterests,
            blurredPhoto: profile.photos?.[0] || undefined,
            location: profile.location || undefined,
            occupation: profile.occupation || undefined,
            bio: profile.bio || undefined
          };
        })
        .sort((a, b) => b.compatibility - a.compatibility) // Sort by compatibility
        .slice(0, 3); // Take top 3

      setMatchPreviews(matchedProfiles);
    } catch (error) {
      console.error('Error loading match previews:', error);
      // Fallback to Alex
      const placeholderPreviews: MatchPreview[] = [
        {
          id: 'sample-alex',
          name: 'Alex',
          age: 28,
          compatibility: 87,
          commonInterests: ['Photography', 'Hiking'],
          blurredPhoto: '/src/assets/alex-profile-realistic.jpg',
          location: 'Hartford, CT',
          occupation: 'Photographer',
          bio: 'Adventure seeker who loves capturing moments through photography and exploring new trails.'
        }
      ];
      setMatchPreviews(placeholderPreviews);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatches = () => {
    navigate('/search');
  };

  const handleUpgradeToPremium = () => {
    navigate('/pricing');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleMatchClick = async (match: MatchPreview, index: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Navigate to view the match's profile
    navigate(`/sample-user-profile/${match.id}`, { 
      state: { 
        profileData: match,
        fromQuizResults: true 
      } 
    });
  };

  const handleResendEmail = async () => {
    if (!user) return;
    
    setResending(true);
    try {
      await trackQuizCompletion();
      toast({
        title: "Email resent! 📧",
        description: "Check your inbox and spam folder for 'Your AI Complete Me Compatibility Results'",
      });
      setEmailSent(true);
    } catch (error) {
      console.error('Error resending email:', error);
      toast({
        title: "Error resending email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your compatibility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Beautiful Underlay Background */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/40 to-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              <Heart className="h-8 w-8 text-red-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Quiz Complete! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            Your compatibility profile is ready and matches are waiting!
          </p>
        </div>

        {/* Connection Profile Sneak Peek */}
        <Card className="mb-8 border-primary/20 bg-gradient-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 backdrop-blur-sm z-10"></div>
          <CardHeader className="text-center relative z-20">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Connection Profile
            </CardTitle>
            <CardDescription>Get ready for deeper insights</CardDescription>
          </CardHeader>
          <CardContent className="relative z-20">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">Your Connection Profile will include:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="blur-sm">Compatibility score</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="blur-sm">Vibe signals</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="blur-sm">A unique insight about how you connect</span>
                  </div>
                </div>
              </div>
               <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">
                  🌱 You're in the 60-Day Free Trial
                </p>
                <p className="text-xs text-muted-foreground">
                  Explore all Complete Plus features for free while we grow together
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Previews */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-3">Your Top Compatibility Matches</h2>
            <p className="text-muted-foreground italic">
              One match, a few miles away—but every connection begins somewhere. You're helping shape what comes next.
            </p>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-w-4xl mx-auto">
            {matchPreviews.map((match, index) => (
              <Card 
                key={match.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                onClick={() => handleMatchClick(match, index)}
              >
                <div className="relative">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Avatar className="w-full h-full rounded-lg">
                      <AvatarImage 
                        src={match.blurredPhoto} 
                        alt={`${match.name}'s profile photo`}
                        className="object-cover w-full h-full"
                        style={{ aspectRatio: '3/4' }}
                      />
                      <AvatarFallback className="w-full h-full rounded-lg text-sm bg-gradient-to-br from-primary/20 to-secondary/20">
                        {match.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {index === 0 && (
                    <Badge className="absolute top-1.5 left-1.5 bg-green-600 text-white text-xs px-1 py-0.5">
                      Top!
                    </Badge>
                  )}
                  
                  <Badge 
                    className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-xs px-1 py-0.5"
                  >
                    {match.compatibility}%
                  </Badge>
                </div>
                
                <CardContent className="p-2">
                  <div className="text-center mb-2">
                    <p className="text-xs font-medium leading-tight">
                      {match.name.split(' ')[0]}, {match.age}
                    </p>
                    {(match.location || match.occupation) && (
                      <div className="space-y-0.5 text-[10px] text-muted-foreground mt-1">
                        {match.location && (
                          <div className="flex items-center justify-center gap-0.5">
                            <MapPin className="h-2 w-2" />
                            <span className="truncate">{match.location.split(',')[0]}</span>
                          </div>
                        )}
                        {match.occupation && (
                          <div className="flex items-center justify-center gap-0.5">
                            <Briefcase className="h-2 w-2" />
                            <span className="truncate">{match.occupation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-0.5 justify-center mb-2">
                    {match.commonInterests.slice(0, 1).map((interest) => (
                      <Badge key={interest} variant="outline" className="text-[10px] px-1 py-0">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full h-6 text-xs p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatchClick(match, index);
                    }}
                  >
                    <Eye className="h-2.5 w-2.5 mr-1" />
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Free Trial Features */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Your 60-Day Free Trial Includes
            </CardTitle>
            <CardDescription>Full Complete Plus access while we build this together</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">Unlimited matches</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Unlimited messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm">See who liked you</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Advanced compatibility insights</span>
              </div>
            </div>
            <Button 
              onClick={handleViewMatches}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-primary hover:shadow-xl transition-all duration-300"
            >
              <Heart className="h-4 w-4 mr-2" />
              Start Connecting
            </Button>
          </CardContent>
        </Card>



        {/* Invite Kindred Soul Section - Perfect emotional moment after seeing matches */}
        <div className="mb-8">
          <InviteKindredSoul />
        </div>

        {/* Founder Note */}
        <div className="text-center py-8 border-t border-muted-foreground/10">
          <p className="text-sm text-muted-foreground italic">
            Built with care, designed for real connection ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;