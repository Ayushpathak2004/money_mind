import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap,
  Star,
  Clock,
  Users
} from "lucide-react"

const features = {
  free: [
    "Track up to 100 transactions",
    "Basic expense categories",
    "Monthly budget reports",
    "Manual transaction entry",
    "Basic analytics",
  ],
  premium: [
    "Unlimited transactions",
    "Advanced AI categorization", 
    "Receipt scanning & OCR",
    "Custom categories & tags",
    "Advanced analytics & insights",
    "Budget alerts & notifications",
    "Multiple account support",
    "Export data (CSV, PDF)",
    "Priority customer support",
    "Bank sync (coming soon)",
  ],
  pro: [
    "Everything in Premium",
    "Multi-user collaboration",
    "Business expense tracking",
    "Tax reporting tools",
    "API access",
    "Custom integrations",
    "Advanced security features",
    "Dedicated account manager",
  ]
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content: "MoneyMind🧠 has completely transformed how I manage my business expenses. The AI categorization saves me hours every month!",
    avatar: "SJ"
  },
  {
    name: "Mike Chen", 
    role: "Freelance Designer",
    content: "The receipt scanning feature is a game-changer. I just take a photo and everything is automatically categorized and recorded.",
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Manager", 
    content: "The budget alerts keep me on track, and the detailed analytics help me make smarter financial decisions.",
    avatar: "ER"
  }
]

export default function Premium() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take your expense tracking to the next level with AI-powered insights, 
            unlimited transactions, and advanced analytics.
          </p>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card className="shadow-card max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Current Plan: Free</h3>
                <p className="text-sm text-muted-foreground">
                  You're using 45 of 100 monthly transactions
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary">Free Tier</Badge>
              <p className="text-sm text-muted-foreground mt-1">$0/month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-muted">
                <Clock className="h-4 w-4" />
              </div>
              Free
            </CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="space-y-1">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="shadow-lg border-primary relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-primary text-white">
              Most Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              Premium
            </CardTitle>
            <CardDescription>Ideal for personal finance management</CardDescription>
            <div className="space-y-1">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 text-success">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">14-day free trial</span>
              </div>
            </div>
            <ul className="space-y-3">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
              Start Free Trial
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-accent text-accent-foreground">
                <Users className="h-4 w-4" />
              </div>
              Pro
            </CardTitle>
            <CardDescription>For teams and businesses</CardDescription>
            <div className="space-y-1">
              <span className="text-3xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.pro.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Why Choose Premium?</h2>
          <p className="text-muted-foreground mt-2">
            Unlock powerful features that save time and provide deeper insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-card text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Categorization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our advanced AI automatically categorizes your expenses with 95% accuracy, 
                saving you hours of manual work every month.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-accent/10 w-fit">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Smart Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get personalized insights and recommendations to optimize your spending 
                and reach your financial goals faster.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card text-center">
            <CardHeader>
              <div className="mx-auto p-3 rounded-full bg-success/10 w-fit">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Bank-Level Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your financial data is protected with 256-bit encryption and 
                industry-leading security measures.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Loved by Thousands</h2>
          <p className="text-muted-foreground mt-2">
            See what our premium users are saying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="shadow-card max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div>
              <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access 
                to premium features until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">What happens to my data if I downgrade?</h3>
              <p className="text-sm text-muted-foreground">
                Your data is always safe. If you downgrade, you'll lose access to premium features 
                but your data remains intact and you can upgrade again anytime.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is my financial data secure?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely. We use bank-level 256-bit encryption and never store your banking credentials. 
                Your privacy and security are our top priority.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-6 p-8 rounded-xl bg-gradient-primary text-white">
        <h2 className="text-3xl font-bold">Ready to Transform Your Finances?</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Join thousands of users who are already saving time and money with MoneyMind🧠 Premium.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            Start 14-Day Free Trial
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            View Demo
          </Button>
        </div>
        <p className="text-sm opacity-75">
          No credit card required • Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  )
}
