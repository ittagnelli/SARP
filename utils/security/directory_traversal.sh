echo -e "\033[31m           _____                    _____                    _____                    _____          
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
                                                                                                    
SARP Penetesting suite"
sudo apt update && sudo apt install dirb
dirb $1 -o endpoints.txt
grep -wv 'URL\|URL_BASE' endpoints.txt | grep localhost | tee endpoints_processed   # Prende solo i link
lines=$(wc -l < endpoints_processed)    # Numero di linee
if(($lines > 7))    # I nostri endpoints dovrebbero essere 7
then
    echo "Test fallito";
    exit 10;    # Error code diverso da 0
else
    echo "Test riuscito";
    exit 0;
fi