export function Hero() {
    return (
        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 mb-8 bg-[linear-gradient(135deg,#22c55e_0%,#06b6d4_60%,#0ea5e9_100%)] text-white shadow-lg shadow-tm-primary/20 bg-[length:200%_200%] min-h-[160px] flex items-center group animate-heroBg">

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-white/10 blur-2xl group-hover:bg-white/15 transition-colors"></div>
            <div className="absolute -bottom-16 right-20 w-[150px] h-[150px] rounded-full bg-white/10 blur-xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-6">
                <div>
                    <span className="text-sm font-medium opacity-80 mb-1 block uppercase tracking-widest">Bom dia, Admin 👋</span>
                    <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight tracking-tight mb-2">
                        SaaS Factory <span className="italic bg-clip-text text-transparent bg-[linear-gradient(90deg,#fff,rgba(255,255,255,0.65))] bg-[length:200%_auto] animate-shimmerText inline-block">Ocean Breeze</span>
                    </h1>
                    <p className="opacity-80 text-sm max-w-xl">
                        Acesse rapidamente as ferramentas da franquia para gerenciar, extrair e monitorar todo o ecossistema TM Seminovos.
                    </p>
                </div>

                <div className="hidden lg:flex shrink-0 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="text-center px-4 border-r border-white/20">
                        <span className="block text-xl font-bold">4</span>
                        <span className="text-[0.65rem] uppercase tracking-wider opacity-80">Módulos</span>
                    </div>
                    <div className="text-center px-4">
                        <span className="block text-xl font-bold">100%</span>
                        <span className="text-[0.65rem] uppercase tracking-wider opacity-80">Next.js 16+</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
