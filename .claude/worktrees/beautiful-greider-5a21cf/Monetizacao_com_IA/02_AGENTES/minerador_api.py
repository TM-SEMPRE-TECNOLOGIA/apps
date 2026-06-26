import requests
import json

ACCESS_TOKEN = "EAAnZCSoOt5u4BRcOXVUAq07yg5GJWeu62Oa7sa0HzEPFkYVeGJpCUXs5UQyCZBNvu5ffbZCmqpAKZCboPCrVMn1OO4LPxvBrgkTdSRbZCmOTScczSqc1e3XzZCx3guoDKVn0kbBzu0zPyKgXGAKR17M0fFHXez8v1Qt2D372mZBAMGZBoBN1oYZCH6sIZB1asm9NAsKPEsY8WMZA7LZC7DntYdMrfn88uoiyxcHsuqIfsmuG"

def search_ads_via_api(query):
    # Endpoint da Ad Library API
    url = "https://graph.facebook.com/v22.0/ads_archive"
    
    params = {
        'access_token': ACCESS_TOKEN,
        'search_terms': query,
        'ad_active_status': 'ACTIVE',
        'ad_reached_countries': "['BR']",
        'fields': 'ad_snapshot_url,ad_creative_bodies,ad_creative_link_captions,page_name,ad_delivery_start_time',
        'limit': 5
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'data' in data:
            print(f"--- RESULTADOS PARA: {query} ---")
            for ad in data['data']:
                print(f"\n[+] Página: {ad.get('page_name')}")
                print(f"[*] Início: {ad.get('ad_delivery_start_time')}")
                print(f"[*] Texto: {ad.get('ad_creative_bodies', ['N/A'])[0][:100]}...")
                print(f"[-] Link: {ad.get('ad_snapshot_url')}")
        else:
            print(f"Erro ou sem permissão para '{query}': {data.get('error', {}).get('message', 'Erro desconhecido')}")
            
    except Exception as e:
        print(f"Erro na conexão: {e}")

if __name__ == "__main__":
    search_ads_via_api("IA Produtividade")
    print("\n" + "="*50 + "\n")
    search_ads_via_api("Colher Balança")
