"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { cn } from "@/lib/utils";

/* ---------- Zod schema ---------- */

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .union([
      z.string().min(10, "Phone number must be at least 10 digits"),
      z.literal(""),
    ])
    .optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ---------- FAQ Data ---------- */

const FAQS = [
  {
    q: "Is this the official Kilpennathur government website?",
    qTa: "இது கீழ்பென்னாத்தூர் அரசு அதிகாரப்பூர்வ இணையதளமா?",
    a: "This is a community information portal built to serve the residents of Kilpennathur. For official government services, please visit the respective government department websites.",
    aTa: "இது கீழ்பென்னாத்தூர் குடிமக்களுக்கு சேவை செய்ய உருவாக்கப்பட்ட சமூக தகவல் இணையதளம். அதிகாரப்பூர்வ அரசு சேவைகளுக்கு, தயவுசெய்து சம்பந்தப்பட்ட அரசு துறை இணையதளங்களை பார்வையிடவும்.",
  },
  {
    q: "How do I post a job on this portal?",
    qTa: "இந்த இணையதளத்தில் வேலை விளம்பரம் எப்படி போடுவது?",
    a: "To post a job listing, please contact our team via this form or email us at info@kilpennathur.com. We'll help you create a professional listing that reaches thousands of local residents.",
    aTa: "வேலை விளம்பரம் போட, தயவுசெய்து இந்த படிவம் மூலம் எங்கள் குழுவை தொடர்பு கொள்ளுங்கள் அல்லது info@kilpennathur.com க்கு மின்னஞ்சல் அனுப்புங்கள்.",
  },
  {
    q: "How can I add my business to the directory?",
    qTa: "எனது வணிகத்தை அடைவில் எவ்வாறு சேர்ப்பது?",
    a: "You can request a business listing by sending us a message through this contact form. Include your business name, category, address, and contact details. Our team will review and publish it within 24-48 hours.",
    aTa: "இந்த தொடர்பு படிவம் மூலம் எங்களுக்கு செய்தி அனுப்பி வணிக பட்டியலை கோரலாம். உங்கள் வணிக பெயர், வகை, முகவரி மற்றும் தொடர்பு விவரங்களை சேர்க்கவும்.",
  },
  {
    q: "Can I post a classified ad for free?",
    qTa: "நான் இலவசமாக விளம்பரம் போட முடியுமா?",
    a: "Yes! Posting classifieds on our portal is completely free for Kilpennathur residents. Contact us to get started or use the admin submission form if available.",
    aTa: "ஆம்! எங்கள் இணையதளத்தில் விளம்பரங்கள் போடுவது கீழ்பென்னாத்தூர் குடிமக்களுக்கு முற்றிலும் இலவசம்.",
  },
  {
    q: "How do I report incorrect information?",
    qTa: "தவறான தகவலை எவ்வாறு புகாரளிப்பது?",
    a: "If you find any incorrect or outdated information on our portal, please use this contact form to let us know. Mention the specific page and what needs to be corrected. We take accuracy very seriously.",
    aTa: "எங்கள் இணையதளத்தில் ஏதேனும் தவறான அல்லது காலாவதியான தகவலைக் கண்டால், தயவுசெய்து இந்த தொடர்பு படிவத்தைப் பயன்படுத்தி எங்களுக்குத் தெரிவிக்கவும்.",
  },
  {
    q: "Is there a mobile app available?",
    qTa: "மொபைல் செயலி கிடைக்குமா?",
    a: "Currently, we operate as a mobile-friendly website that works great on all devices. A dedicated mobile app is in our future roadmap. Stay tuned!",
    aTa: "தற்போது, அனைத்து சாதனங்களிலும் சிறப்பாக செயல்படும் மொபைல்-நட்பு இணையதளமாக செயல்படுகிறோம். ஒரு பிரத்யேக மொபைல் செயலி எங்கள் எதிர்கால திட்டத்தில் உள்ளது.",
  },
];

