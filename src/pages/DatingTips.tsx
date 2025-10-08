import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Heart, MessageCircle, Camera, Shield, Coffee, Users, CheckCircle } from 'lucide-react';

const DatingTips = () => {
  const tipCategories = [
    {
      id: 'profile',
      title: 'Profile Tips',
      icon: Camera,
      color: 'bg-blue-500',
      tips: [
        {
          title: 'Photos that actually work',
          content: 'Use natural lighting - bathroom mirrors never look good. One clear face shot, one full body, and one doing something you enjoy. Skip the group photos where no one knows which person you are.',
          practical: true
        },
        {
          title: 'Write a bio people remember',
          content: 'Mention specific things you do, not generic traits. "I make killer pancakes on Sunday mornings" beats "I love to laugh" every time.',
          practical: true
        },
        {
          title: 'Be specific about interests',
          content: 'Instead of "love music," try "currently obsessed with indie folk playlists." It gives people something real to connect with.',
          practical: false
        }
      ]
    },
    {
      id: 'messaging',
      title: 'Messaging',
      icon: MessageCircle,
      color: 'bg-green-500',
      tips: [
        {
          title: 'First messages that get responses',
          content: 'Ask about something specific from their profile. "I saw you went to that new coffee place - was it worth the hype?" works better than "hey beautiful."',
          practical: true
        },
        {
          title: 'Keep conversations balanced',
          content: 'Match their energy level. If they send paragraph responses, you can too. If they keep it short, follow their lead.',
          practical: true
        },
        {
          title: 'Move offline when it feels right',
          content: 'If you\'ve been chatting for a few days and it\'s going well, suggest meeting up. "Want to check out that farmers market this weekend?" is casual and low-pressure.',
          practical: true
        }
      ]
    },
    {
      id: 'first-dates',
      title: 'First Dates',
      icon: Coffee,
      color: 'bg-purple-500',
      tips: [
        {
          title: 'Pick the right location',
          content: 'Coffee, lunch, or a casual walk work best. Save dinner for when you know you actually like each other - nobody wants to be stuck at a fancy restaurant with someone they don\'t click with.',
          practical: true
        },
        {
          title: 'Conversation flow',
          content: 'Ask follow-up questions about things they mention. If they say they work in marketing, ask what kind of campaigns they work on. Show genuine interest.',
          practical: false
        },
        {
          title: 'Handle the check gracefully',
          content: 'Offer to split it. If they insist on paying, let them. If you asked them out, be prepared to pay. Don\'t make it weird.',
          practical: true
        }
      ]
    },
    {
      id: 'red-flags',
      title: 'Red Flags to Watch',
      icon: Shield,
      color: 'bg-red-500',
      tips: [
        {
          title: 'Communication red flags',
          content: 'Love bombing (too intense too fast), only talking about themselves, getting angry when you don\'t respond immediately, or pushing for personal info too quickly.',
          practical: true
        },
        {
          title: 'Profile red flags',
          content: 'No clear face photos, all group photos, or profiles that seem too good to be true. Also watch out for people who seem bitter about dating in their bio.',
          practical: true
        },
        {
          title: 'First date red flags',
          content: 'Showing up late without notice, being rude to servers, talking about exes extensively, or making you uncomfortable when you set boundaries.',
          practical: true
        }
      ]
    },
    {
      id: 'mindset',
      title: 'Dating Mindset',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      tips: [
        {
          title: 'Manage expectations',
          content: 'Not every match will lead to a relationship, and that\'s normal. Focus on meeting interesting people rather than finding "the one" immediately.',
          practical: false
        },
        {
          title: 'Take breaks when needed',
          content: 'Dating app fatigue is real. If you find yourself swiping mindlessly or getting discouraged, take a week off. You\'ll come back with fresh energy.',
          practical: true
        },
        {
          title: 'Be yourself (actually)',
          content: 'Don\'t pretend to like hiking if you hate it. The right person will appreciate your genuine interests, even if they\'re not conventionally "impressive."',
          practical: false
        }
      ]
    },
    {
      id: 'safety',
      title: 'Stay Safe',
      icon: Shield,
      color: 'bg-orange-500',
      tips: [
        {
          title: 'Meeting in public',
          content: 'Always meet in public places for first dates. Tell a friend where you\'re going and when you expect to be back. Trust your gut if something feels off.',
          practical: true
        },
        {
          title: 'Protect your privacy',
          content: 'Don\'t share your home address, workplace details, or last name until you\'ve met and feel comfortable. Use the app\'s messaging system initially.',
          practical: true
        },
        {
          title: 'Video chat first',
          content: 'If you\'ve been messaging for a while, suggest a quick video call before meeting. It helps verify they\'re who they say they are and can prevent awkward mismatches.',
          practical: true
        }
      ]
    }
  ];

  const appSpecificTips = [
    'Use your Memory Vault to remember important details about people you connect with',
    'Save conversation starters that worked well for future reference',
    'Note patterns in what types of people you connect with best',
    'Keep track of first date locations that worked out well'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Elegant background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 max-w-7xl">
          <header className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-primary fill-primary/20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Dating Tips That Actually Work
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real advice from real experiences. No fairy tale promises, just practical tips to help you have better dates and find genuine connections.
            </p>
          </header>

          {/* App-specific tips banner */}
          <Card className="mb-12 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 shadow-lg animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                Make the Most of Your Memory Vault
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-3">
                {appSpecificTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tips grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {tipCategories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-muted/40 bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {category.tips.map((tip, index) => (
                      <div key={index} className="space-y-2 pb-5 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm flex-1 text-foreground">{tip.title}</h4>
                          {tip.practical && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                              Practical
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.content}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom note */}
          <div className="mt-16 text-center animate-fade-in">
            <Card className="max-w-3xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-lg">
              <CardContent className="pt-8 pb-8 px-6 sm:px-8">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Remember</h3>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Dating is about finding someone who appreciates you for who you are. 
                  These tips can help you present your best self, but the right person 
                  will like you even on your awkward days. Stay authentic, stay safe, and enjoy the journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatingTips;