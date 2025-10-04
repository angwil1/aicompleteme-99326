import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PrivacyNote } from '@/components/PrivacyNote';

interface AgeGateProps {
  onAgeConfirmed: () => void;
}

export const AgeGate = ({ onAgeConfirmed }: AgeGateProps) => {
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerifyAge = () => {
    if (!dateOfBirth) {
      toast({
        title: "Date of birth required",
        description: "Please enter your date of birth to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      setIsVerifying(false);
      setShowExitWarning(true);
      setTimeout(() => {
        window.location.href = 'https://www.google.com';
      }, 3000);
      return;
    }

    try {
      localStorage.setItem('ageConfirmed', 'true');
      localStorage.setItem('ageConfirmedDate', new Date().toISOString());
      localStorage.setItem('userDateOfBirth', dateOfBirth);
      sessionStorage.setItem('signupAgeVerified', 'true');
      
      toast({
        title: "Age verified",
        description: "Welcome! You can now access the platform.",
      });

      setTimeout(() => {
        onAgeConfirmed();
      }, 500);
    } catch (error) {
      setIsVerifying(false);
      toast({
        title: "Verification error",
        description: "There was an issue verifying your age. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (showExitWarning) {
    return (
      <div className="min-h-screen min-h-[100vh] min-h-[100dvh] bg-red-50 dark:bg-red-950/20 flex items-center justify-center px-4 py-6">
        <Card className="max-w-sm sm:max-w-md w-full mx-auto border-red-200 dark:border-red-800 bg-white dark:bg-card">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
            <div className="mx-auto mb-3 w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-200 text-xl sm:text-2xl">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-6">
            <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">
              This platform is restricted to adults 18+ only. You will be redirected away from this site.
            </p>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
              Redirecting in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100vh] min-h-[100dvh] bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-6">
      <Card className="max-w-sm sm:max-w-md w-full mx-auto border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
          <div className="mx-auto mb-3 w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">Age Verification Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4">
            <p className="text-blue-900 dark:text-blue-100 font-medium mb-2 text-sm sm:text-base">Adult Content Notice</p>
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              This is a dating platform restricted to adults. You must be 18 years of age or older to enter.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="h-4 w-4" />
                Enter Your Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full"
                placeholder="MM/DD/YYYY"
              />
              <PrivacyNote type="age" className="text-xs mt-1" />
            </div>

            <Button 
              onClick={handleVerifyAge}
              disabled={isVerifying || !dateOfBirth}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isVerifying ? 'Verifying...' : 'Verify Age & Continue'}
            </Button>
          </div>

          <div className="text-center space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed px-2">
              By continuing, you confirm that you are at least 18 years old and legally permitted to view adult content in your jurisdiction.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs">
              <a href="/privacy" className="text-blue-600 hover:underline transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-blue-600 hover:underline transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};