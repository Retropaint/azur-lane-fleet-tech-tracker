from urllib.parse import quote
from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import requests
import json
from os.path import exists
import sys

print(exists('retrofits'))
if exists('retrofits') == False:
  print('please create a folder called retrofits before proceeding.') 
  sys.exit(1)

# get info files
nameFile = open('names.json')
idFile = open('ids.json')

# parse
names = json.load(nameFile)
ids = json.load(idFile)

# close files
nameFile.close()
idFile.close()

for index, name in enumerate(names):
  proceed = True

  # encode name for special characters
  urlName = quote(name)

  # get url 
  req = Request("https://azurlane.koumakan.jp/wiki/File:" + urlName + "KaiShipyardIcon.png")

  try:
    # open the page
    html_page = urlopen(req)
  except:
    proceed = False

  if proceed:
    print(f'{name} has a retro')
    soup = BeautifulSoup(html_page, "lxml")

    # get 8th link in a page (this is always the image)
    link = soup.findAll('a')[8].get('href')

    img_data = requests.get(link).content

    # download it 
    with open(f'retrofits/{ids[index]}.webp', 'wb') as handler:
        handler.write(img_data)