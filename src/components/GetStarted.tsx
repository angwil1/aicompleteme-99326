import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const GetStarted = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGetStarted = async () => {
    // If not logged in, go to quick start
    if (!user) {
      navigate('/quick-start');
      setTimeout(() => window.scrollTo(0, 0), 0);
      return;
    }

    // Check if profile is complete and quiz is done
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, age, gender, location')
        .eq('id', user.id)
        .single();

      const { data: quizData } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'quiz_completed')
        .limit(1);

      const hasCompletedQuiz = quizData && quizData.length > 0;
      const hasCompleteProfile = profile && profile.name && profile.age && profile.gender && profile.location;

      if (!hasCompleteProfile) {
        toast({
          title: "Complete your profile first",
          description: "Please finish setting up your profile before searching for matches",
        });
        navigate('/profile-setup');
      } else if (!hasCompletedQuiz) {
        toast({
          title: "Take the quiz first",
          description: "Complete the quiz to get better matches",
        });
        navigate('/questions');
      } else {
        navigate('/search');
      }
      
      setTimeout(() => window.scrollTo(0, 0), 0);
    } catch (error) {
      console.error('Error checking profile/quiz status:', error);
      navigate('/quick-start');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Now Live & Ready</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Start Your Journey Today
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're just beginning. You're invited to grow with us. Explore freely for 60 days—with full access to Complete Plus.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground max-w-md mx-auto">
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              <span>60 days free</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              <span>Full features</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              <span>Referral rewards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};