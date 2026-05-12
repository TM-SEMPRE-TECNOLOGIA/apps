import requests
import json
from datetime import datetime, timedelta

ACCESS_TOKEN = "EAAnZCSoOt5u4BRcOXVUAq07yg5GJWeu62Oa7sa0HzEPFkYVeGJpCUXs5UQyCZBNvu5ffbZCmqpAKZCboPCrVMn1OO4LPxvBrgkTdSRbZCmOTScczSqc1e3XzZCx3guoDKVn0kbBzu0zPyKgXGAKR17M0fFHXez8v1Qt2D372mZBAMGZBoBN1oYZCH6sIZB1asm9NAsKPEsY8WMZA7LZC7DntYdMrfn88uoiyxcHsuqIfsmuG"
AD_ACCOUNT_ID = "act_660776681378326"

def get_account_health():
    # Pegar dados dos últimos 7 dias
    today = datetime.now().strftime('%Y-%m-%d')
    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    url = f"https://graph.facebook.com/v22.0/{AD_ACCOUNT_ID}/insights"
    params = {
        'access_token': ACCESS_TOKEN,
        'level': 'account',
        'time_range': json.dumps({'since': seven_days_ago, 'until': today}),
        'fields': 'spend,cpc,ctr,cpp,impressions,clicks'
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'data' in data and len(data['data']) > 0:
            metrics = data['data'][0]
            print("--- RELATÓRIO DE SAÚDE DA CONTA (Últimos 7 dias) ---")
            print(f"Gasto Total: R$ {metrics.get('spend', '0')}")
            print(f"CTR Médio: {metrics.get('ctr', '0')}%")
            print(f"CPC Médio: R$ {metrics.get('cpc', '0')}")
            print(f"Impressões: {metrics.get('impressions', '0')}")
            
            # Lógica Simples de Score
            ctr = float(metrics.get('ctr', 0))
            score = 0
            if ctr > 1.5: score += 40
            elif ctr > 1.0: score += 25
            else: score += 10
            
            print(f"\nHEALTH SCORE ESTIMADO: {score}/100")
        else:
            print("Nenhum dado encontrado nos últimos 7 dias. A conta pode estar inativa ou sem veiculação.")
            
    except Exception as e:
        print(f"Erro ao auditar conta: {e}")

if __name__ == "__main__":
    get_account_health()
