import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials_pt = [
  {
    text: "Este ERP revolucionou nossas operações, otimizando finanças e estoque. A plataforma baseada em nuvem nos mantém produtivos, mesmo remotamente.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Gerente de Operações",
    rating: 5,
  },
  {
    text: "A implementação deste ERP foi tranquila e rápida. A interface personalizável e fácil de usar tornou o treinamento da equipe sem esforço.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "Gerente de TI",
    rating: 5,
  },
  {
    text: "A equipe de suporte é excepcional, nos guiando na configuração e fornecendo assistência contínua, garantindo nossa satisfação.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Líder de Suporte ao Cliente",
    rating: 5,
  },
  {
    text: "A integração perfeita deste ERP aprimorou nossas operações e eficiência de negócios. Altamente recomendado por sua interface intuitiva.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
    rating: 5,
  },
  {
    text: "Seus recursos robustos e suporte rápido transformaram nosso fluxo de trabalho, tornando-nos significativamente mais eficientes.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Gerente de Projetos",
    rating: 5,
  },
  {
    text: "A implementação tranquila superou as expectativas. Otimizou processos, melhorando o desempenho geral dos negócios.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Analista de Negócios",
    rating: 5,
  },
  {
    text: "Nossas funções de negócios melhoraram com um design fácil de usar e feedback positivo dos clientes.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Diretor de Marketing",
    rating: 5,
  },
  {
    text: "Eles entregaram uma solução que superou as expectativas, entendendo nossas necessidades e aprimorando nossas operações.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Gerente de Vendas",
    rating: 5,
  },
  {
    text: "Usando este ERP, nossa presença online e conversões melhoraram significativamente, impulsionando o desempenho dos negócios.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Gerente de E-commerce",
    rating: 5,
  },
];

// Componente do Card de Depoimento com estilo Ultimate Tech
const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-slate-900 to-black border border-orange-500/30 rounded-lg p-6 hover:border-orange-500/60 transition-all duration-300 backdrop-blur-sm"
    >
      {/* Brilho de fundo */}
      <div className="absolute inset-0 bg-orange-500/5 rounded-lg blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className="fill-orange-500 text-orange-500"
            />
          ))}
        </div>

        {/* Citação */}
        <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
          "{testimonial.text}"
        </p>

        {/* Divisor */}
        <div className="h-px bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 mb-4" />

        {/* Autor */}
        <div className="flex items-center gap-3">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full border border-orange-500/50 object-cover"
          />
          <div>
            <p className="font-semibold text-white text-sm">
              {testimonial.name}
            </p>
            <p className="text-orange-500/70 text-xs">{testimonial.role}</p>
          </div>
        </div>
      </div>

      {/* Marca TM no canto */}
      <div className="absolute top-3 right-3 text-orange-500/30 text-xs font-bold">
        TM
      </div>
    </motion.div>
  );
};

// Componente da Coluna de Depoimentos com animação de scroll
const TestimonialsColumn = ({ testimonials, duration = 15 }) => {
  return (
    <div className="flex flex-col gap-6 animate-scroll" style={{
      animationDuration: `${duration}s`,
    }}>
      {/* Renderiza os depoimentos duas vezes para criar efeito de loop infinito */}
      {[...testimonials, ...testimonials].map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
      ))}
    </div>
  );
};

// Componente Principal da Seção
export const Testimonials = () => {
  const firstColumn = testimonials_pt.slice(0, 3);
  const secondColumn = testimonials_pt.slice(3, 6);
  const thirdColumn = testimonials_pt.slice(6, 9);

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      {/* Fundo com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-orange-500 text-sm font-semibold">
              DEPOIMENTOS
            </span>
          </div>

          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
            O que nossos clientes dizem
          </h2>

          {/* Subtítulo */}
          <p className="text-center text-white/60 text-lg">
            Veja como a Sempre Tecnologia transformou os negócios de empresas
            como a sua.
          </p>
        </motion.div>

        {/* Grid de Colunas com Scroll */}
        <div className="flex justify-center gap-6 max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:flex"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:flex"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
