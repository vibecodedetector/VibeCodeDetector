import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Key,
  Bot,
  Scale,
  Search,
  Users,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Security Scanner',
    description: 'Identify vulnerabilities, check security headers, and audit authentication.',
    color: 'text-red-500',
  },
  {
    icon: Key,
    title: 'API Key Detector',
    description: 'Find exposed credentials, API keys, and sensitive data in client-side code.',
    color: 'text-amber-500',
  },
  {
    icon: Bot,
    title: 'AI Detection',
    description: 'Identify telltale signs that a website was built using AI coding assistants.',
    color: 'text-purple-500',
  },
  {
    icon: Scale,
    title: 'Legal Compliance',
    description: 'Ensure websites don\'t make unsubstantiated claims and comply with regulations.',
    color: 'text-blue-500',
  },
  {
    icon: Search,
    title: 'SEO Analyzer',
    description: 'Comprehensive SEO audit with Core Web Vitals, meta tags, and schema validation.',
    color: 'text-green-500',
  },
  {
    icon: Users,
    title: 'Competitor Intel',
    description: 'Understand what competitors are doing and what\'s working for them.',
    color: 'text-cyan-500',
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For trying things out',
    features: ['3 scans per month', 'Basic security scan', 'SEO overview', 'Limited API key detection'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'For indie hackers',
    features: ['25 scans per month', 'Full security scanner', 'Complete SEO audit', 'API key leak detection', 'Email alerts', 'PDF reports'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For growing teams',
    features: ['100 scans per month', 'All Starter features', 'Legal compliance checker', 'AI detection scanner', 'Competitor analysis (3)', 'API access'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For agencies',
    features: ['Unlimited scans', 'All Pro features', 'Unlimited competitors', 'White-label reports', 'Priority support', 'Team (5 seats)'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">VibeCheck</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            🚀 Now in Beta
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The Security Scanner for{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Vibe-Coded
            </span>{' '}
            Websites
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Built your app with AI? VibeCheck catches what AI misses: security holes,
            leaked API keys, legal issues, and SEO problems. Ship with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/signup">
                Start Free Scan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '50+', label: 'Security Checks' },
              { value: '100+', label: 'API Key Patterns' },
              { value: '20+', label: 'SEO Metrics' },
              { value: '< 30s', label: 'Average Scan Time' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Ship Safely
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Six powerful scanners that catch the issues AI coding tools commonly miss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <feature.icon className={`h-10 w-10 ${feature.color} mb-2`} />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${tier.highlighted ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.highlighted ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/signup">{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Ship with Confidence?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get your first scan free. No credit card required.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/signup">
              Start Your Free Scan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-bold">VibeCheck</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2026 VibeCheck. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
