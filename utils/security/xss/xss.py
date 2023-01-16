import argparse
import requests
from colorama import init, Fore
import json

init()

print(Fore.BLUE + '''
          _____                    _____                    _____                    _____          
         /\    \                  /\    \                  /\    \                  /\    \         
        /::\    \                /::\    \                /::\    \                /::\    \        
       /::::\    \              /::::\    \              /::::\    \              /::::\    \       
      /::::::\    \            /::::::\    \            /::::::\    \            /::::::\    \      
     /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \     
    /:::/__\:::\    \        /:::/__\:::\    \        /:::/__\:::\    \        /:::/__\:::\    \    
    \:::\   \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \   
  ___\:::\   \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \  
 /\   \:::\   \:::\    \  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\____\  /:::/\:::\   \:::\____\ 
/::\   \:::\   \:::\____\/:::/  \:::\   \:::\____\/:::/  \:::\   \:::|    |/:::/  \:::\   \:::|    |
\:::\   \:::\   \::/    /\::/    \:::\  /:::/    /\::/   |::::\  /:::|____|\::/    \:::\  /:::|____|
 \:::\   \:::\   \/____/  \/____/ \:::\/:::/    /  \/____|:::::\/:::/    /  \/_____/\:::\/:::/    / 
  \:::\   \:::\    \               \::::::/    /         |:::::::::/    /            \::::::/    /  
   \:::\   \:::\____\               \::::/    /          |::|\::::/    /              \::::/    /   
    \:::\  /:::/    /               /:::/    /           |::| \::/____/                \::/____/    
     \:::\/:::/    /               /:::/    /            |::|  ~|                       ~~          
      \::::::/    /               /:::/    /             |::|   |                                   
       \::::/    /               /:::/    /              \::|   |                                   
        \::/    /                \::/    /                \:|   |                                   
         \/____/                  \/____/                  \|___|                                   
                                                                                                    
SARP Penetesting suite
''')

parser = argparse.ArgumentParser(description="XSS Tester")
parser.add_argument("-u", "--url" , help="Url da testare")
parser.add_argument("-c", "--cookie",
                    help="Cookie da utilizzare per la richiesta")
parser.add_argument("-p", "--payload", help="Payload in JSON")

args = parser.parse_args()

url = args.url

payload = open(args.payload, "r").read()
headers = {
  'Origin': args.url,  # Bypass CSRF
  'Content-Type': 'text/plain',
  'Cookie': 'session=' + args.cookie  #Session id
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
