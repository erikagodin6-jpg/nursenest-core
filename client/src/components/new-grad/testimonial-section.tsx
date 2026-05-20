import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";

interface TestimonialSectionProps {
  profession?: string;
  title?: string;
}

export function TestimonialSection({ profession, title = "What New Grads Are Saying" }: TestimonialSectionProps) {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/new-grad/testimonials", profession],
    queryFn: async () => {
      const url = profession ? `/api/new-grad/testimonials?profession=${profession}` : "/api/new-grad/testimonials";
      const res = await fetch(url);
      return res.ok ? res.json() : [];
    },
  });

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50" data-testid="section-testimonials">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Sarah M.", role: "New Grad RN, ICU", content: "The first year guide helped me survive my ICU orientation. I wish I had this when I started!", rating: 5 },
              { name: "James K.", role: "New Grad Paramedic", content: "Having structured clinical tips from experienced professionals made my transition so much smoother.", rating: 5 },
              { name: "Priya T.", role: "New Grad RRT", content: "The exam prep resources were exactly what I needed. Passed my boards on the first try!", rating: 5 },
            ].map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" data-testid="section-testimonials">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.slice(0, 6).map((t: any, i: number) => (
            <TestimonialCard key={t.id || i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all" data-testid={`testimonial-card-${testimonial.name?.replace(/\s/g, "-").toLowerCase()}`}>
      <Quote className="w-6 h-6 text-blue-200 mb-3" />
      <p className="text-sm text-gray-600 mb-4 line-clamp-4">{testimonial.content}</p>
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
        {testimonial.role && <p className="text-xs text-gray-500">{testimonial.role}</p>}
      </div>
    </div>
  );
}
