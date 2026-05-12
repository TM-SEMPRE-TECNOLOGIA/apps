import re

with open(r'c:\Users\thiag\LICITUS_BOT\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

new_client_sections = """
    <!-- Como Funciona Section -->
    <section id="como-funciona" class="py-20 bg-slate-900 text-slate-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-16 text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Como Funciona o Licitus Bot?</h2>
                <p class="text-slate-400">Em 3 passos simples você automatiza sua participação e potencializa suas chances de vitória.</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8 relative">
                <!-- Step 1 -->
                <div class="bg-slate-800 rounded-xl p-8 border border-slate-700 relative z-10 text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                    <div class="w-16 h-16 bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-700 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                        <span class="text-2xl font-bold text-brand-400">1</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Configure sua Margem</h3>
                    <p class="text-slate-400 text-sm">Insira o número do pregão e defina seu preço mínimo de forma segura. O robô nunca ultrapassará seu limite de custo.</p>
                </div>
                <!-- Step 2 -->
                <div class="bg-slate-800 rounded-xl p-8 border border-brand-500/30 relative z-10 text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-brand-500/10">
                    <div class="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-400 shadow-[0_0_20px_rgba(20,184,166,0.5)]">
                        <span class="text-2xl font-bold text-white">2</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Ligue o Sniper</h3>
                    <p class="text-slate-400 text-sm">Durante o tempo randômico, o Licitus Bot monitora as propostas e emite lances para cobrir os concorrentes em milissegundos.</p>
                </div>
                <!-- Step 3 -->
                <div class="bg-slate-800 rounded-xl p-8 border border-slate-700 relative z-10 text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                    <div class="w-16 h-16 bg-brand-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-700 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                        <span class="text-2xl font-bold text-brand-400">3</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Acompanhe a Vitória</h3>
                    <p class="text-slate-400 text-sm">Vá tomar um café e deixe o sistema rodar sozinho. Receba um alerta no final com os itens garantidos e o relatório da disputa.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Security Section -->
    <section id="seguranca" class="py-20 bg-slate-950 text-slate-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-6">Segurança de Nível Bancário</h2>
                    <p class="text-slate-400 mb-8 max-w-lg">Suas credenciais do Gov.br e as informações de margens são invioláveis. A privacidade e a integridade da sua operação são a nossa principal premissa.</p>
                    <ul class="space-y-6">
                        <li class="flex items-start">
                            <div class="bg-slate-800 p-3 rounded-lg mr-4 text-brand-500 border border-slate-700 shadow-md">
                                <i class="fa-solid fa-shield-halved text-xl"></i>
                            </div>
                            <div>
                                <h4 class="text-white font-bold text-lg">Criptografia AES-256</h4>
                                <p class="text-sm text-slate-400 mt-1">Padrão militar de segurança para proteger todos os seus acessos salvos no sistema.</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <div class="bg-slate-800 p-3 rounded-lg mr-4 text-brand-500 border border-slate-700 shadow-md">
                                <i class="fa-solid fa-scale-balanced text-xl"></i>
                            </div>
                            <div>
                                <h4 class="text-white font-bold text-lg">Prática 100% Legal</h4>
                                <p class="text-sm text-slate-400 mt-1">Operamos estritamente dentro das regras da Nova Lei de Licitações (14.133/21).</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <div class="bg-slate-800 p-3 rounded-lg mr-4 text-brand-500 border border-slate-700 shadow-md">
                                <i class="fa-solid fa-lock text-xl"></i>
                            </div>
                            <div>
                                <h4 class="text-white font-bold text-lg">Conformidade com LGPD</h4>
                                <p class="text-sm text-slate-400 mt-1">Nenhum dado sensível de sua empresa é compartilhado. Privacidade total <span class="italic">by design</span>.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="bg-slate-800/80 p-10 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl">
                    <div class="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
                    <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                    
                    <div class="relative z-10 flex flex-col items-center justify-center">
                        <i class="fa-solid fa-shield-check text-6xl text-brand-400 mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"></i>
                        <h3 class="text-2xl font-bold text-white mb-2 text-center">Conexão Blindada</h3>
                        <p class="text-slate-400 text-center mb-8">Comunicação TLS 1.3 ponta a ponta garantindo o mais alto padrão de estabilidade.</p>
                        
                        <div class="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-xs text-brand-400 relative">
                            <div class="flex items-center mb-2">
                                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                                <span>STATUS: SECURE 200 OK</span>
                            </div>
                            <div class="text-slate-500">
                                > Handshake Gov.br [SUCCESS]<br>
                                > AES Encryption Layer [ACTIVE]<br>
                                > Rate Limiting Control [PASS]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq_clientes" class="py-20 bg-slate-900 text-slate-300">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-16 text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Dúvidas Frequentes</h2>
                <p class="text-slate-400">Informações transparentes e diretas para quem deseja automatizar suas vitórias.</p>
            </div>
            
            <div class="space-y-4 text-base">
                <details class="bg-slate-800 border-l-4 border-slate-700 hover:border-brand-500 transition-colors duration-300 rounded-r-lg group">
                    <summary class="p-6 cursor-pointer font-bold text-white flex justify-between items-center transition text-lg">
                        O uso do bot é permitido por lei? Posso ser desclassificado?
                        <span class="text-slate-500 group-open:text-brand-400 group-open:-rotate-180 transition-transform duration-300"><i class="fa-solid fa-chevron-down"></i></span>
                    </summary>
                    <div class="px-6 pb-6 text-slate-400 text-base border-t border-slate-700/50 mt-2 pt-4">
                        Sim, é perfeitamente legal. Não há dispositivo jurídico que proíba do fornecedor utilizar tecnologia de automação no portal de compras. O Licitus Bot atua como um preposto digital preenchendo os mesmos formulários que você faria manualmente. O que a lei coíbe é fraude (conluio), e não eficiência operacional de sistema matemático.
                    </div>
                </details>

                <details class="bg-slate-800 border-l-4 border-slate-700 hover:border-brand-500 transition-colors duration-300 rounded-r-lg group">
                    <summary class="p-6 cursor-pointer font-bold text-white flex justify-between items-center transition text-lg">
                        Qual a vantagem sobre os meus concorrentes que operam manualmente?
                        <span class="text-slate-500 group-open:text-brand-400 group-open:-rotate-180 transition-transform duration-300"><i class="fa-solid fa-chevron-down"></i></span>
                    </summary>
                    <div class="px-6 pb-6 text-slate-400 text-base border-t border-slate-700/50 mt-2 pt-4">
                        A fase final de "tempo randômico" do aviso de pregões é imprevisível. Concorrentes humanos levam entre 3 e 10 segundos apenas para constatar que seu lance foi coberto, digitar e enviar uma nova oferta, sendo que o pregão pode acabar durante esses segundos. O Licitus Bot faz essa cobertura em <strong class="text-brand-400">menos de 300 milissegundos</strong>, dominando a primeira colocação no instante final.
                    </div>
                </details>
                
                <details class="bg-slate-800 border-l-4 border-slate-700 hover:border-brand-500 transition-colors duration-300 rounded-r-lg group">
                    <summary class="p-6 cursor-pointer font-bold text-white flex justify-between items-center transition text-lg">
                        E se o bot lançar além do que eu posso dar de desconto (prejuízo)?
                        <span class="text-slate-500 group-open:text-brand-400 group-open:-rotate-180 transition-transform duration-300"><i class="fa-solid fa-chevron-down"></i></span>
                    </summary>
                    <div class="px-6 pb-6 text-slate-400 text-base border-t border-slate-700/50 mt-2 pt-4">
                        Isso nunca vai acontecer. A regra primária do sistema é a de "Valor Mínimo Aceitável" (piso de margem). Você determina quanto quer diminuir por lance (ex: R$ 0,05) e onde o lucro acaba. Se por R$ 0,01 o lance ficar abaixo da sua margem mínima de segurança, o robô para a operação e não arrisca a proposta, notificando você com exatidão.
                    </div>
                </details>

                <details class="bg-slate-800 border-l-4 border-slate-700 hover:border-brand-500 transition-colors duration-300 rounded-r-lg group">
                    <summary class="p-6 cursor-pointer font-bold text-white flex justify-between items-center transition text-lg">
                        E se minha energia ou internet caírem durante o pregão?
                        <span class="text-slate-500 group-open:text-brand-400 group-open:-rotate-180 transition-transform duration-300"><i class="fa-solid fa-chevron-down"></i></span>
                    </summary>
                    <div class="px-6 pb-6 text-slate-400 text-base border-t border-slate-700/50 mt-2 pt-4">
                        Nossas versões SaaS operam em infraestrutura na nuvem redundante de alta disponibilidade. Desde que não haja falha na plataforma governamental, mesmo os computadores e o modem do seu escritório desligados por falta de fornecimento não impedirão o envio automatizado pelo seu robô nos bastidores.
                    </div>
                </details>
            </div>
        </div>
    </section>
"""

# Replace documentacao section with new_client_sections
new_text = re.sub(r'<!-- Tech Docs Section.*?<!-- Footer -->', new_client_sections + '\n    <!-- Footer -->', text, flags=re.DOTALL)

# Delete Tab Logic Script
new_text = re.sub(r'<!-- Tab Logic Script -->.*?</script>\s*</body>', '</body>', new_text, flags=re.DOTALL)

# Update nav menu
new_text = new_text.replace('<a href="#documentacao" class="text-slate-600 hover:text-brand-600 transition font-medium">Docs\n                        Técnicos</a>', '<a href="#como-funciona" class="text-slate-600 hover:text-brand-600 transition">Como Funciona</a>\n                    <a href="#faq_clientes" class="text-slate-600 hover:text-brand-600 transition">FAQ</a>')

# Update read docs button
new_text = new_text.replace('<a href="#documentacao"\n                        class="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-bold text-lg transition">\n                        Ler Documentação Técnica\n                    </a>', '<a href="#como-funciona"\n                        class="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-bold text-lg transition">\n                        Ver como funciona\n                    </a>')

with open(r'c:\Users\thiag\LICITUS_BOT\index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("index.html client replacement finished!")
