import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterStep1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/register/step2");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Blue Panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between gradient-teal text-white p-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="text-lg font-bold">
            AAROGYA <span className="opacity-80">NETRA</span>
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">Register Your Hospital</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Join 500+ healthcare institutions using our AI-powered feedback platform.
          </p>

          {/* Step indicators */}
          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-sm font-bold">1</div>
              <div>
                <p className="font-semibold text-sm">Account Setup</p>
                <p className="text-xs text-white/70">Create login credentials</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 opacity-60">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">2</div>
              <div>
                <p className="font-semibold text-sm">Hospital Details</p>
                <p className="text-xs text-white/70">Configure departments & SLA</p>
              </div>
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex items-center gap-2">
              <HeartPulse className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                AAROGYA <span className="text-primary">NETRA</span>
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-primary mb-1">Step 1 of 2</p>
          <h1 className="text-2xl font-bold text-foreground mb-1">Account Setup</h1>
          <p className="text-sm text-muted-foreground mb-8">Create your hospital login credentials</p>

          <form onSubmit={handleNext} className="space-y-6">
            {/* Section A */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">A</span>
                Hospital Account
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Hospital Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="admin@hospital.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Section B */}
<div className="space-y-4">
  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
    
    
  </div>

  
</div>

<Button type="submit" className="w-full gap-2">
  Next <ArrowRight className="h-4 w-4" />
</Button>
</form>
</div>
</div>
</div>
);
};



export default RegisterStep1;