import os
from dotenv import load_dotenv
from openai import OpenAI

# Carrega o arquivo .env
load_dotenv()

# Pega a chave e o modelo definidos no .env
api_key = os.getenv("OPENROUTER_API_KEY")
model = os.getenv("DEFAULT_MODEL", "google/gemini-2.0-flash-exp:free")

if not api_key:
    print("ERRO: A variável OPENROUTER_API_KEY não foi encontrada no arquivo .env")
    exit(1)

# Configura o cliente apontando para a API do OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

print(f"🔗 Conectando ao OpenRouter usando o modelo: {model}...")

try:
    # Fazendo uma requisição simples
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": "Olá! Responda com uma saudação curta confirmando que estamos conectados com sucesso."
            }
        ]
    )
    
    resposta = completion.choices[0].message.content
    print("\n✅ Conexão bem-sucedida! Resposta do modelo:")
    print("-" * 40)
    print(resposta)
    print("-" * 40)

except Exception as e:
    print(f"\n❌ Ocorreu um erro ao conectar: {e}")
