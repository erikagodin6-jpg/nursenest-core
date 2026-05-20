import { LocaleLink } from "@/lib/LocaleLink";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  BookOpen,
  CreditCard,
  Bug,
  Send,
  CheckCircle2,
} from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const supportCategories = [
  {
    icon: BookOpen,
    title: "Content & Lessons",
    description: "Questions about lesson content, flashcards, or clinical scenarios",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Subscription management, payments, or refund inquiries",
  },
  {
    icon: Bug,
    title: "Technical Issues",
    description: "Report bugs, loading issues, or platform errors",
  },
  {
    icon: HelpCircle,
    title: "General Questions",
    description: "General inquiries about NurseNest or nursing education",
  },
];

export default function ContactPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, and message.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Message Sent",
      description: "We have received your message and will respond within 24-48 business hours.",
    });
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={t("pages.contact.contactHelpNursenestSupport")}
        description={t("pages.contact.getHelpWithNursenestNursing")}
        keywords="NurseNest support, contact nursing education, help desk, customer service"
        canonicalPath="/contact"
      />
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-contact-title">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are here to help you succeed in your nursing education journey.
            Reach out and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t("pages.contact.emailUs")}</h2>
              <a
                href="mailto:support@nursenest.ca"
                className="text-primary font-semibold text-lg hover:underline"
                data-testid="link-support-email"
              >
                support@nursenest.ca
              </a>
              <p className="text-gray-500 text-sm">
                For all inquiries, feedback, and support requests
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t("pages.contact.responseTime")}</h2>
              <p className="text-gray-700 font-semibold text-lg">{t("pages.contact.2448BusinessHours")}</p>
              <p className="text-gray-500 text-sm">
                Monday through Friday, excluding statutory holidays
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("pages.contact.howCanWeHelp")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.title} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-5 text-center space-y-3">
                    <Icon className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-gray-900 text-sm">{cat.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{cat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.contact.sendUsAMessage")}</h2>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4" data-testid="text-form-success">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">{t("pages.contact.messageReceived")}</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Thank you for reaching out. Our support team will review your message and respond within 24-48 business hours at the email you provided.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  data-testid="button-send-another"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("pages.contact.fullName")}</Label>
                    <Input
                      id="name"
                      placeholder={t("pages.contact.yourName")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("pages.contact.emailAddress")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("pages.contact.youremailcom")}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("pages.contact.subject")}</Label>
                  <Input
                    id="subject"
                    placeholder={t("pages.contact.briefDescriptionOfYourInquiry")}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    data-testid="input-contact-subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("pages.contact.message")}</Label>
                  <Textarea
                    id="message"
                    placeholder={t("pages.contact.describeYourQuestionIssueOr")}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    data-testid="input-contact-message"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-contact-submit">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree to our{" "}
                  <LocaleLink href="/privacy" className="text-primary hover:underline">{t("pages.contact.privacyPolicy")}</LocaleLink>.
                  We will never share your information with third parties.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <AdminEditButton pageName="contact" />
      <Footer />
    </div>
  );
}