/* ---------- Contact info cards data ---------- */

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Visit Us",
    titleTa: "எங்களை சந்தியுங்கள்",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    content: (
      <address className="not-italic text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Kilpennathur Main Road
        <br />
        Kilpennathur - 606751
        <br />
        Tiruvannamalai District
        <br />
        Tamil Nadu, India
      </address>
    ),
    href: undefined as string | undefined,
  },
  {
    icon: Phone,
    title: "Call Us",
    titleTa: "அழைக்கவும்",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    content: (
      <div>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-50 font-mono">
          +91 98765 43210
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Mon - Sat: 9:00 AM - 6:00 PM
        </p>
      </div>
    ),
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    title: "Email Us",
    titleTa: "மின்னஞ்சல் அனுப்புங்கள்",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    content: (
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          info@kilpennathur.com
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          We&apos;ll respond within 24 hours
        </p>
      </div>
    ),
    href: "mailto:info@kilpennathur.com",
  },
];

/* ---------- Component ---------- */

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone: data.phone || undefined }),
      });
      if (response.ok) {
        toast.success(t("successToast"));
        reset();
      } else {
        toast.error(t("errorToast"));
      }
    } catch {
      toast.error(t("genericErrorToast"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Compact Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-blue-200 text-xs font-semibold mb-5">
            <MessageSquare className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            We&apos;d love to hear from you
          </h1>
          <p className="font-tamil text-lg text-blue-200/80 mt-2 leading-relaxed">
            எங்களை தொடர்பு கொள்ளுங்கள்
          </p>
          <p className="text-sm md:text-base text-blue-100/70 mt-3 max-w-2xl mx-auto leading-relaxed">
            Have a question about Kilpennathur? We&apos;re here to help. Send us
            a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />

        {/* ── Contact Info Cards (3 columns) ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            const Wrapper = card.href ? "a" : "div";
            const wrapperProps = card.href
              ? { href: card.href, className: "block" }
              : { className: "block" };

            return (
              <Wrapper key={card.title} {...wrapperProps}>
                <Card
                  className={cn(
                    "text-center hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700",
                    card.href &&
                      "cursor-pointer hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-700"
                  )}
                >
                  <CardContent className="pt-8 pb-6 px-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center",
                        card.bg
                      )}
                    >
                      <Icon className={cn("w-7 h-7", card.color)} aria-hidden />
                    </div>
                    <h3 className="font-serif font-bold text-base text-gray-900 dark:text-gray-50 mb-1">
                      {card.title}
                    </h3>
                    <p className="font-tamil text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {card.titleTa}
                    </p>
                    {card.content}
                  </CardContent>
                </Card>
              </Wrapper>
            );
          })}
        </section>

        {/* ── Main Content: Form + Map ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left — Contact Form */}
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                {t("sendMessage")}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("formDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      {t("name")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={t("namePlaceholder")}
                      className={cn(
                        "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800",
                        errors.name && "border-red-500"
                      )}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder={t("emailPlaceholder")}
                      className={cn(
                        "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800",
                        errors.email && "border-red-500"
                      )}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone + Subject row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      {t("phoneOptional")}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder={t("phonePlaceholder")}
                      className={cn(
                        "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800",
                        errors.phone && "border-red-500"
                      )}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      {t("subject")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      placeholder={t("subjectPlaceholder")}
                      className={cn(
                        "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800",
                        errors.subject && "border-red-500"
                      )}
                      aria-invalid={!!errors.subject}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                  >
                    {t("message")} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder={t("messagePlaceholder")}
                    rows={5}
                    className={cn(
                      "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 resize-none",
                      errors.message && "border-red-500"
                    )}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t("sending")
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden />
                      {t("sendButton")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right — Map + Office Hours */}
          <div className="flex flex-col gap-6">
            {/* Google Maps embed */}
            <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62185.01693758283!2d79.16!3d12.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babda2ea3ed97d7%3A0xd044714a5e77c6e5!2sKilpennathur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full min-h-[400px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kilpennathur Location on Google Maps"
              />
            </div>

            {/* Office Hours Card */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-serif text-base font-bold text-gray-900 dark:text-gray-50">
                  <Clock className="w-4 h-4 text-blue-600" aria-hidden />
                  {t("officeHours")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("hoursWeekdays")}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      {t("hoursWeekdaysTime")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("hoursSaturday")}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      {t("hoursSaturdayTime")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("hoursSunday")}
                    </span>
                    <span className="font-bold text-red-600">
                      {t("hoursClosed")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                அடிக்கடி கேட்கப்படும் கேள்விகள்
              </p>
            </div>

            <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`faq-${idx}`}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start gap-3 text-sm font-semibold text-gray-900 dark:text-gray-50">
                          <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{faq.q}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="ml-7 space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.a}
                          </p>
                          <p className="font-tamil text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {faq.aTa}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
