import os
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class DocfactoryCrew():
    """Docfactory crew producing all 25 documents"""
    
    # Paths are relative to the location of this crew.py file according to CrewBase
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    def __init__(self):
        # Create output dirs if they don't exist
        os.makedirs("output/01_planejamento_estrategico", exist_ok=True)
        os.makedirs("output/02_discovery_ux", exist_ok=True)
        os.makedirs("output/03_definicao_produto", exist_ok=True)
        os.makedirs("output/04_arquitetura", exist_ok=True)
        os.makedirs("output/05_dev_frontend", exist_ok=True)
        os.makedirs("output/06_dev_backend", exist_ok=True)
        os.makedirs("output/07_testes_qa", exist_ok=True)
        os.makedirs("output/08_deploy_devops", exist_ok=True)

    # ----------------------------------------------------
    # AGENTS
    # ----------------------------------------------------
    @agent
    def strategist(self) -> Agent: return Agent(config=self.agents_config['strategist'], verbose=True)

    @agent
    def ux_researcher(self) -> Agent: return Agent(config=self.agents_config['ux_researcher'], verbose=True)

    @agent
    def product_definer(self) -> Agent: return Agent(config=self.agents_config['product_definer'], verbose=True)

    @agent
    def architect(self) -> Agent: return Agent(config=self.agents_config['architect'], verbose=True)

    @agent
    def frontend_engineer(self) -> Agent: return Agent(config=self.agents_config['frontend_engineer'], verbose=True)

    @agent
    def backend_engineer(self) -> Agent: return Agent(config=self.agents_config['backend_engineer'], verbose=True)

    @agent
    def qa_specialist(self) -> Agent: return Agent(config=self.agents_config['qa_specialist'], verbose=True)

    @agent
    def devops_engineer(self) -> Agent: return Agent(config=self.agents_config['devops_engineer'], verbose=True)


    # ----------------------------------------------------
    # TASKS (Phase 1)
    # ----------------------------------------------------
    @task
    def gerar_plano_mestre(self) -> Task: return Task(config=self.tasks_config['gerar_plano_mestre'], output_file='output/01_planejamento_estrategico/O_Plano_Mestre_2.0.md')
    @task
    def gerar_business_model_canvas(self) -> Task: return Task(config=self.tasks_config['gerar_business_model_canvas'], output_file='output/01_planejamento_estrategico/Business_Model_Canvas.md')
    @task
    def gerar_visao_objetivos(self) -> Task: return Task(config=self.tasks_config['gerar_visao_objetivos'], output_file='output/01_planejamento_estrategico/Visao_e_Objetivos.md')
    @task
    def gerar_analise_mercado(self) -> Task: return Task(config=self.tasks_config['gerar_analise_mercado'], output_file='output/01_planejamento_estrategico/Analise_de_Mercado.md')
    @task
    def gerar_matriz_swot(self) -> Task: return Task(config=self.tasks_config['gerar_matriz_swot'], output_file='output/01_planejamento_estrategico/Matriz_SWOT.md')

    # ----------------------------------------------------
    # TASKS (Phase 2)
    # ----------------------------------------------------
    @task
    def gerar_personas(self) -> Task: return Task(config=self.tasks_config['gerar_personas'], output_file='output/02_discovery_ux/Personas_e_Jornada.md')
    @task
    def gerar_analises_profissionais(self) -> Task: return Task(config=self.tasks_config['gerar_analises_profissionais'], output_file='output/02_discovery_ux/Analises_Profissionais.md')
    @task
    def gerar_design_system(self) -> Task: return Task(config=self.tasks_config['gerar_design_system'], output_file='output/02_discovery_ux/Design_System.md')

    # ----------------------------------------------------
    # TASKS (Phase 3)
    # ----------------------------------------------------
    @task
    def gerar_prd(self) -> Task: return Task(config=self.tasks_config['gerar_prd'], output_file='output/03_definicao_produto/PRD.md')
    @task
    def gerar_frd(self) -> Task: return Task(config=self.tasks_config['gerar_frd'], output_file='output/03_definicao_produto/FRD.md')
    @task
    def gerar_nfrd(self) -> Task: return Task(config=self.tasks_config['gerar_nfrd'], output_file='output/03_definicao_produto/NFRD.md')
    @task
    def gerar_backlog(self) -> Task: return Task(config=self.tasks_config['gerar_backlog'], output_file='output/03_definicao_produto/Backlog.md')
    @task
    def gerar_dod(self) -> Task: return Task(config=self.tasks_config['gerar_dod'], output_file='output/03_definicao_produto/Definition_of_Done.md')

    # ----------------------------------------------------
    # TASKS (Phase 4)
    # ----------------------------------------------------
    @task
    def gerar_der(self) -> Task: return Task(config=self.tasks_config['gerar_der'], output_file='output/04_arquitetura/DER.md')
    @task
    def gerar_arquitetura(self) -> Task: return Task(config=self.tasks_config['gerar_arquitetura'], output_file='output/04_arquitetura/Arquitetura_Software.md')
    @task
    def gerar_diagrama_componentes(self) -> Task: return Task(config=self.tasks_config['gerar_diagrama_componentes'], output_file='output/04_arquitetura/Diagrama_Componentes.md')

    # ----------------------------------------------------
    # TASKS (Phase 5)
    # ----------------------------------------------------
    @task
    def gerar_guia_componentes(self) -> Task: return Task(config=self.tasks_config['gerar_guia_componentes'], output_file='output/05_dev_frontend/Guia_Componentes.md')
    @task
    def gerar_padroes_front(self) -> Task: return Task(config=self.tasks_config['gerar_padroes_front'], output_file='output/05_dev_frontend/Padroes_Frontend.md')
    @task
    def gerar_testes_front(self) -> Task: return Task(config=self.tasks_config['gerar_testes_front'], output_file='output/05_dev_frontend/Testes_Interface.md')

    # ----------------------------------------------------
    # TASKS (Phase 6)
    # ----------------------------------------------------
    @task
    def gerar_especificacao_apis(self) -> Task: return Task(config=self.tasks_config['gerar_especificacao_apis'], output_file='output/06_dev_backend/Especificacao_APIs.md')
    @task
    def gerar_padroes_back(self) -> Task: return Task(config=self.tasks_config['gerar_padroes_back'], output_file='output/06_dev_backend/Padroes_Backend.md')
    @task
    def gerar_testes_back(self) -> Task: return Task(config=self.tasks_config['gerar_testes_back'], output_file='output/06_dev_backend/Estrategia_Testes.md')

    # ----------------------------------------------------
    # TASKS (Phase 7)
    # ----------------------------------------------------
    @task
    def gerar_plano_testes(self) -> Task: return Task(config=self.tasks_config['gerar_plano_testes'], output_file='output/07_testes_qa/Plano_Testes.md')
    @task
    def gerar_casos_teste(self) -> Task: return Task(config=self.tasks_config['gerar_casos_teste'], output_file='output/07_testes_qa/Casos_Teste.md')
    @task
    def gerar_relatorios_qa(self) -> Task: return Task(config=self.tasks_config['gerar_relatorios_qa'], output_file='output/07_testes_qa/Relatorios_QA.md')

    # ----------------------------------------------------
    # TASKS (Phase 8)
    # ----------------------------------------------------
    @task
    def gerar_plano_deploy(self) -> Task: return Task(config=self.tasks_config['gerar_plano_deploy'], output_file='output/08_deploy_devops/Plano_Deploy.md')
    @task
    def gerar_doc_infra(self) -> Task: return Task(config=self.tasks_config['gerar_doc_infra'], output_file='output/08_deploy_devops/Infraestrutura.md')
    @task
    def gerar_runbooks(self) -> Task: return Task(config=self.tasks_config['gerar_runbooks'], output_file='output/08_deploy_devops/Runbooks.md')

    @crew
    def crew(self) -> Crew:
        """Creates the Docfactory crew"""
        return Crew(
            agents=self.agents, # Automatically resolved by the decorator
            tasks=self.tasks, # Automatically resolved by the decorator
            process=Process.sequential,
            verbose=True,
        )
