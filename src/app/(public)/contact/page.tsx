"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
import { toast } from "sonner";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.union([
    z.string().min(10, "Phone number must be at least 10 digits"),
    z.literal(""),
  ]).optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const tNav = useTranslations("nav");
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
        body: JSON.stringify({
          ...data,
          phone: data.phone || undefined,
        }),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased">
      {/* Full-width Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/contact-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-teal-800/55 to-blue-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Mail className="w-12 h-12 mb-4 animate-pulse" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-2">எங்களை தொடர்பு கொள்ளுங்கள்</p>
          <p className="text-base md:text-lg text-green-100 text-center max-w-3xl">
            Have questions or feedback? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
          <div className="absolute top-10 right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-green-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: t("breadcrumb") }]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
                  {t("ourAddress")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="text-gray-700 not-italic text-sm leading-relaxed">
                  {t("addressLine1")}
                  <br />
                  {t("addressLine2")}
                  <br />
                  {t("addressLine3")}
                  <br />
                  {t("addressLine4")}
                </address>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
                  {t("phone")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="tel:+919876543210"
                  className="text-blue-600 hover:underline font-medium"
                >
                  +91 98765 43210
                </a>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t("phoneHours")}</p>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
                  {t("email")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:info@kilpennathur.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  info@kilpennathur.com
                </a>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t("responseTime")}</p>
              </CardContent>
            </Card>

            {/* Office Hours Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
                  {t("officeHours")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-sm leading-relaxed">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">{t("hoursWeekdays")}:</span>
                    <span className="font-medium text-gray-900">
                      {t("hoursWeekdaysTime")}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">{t("hoursSaturday")}:</span>
                    <span className="font-medium text-gray-900">
                      {t("hoursSaturdayTime")}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">{t("hoursSunday")}:</span>
                    <span className="font-medium text-red-600">{t("hoursClosed")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
                  {t("sendMessage")}
                </CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1.5 max-w-lg mx-auto leading-relaxed">
                  {t("formDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t("name")} *
                    </label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={t("namePlaceholder")}
                      className={errors.name ? "border-red-500" : ""}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t("email")} *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder={t("emailPlaceholder")}
                      className={errors.email ? "border-red-500" : ""}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t("phoneOptional")}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder={t("phonePlaceholder")}
                      className={errors.phone ? "border-red-500" : ""}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t("subject")} *
                    </label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      placeholder={t("subjectPlaceholder")}
                      className={errors.subject ? "border-red-500" : ""}
                      aria-invalid={!!errors.subject}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      {t("message")} *
                    </label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder={t("messagePlaceholder")}
                      rows={6}
                      className={errors.message ? "border-red-500" : ""}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("sending")
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" aria-hidden />
                        {t("sendButton")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900 tracking-tight">
                {t("findUsOnMap")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 px-4 text-center text-sm font-medium leading-relaxed">
                  {t("mapPlaceholder")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
