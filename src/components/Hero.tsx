import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Clock, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-support.jpg';

const Hero = () => {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Soporte Técnico
            <span className="block text-accent-foreground/90">Profesional</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Gestiona y resuelve tickets de soporte de manera eficiente con nuestro sistema profesionalmente
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-white/90">
              <Users className="h-5 w-5" />
              <span className="font-semibold">500+ Clientes</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">24/7 Disponible</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">99% Resueltos</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button 
            size="lg" 
            onClick={scrollToTickets}
            className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 rounded-full shadow-elegant transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            Gestionar Tickets
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
