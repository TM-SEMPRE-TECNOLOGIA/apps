import { ArrowRight } from "lucide-react";

interface AppCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    status: "Pronto" | "Em Refatoração" | "Fila";
    colorHex: string;
}

export function AppCard({ title, description, icon, status, colorHex }: AppCardProps) {
    const statusColors = {
        "Pronto": "bg-tm-success/10 text-tm-success border-tm-success/20",
        "Em Refatoração": "bg-tm-warning/10 text-tm-warning border-tm-warning/20",
        "Fila": "bg-tm-bg-hover text-tm-text-muted border-tm-border"
    };

    return (
        <div className="bg-tm-bg-card border-[1.5px] border-tm-border rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-tm-primary/10 hover:border-tm-primary group cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: colorHex }}
                >
                    {icon}
                </div>
                <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[status]}`}>
                    {status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-tm-text-primary mb-2 group-hover:text-tm-primary transition-colors">
                {title}
            </h3>
            <p className="text-sm text-tm-text-muted leading-relaxed mb-6 flex-1">
                {description}
            </p>

            <div className="flex items-center text-tm-primary text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all mt-auto">
                Acessar Módulo <ArrowRight className="w-4 h-4 ml-1" />
            </div>
        </div>
    );
}
