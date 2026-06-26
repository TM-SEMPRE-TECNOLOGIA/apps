import re

with open(r'c:\Users\thiag\LICITUS_BOT\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

new_sections = """
    <!-- Beneficios Extras -->
    <section class="py-20 bg-slate-50 border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Não é só sobre velocidade.<br>É sobre inteligência competitiva.</h2>
                <p class="mt-4 text-slate-600 max-w-2xl mx-auto">O Licitus Bot foi desenhado para eliminar os maiores gargalos de quem participa de pregões diariamente.</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-12">
                <!-- Block 1 -->
                <div class="flex gap-6 items-start">
                    <div class="w-12 h-12 shrink-0 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                        <i class="fa-solid fa-layer-group text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Múltiplos Itens Simultâneos</h3>
                        <p class="text-slate-600 leading-relaxed">Esqueça o desespero de ter 5 itens entrando em tempo randômico ao mesmo tempo. O robô monitora dezenas de itens em paralelo, com a mesma eficiência de uma equipe inteira dedicada.</p>
                    </div>
                </div>
                <!-- Block 2 -->
                <div class="flex gap-6 items-start">
                    <div class="w-12 h-12 shrink-0 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                        <i class="fa-solid fa-calculator text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Cálculo de Margem à Prova de Erros</h3>
                        <p class="text-slate-600 leading-relaxed">No calor da disputa, um erro de digitação pode custar milhares de reais. Com a trava de margem mínima pré-configurada, é humanamente impossível o bot arrematar com prejuízo.</p>
                    </div>
                </div>
                <!-- Block 3 -->
                <div class="flex gap-6 items-start">
                    <div class="w-12 h-12 shrink-0 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                        <i class="fa-solid fa-laptop-house text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Liberdade Geográfica</h3>
                        <p class="text-slate-600 leading-relaxed">Não fique preso na frente do computador por 6 horas aguardando o Chat do Pregoeiro. Configure seus limites pela manhã e receba as notificações de arremate direto no celular.</p>
                    </div>
                </div>
                <!-- Block 4 -->
                <div class="flex gap-6 items-start">
                    <div class="w-12 h-12 shrink-0 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                        <i class="fa-solid fa-file-invoice text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Relatórios Pós-Disputa</h3>
                        <p class="text-slate-600 leading-relaxed">Saiba exatamente contra quem você perdeu ou ganhou. O sistema arquiva o histórico de lances para você auditar e estudar o comportamento dos seus concorrentes.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Social Proof / Testimonials -->
    <section class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Quem usa, domina o Compras.gov</h2>
                <p class="mt-4 text-slate-600">Veja o que dizem os fornecedores que automatizaram suas operações com o Licitus Bot.</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Card 1 -->
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative">
                    <i class="fa-solid fa-quote-left text-4xl text-brand-100 absolute top-6 left-6"></i>
                    <div class="relative z-10">
                        <div class="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-700 italic mb-6">"Antes a gente perdia muitos itens porque o tempo randômico fechava no segundo que meu operador ia digitar o lance. Desde que colocamos o bot, nosso volume de vitórias por margem de centavos subiu 40%."</p>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">RM</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Ricardo M.</h4>
                                <p class="text-sm text-slate-500">Distribuidora de Materiais Médicos</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Card 2 -->
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative">
                    <i class="fa-solid fa-quote-left text-4xl text-brand-100 absolute top-6 left-6"></i>
                    <div class="relative z-10">
                        <div class="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-700 italic mb-6">"O maior ganho para mim foi a saúde mental. Eu ficava 3 telas abertas cuidando de 8 pregões. Hoje eu só configuro a planilha de custos de manhã, dou play no painel e vou tomar café."</p>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">AS</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Ana S.</h4>
                                <p class="text-sm text-slate-500">Consultora Especialista em Licitações</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Card 3 -->
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative">
                    <i class="fa-solid fa-quote-left text-4xl text-brand-100 absolute top-6 left-6"></i>
                    <div class="relative z-10">
                        <div class="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-700 italic mb-6">"Eu tinha medo de usar e ser desclassificado ou do robô errar o preço. A trava de segurança de margem mínima é perfeita. Nunca emitiu um lance abaixo do meu limite de custo."</p>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">CF</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Carlos F.</h4>
                                <p class="text-sm text-slate-500">Fornecedor de Equip. de Informática</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing -->
    <section id="planos" class="py-20 bg-slate-900 relative overflow-hidden">
        <!-- Decorative bg -->
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-900/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-white">Escolha seu arsenal de vitória</h2>
                <p class="mt-4 text-slate-400">A mensalidade que se paga no primeiro pregão vencido.</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <!-- Starter -->
                <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col">
                    <h3 class="text-xl font-bold text-white mb-2 cursor-default">Starter</h3>
                    <p class="text-slate-400 text-sm mb-6 h-10">Ideal para pequenas empresas iniciando na automação.</p>
                    <div class="mb-8">
                        <span class="text-4xl font-extrabold text-white">R$ 297</span><span class="text-slate-400">/mês</span>
                    </div>
                    <ul class="space-y-4 text-slate-300 text-sm mb-8 flex-1">
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Até 5 itens simultâneos</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Conta para 1 Operador</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Trava de margem de segurança</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Suporte via E-mail</li>
                    </ul>
                    <a href="#contato" class="w-full block text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition">Assinar Starter</a>
                </div>

                <!-- Professional -->
                <div class="bg-brand-900/30 rounded-2xl p-8 border-2 border-brand-500 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-brand-500/20 z-20">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white font-bold text-xs px-4 py-1 rounded-full tracking-wider">MAIS ESCOLHIDO</div>
                    <h3 class="text-xl font-bold text-white mb-2 cursor-default">Professional</h3>
                    <p class="text-slate-400 text-sm mb-6 h-10">Para empresas que participam de múltiplos pregões.</p>
                    <div class="mb-8">
                        <span class="text-4xl font-extrabold text-white">R$ 797</span><span class="text-slate-400">/mês</span>
                    </div>
                    <ul class="space-y-4 text-slate-300 text-sm mb-8 flex-1">
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-400"></i> <strong class="text-white">Até 20 itens simultâneos</strong></li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Conta para 3 Operadores</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Trava de margem de segurança</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Relatórios avançados de concorrência</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Suporte Prioritário WhatsApp</li>
                    </ul>
                    <a href="#contato" class="w-full block text-center bg-brand-500 hover:bg-brand-400 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-brand-500/30">Assinar Professional</a>
                </div>

                <!-- Enterprise -->
                <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col">
                    <h3 class="text-xl font-bold text-white mb-2 cursor-default">Enterprise</h3>
                    <p class="text-slate-400 text-sm mb-6 h-10">Para grandes distribuidoras e atacadistas.</p>
                    <div class="mb-8">
                        <span class="text-3xl font-extrabold text-white">Sob Consulta</span>
                    </div>
                    <ul class="space-y-4 text-slate-300 text-sm mb-8 flex-1">
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> <strong class="text-white">Itens Ilimitados</strong></li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Operadores Ilimitados</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Acesso API Dedicada</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> Treinamento In Company (Remoto)</li>
                        <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-brand-500"></i> SLA 99.9%</li>
                    </ul>
                    <a href="#contato" class="w-full block text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition">Falar com Consultor</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="py-24 bg-brand-600 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"></div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 class="text-4xl font-extrabold text-white mb-6 tracking-tight">Pare de perder dinheiro no tempo randômico.</h2>
            <p class="text-brand-100 text-xl mb-10">Junte-se a dezenas de fornecedores que já automatizaram suas vitórias no Compras.gov com o Licitus Bot.</p>
            <a href="#planos" class="inline-block bg-white text-brand-700 hover:bg-slate-50 px-10 py-4 rounded-full font-bold text-lg transition shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
                Quero dominar minhas licitações
            </a>
            <p class="text-brand-200 mt-6 text-sm flex items-center justify-center gap-2">
                <i class="fa-solid fa-shield-check"></i> Teste de aderência de 7 dias com devolução integral.
            </p>
        </div>
    </section>
"""

new_text = re.sub(r'(<!-- Como Funciona Section -->)', new_sections + '\n    \\1', text)

with open(r'c:\Users\thiag\LICITUS_BOT\index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Added new sections')
