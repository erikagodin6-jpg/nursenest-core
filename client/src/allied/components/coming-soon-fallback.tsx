import { Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ComingSoonFallbackProps {
  title: string;
  description?: string;
  careerSlug?: string;
}

export function ComingSoonFallback({ title, description, careerSlug }: ComingSoonFallbackProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50/50 to-cyan-50/30 rounded-2xl border border-teal-100 p-8 text-center" data-testid="coming-soon-fallback">
      <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-teal-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="text-coming-soon-title">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md mx-auto mb-4" data-testid="text-coming-soon-description">
        {description || "This content is being developed by our team of certified professionals. Check back soon for updates."}
      </p>
      {careerSlug && (
        <Link
          href={`/diagnostic?career=${careerSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
          data-testid="link-coming-soon-diagnostic"
        >
          Take Free Diagnostic Instead <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
