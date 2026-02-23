import { Link } from "react-router-dom";
import {
  MessageSquare,
  Brain,
  AlertTriangle,
  Clock,
  ArrowRight,
  Activity,
  ClipboardList,
  Shield,
  ChevronRight,
  HeartPulse,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              AAROGYA <span className="text-primary">NETRA</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#problem" className="hover:text-foreground transition-colors">Problem</a>
            <a href="#solution" className="hover:text-foreground transition-colors">Solution</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/login?tab=register">
              <Button size="sm">Register Hospital</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Two Column */}
      <section className="gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                AI-Powered Healthcare Platform
              </div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <HeartPulse className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary">AAROGYA NETRA</span>
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] text-foreground md:text-5xl lg:text-[3.5rem]">
                Intelligent Patient{" "}
                <span className="text-primary">Feedback</span> &{" "}
                Resolution Engine
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Transform fragmented patient feedback into real-time, actionable service
                recovery workflows. Elevate patient satisfaction with AI-driven insights.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/login">
                  <Button size="lg" className="gap-2 px-8">
                    Hospital Login <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login?tab=register">
                  <Button variant="outline" size="lg" className="px-8">
                    Register Hospital
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Visual with floating cards */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto h-[420px] w-full max-w-md">
                {/* Background shape */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary to-accent/20" />
                {/* Abstract medical visual using CSS */}
                <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                      <HeartPulse className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-1.5 rounded-full bg-primary/30"
                          style={{
                            height: `${20 + Math.sin(i * 1.2) * 16}px`,
                            opacity: 0.3 + i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating card 1 */}
                <div className="absolute left-0 top-1/3 -translate-x-4 rounded-xl border border-border bg-card p-3 shadow-clinical-lg flex items-center gap-3 animate-fade-in">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Case Resolved</p>
                    <p className="text-xs text-muted-foreground">Within SLA</p>
                  </div>
                </div>
                {/* Floating card 2 */}
                <div className="absolute bottom-16 right-0 translate-x-4 rounded-xl border border-border bg-card p-3 shadow-clinical-lg flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Analysis</p>
                    <p className="text-xs text-muted-foreground">Real-time Processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="bg-surface py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">The Problem</h2>
            <p className="text-muted-foreground">
              Hospitals collect feedback through surveys, WhatsApp, email, call centers, and social media — but insights remain scattered, delayed, and manually analyzed.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { icon: MessageSquare, title: "Scattered Channels", desc: "Feedback arrives from 5+ channels with no unified view" },
              { icon: Clock, title: "Delayed Insights", desc: "Manual analysis takes days, critical issues go unresolved" },
              { icon: AlertTriangle, title: "No Accountability", desc: "No SLA tracking or department-level case assignment" },
            ].map((item, i) => (
              <div key={i} className="card-clinical p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Our Solution</h2>
            <p className="text-muted-foreground">
              An AI-driven unified feedback gateway that transforms patient voices into actionable workflows.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageSquare, title: "Multi-Channel Collection", desc: "Unified intake from WhatsApp, email, surveys & more" },
              { icon: Brain, title: "Sentiment Analysis", desc: "Real-time AI-powered sentiment scoring of every message" },
              { icon: AlertTriangle, title: "Negative Spike Detection", desc: "Automatic alerts when negative trends emerge" },
              { icon: ClipboardList, title: "SLA Case Tracking", desc: "Auto-assigned department cases with SLA deadlines" },
            ].map((item, i) => (
              <div key={i} className="card-clinical p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-surface py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">How It Works</h2>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-0 md:grid-cols-4">
              {[
                { icon: MessageSquare, step: "01", title: "Collect Feedback", desc: "Patients send feedback via WhatsApp, email, or in-app" },
                { icon: Brain, step: "02", title: "AI Sentiment Analysis", desc: "NLP engine classifies sentiment in real time" },
                { icon: AlertTriangle, step: "03", title: "Issue Detection", desc: "Negative feedback clustered by department & issue type" },
                { icon: Shield, step: "04", title: "SLA Resolution", desc: "Auto-assigned cases resolved within SLA timelines" },
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center px-4 py-6 text-center">
                  {i < 3 && (
                    <div className="absolute right-0 top-1/3 hidden md:block">
                      <ChevronRight className="h-5 w-5 text-primary/40" />
                    </div>
                  )}
                  <div className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                    Step {item.step}
                  </div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-teal">
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">
                AAROGYA <span className="text-primary">NETRA</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Aarogya Netra. Intelligent Patient Feedback & Resolution Engine.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="cursor-pointer hover:text-primary transition-colors">Privacy</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Terms</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
