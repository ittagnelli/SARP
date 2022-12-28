import argparse
import requests
from bs4 import BeautifulSoup
from colorama import Fore, Back, Style

def xss_tester(url, payload, cookies=None):
    # Invia payload come richiesta GET
    response = requests.get(url, params={"input": payload}, cookies=cookies)

    # parase dell'HTML
    soup = BeautifulSoup(response.text, "html.parser")

    if not soup:
      print(Fore.YELLOW + "Avviso: non è stato possibile parsare l'HTML della pagina.")

    # trova input nell HTML
    input_element = soup.find("input", attrs={"name": "input"})

    if not input_element:
      print(Fore.RED + "Errore: non sono stati trovati elementi di input nella pagina.")
      return False

    if input_element:
        # restituisce l'attributo value dell'elemento di input
        # se corrisponde al payload, è vulnerabile all' XSS
        return input_element["value"] == payload
    else:
        # restituisce False se l'elemento di input non è stato trovato
        return False


# analizza l'URL e gli argomenti del payload
parser = argparse.ArgumentParser(description="XSS Tester")
parser.add_argument("url", help="Url da testare")
#parser.add_argument("-p", "--payload", nargs="?", default=None,
#                    help="Payload da testare")
parser.add_argument("-f", "--payload-file-url",
                    help="URL del file contenente i payload da testare", required = True) 
parser.add_argument("-o", "--output-file",
                    help="Percorso del file in cui scrivere i payload che hanno funzionato")
parser.add_argument("-c", "--cookie",
                    help="Cookie da utilizzare per la richiesta")
args = parser.parse_args()

# legge i payload dal file se specificato
if args.payload_file_url:
    # scarica il file
    response = requests.get(args.payload_file_url)

    # legge i payload dal file, uno per riga
    payloads = [line.strip() for line in response.text.split("\n")]
else:
    payloads = args.payload

# imposta il cookie se specificato
cookies = None
if args.cookie:
    cookies = {"Cookie": args.cookie}

# verifica la vulnerabilità XSS dell'URL specificato
successful_payloads = []
for payload in payloads:
    if xss_tester(args.url, payload, cookies):
        successful_payloads.append(payload)

# se sono stati trovati payload funzionanti, scrive i payload in un file
if successful_payloads:
    with open(args.output_file, "w") as f:
        for payload in successful_payloads:
            f.write(payload + "\n")



# verifica la vulnerabilità XSS dell'URL specificato
for payload in payloads:
    if xss_tester(args.url, payload):
        print("\n")
        print(Fore.RED + "Questo URL è vulnerabile agli XSS con il payload:" + Fore.RESET)
        print("\n")
        print(payload)
        print("\n")
    else:
        print("\n")
        print(Fore.GREEN + "Questo URL NON è vulnerabile agli XSS con il payload: " + Fore.RESET)
        print("\n")
        print(payload)
        print("\n")