import sys
import json
from pandas import DataFrame
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import LocalOutlierFactor

HIGHLIGHT_TIMEFRAME = 5000
KILL_TAGS = ['Kill', 'Double Kill', 'Triple Kill', 'Quadra Kill', 'Penta Kill']

def get_stats(frame, id):
  for p in frame['participantStats']:
    if (p['participantId'] == id):
      return p

def get_participant_id(puuid):
  for p in data['participants']:
    if (p['puuid'] == puuid):
      return p['participantId']
    
def is_teammate(pOne, pTwo):
  if (pOne <= 5 and pTwo <= 5 or pOne > 5 and pTwo > 5):
    return True
  return False

def get_killstreak(events):
  killstreak = None
  for e in events:
    if (e['type'] == 'CHAMPION_SPECIAL_KILL' and e['killerId'] == PLAYER_ID):
      if killstreak == None:
        killstreak = e
      elif (killstreak['multiKillLength'] < e['multiKillLength']):
        killstreak = e
  
  if (killstreak == None):
    return None
  else:
    return KILL_TAGS[killstreak['multiKillLength'] - 1]

"""
Input data type:
{
    puuid: string, // puuid of the player
    data: string // match json object
}
"""

if len(sys.argv) != 2:
  print("Error: Missing path argument")
  sys.exit(1)

path = sys.argv[1]

with open(path, 'r') as file:
  input_obj = json.load(file)

data = json.loads(input_obj['data'])
puuid = input_obj['puuid']


PLAYER_ID = get_participant_id(puuid)

cols = ['gold_diff', 'kills', 'assists', 'deaths', 'baron_kills', 'dragon_kills', 'horde_kills', 'herald_kills', 'turret_kills']
rows = []

# Process frames/events
frames = data['frames']
for i in range(0, len(frames)):
  frame = frames[i]

  stats = get_stats(frame, PLAYER_ID)

  row = {}
  for y in range(0, len(cols)):
    row[cols[y]] = 0

  if (i != 0):
    row['gold_diff'] = stats['totalGold'] - get_stats(frames[i - 1], PLAYER_ID)['totalGold']

  rows.append(row)

  event_count = len(frame['events'])
  
  # Create highlight 
  highlight = None
  killstreak = None
  if (event_count > 0):
    highlight = {
      'start': frame['events'][0]['timestamp'] - HIGHLIGHT_TIMEFRAME,
      'finish': frame['events'][-1]['timestamp'] + 1000,
      'tags': []
    }

    killstreak = get_killstreak(frame['events'])
    if (killstreak != None):
      highlight['tags'].append(killstreak)

  for x in range(0, event_count):
    event = frame['events'][x]
    if (event['type'] == 'CHAMPION_KILL'):
      if (event['killerId'] == PLAYER_ID):
        rows[i]['kills'] += 1
        if (highlight != None and killstreak == None and 'Kill' not in highlight['tags']):
          highlight['tags'].append('Kill')
      elif (event['victimId'] == PLAYER_ID):
        rows[i]['deaths'] += 1
        if (highlight != None and 'Death' not in highlight['tags']):
          highlight['tags'].append('Death')
      elif (PLAYER_ID in event['assistingParticipantIds']):
        rows[i]['assists'] += 1
    elif (
        event['type'] == 'ELITE_MONSTER_KILL'
        and (event['killerId'] == PLAYER_ID or PLAYER_ID in event['assistingParticipantIds'] and is_teammate(PLAYER_ID, event['killerId']))
      ): 
      if (event['monsterType'] == 'HORDE'):
        rows[i]['horde_kills'] += 1
        if (highlight != None and 'Grub Kill' not in highlight['tags']):
          highlight['tags'].append('Grub Kill')
      elif (event['monsterType'] == 'BARON_NASHOR'):
        rows[i]['baron_kills'] += 1
        if (highlight != None and 'Baron Kill' not in highlight['tags']):
          highlight['tags'].append('Baron Kill')
      elif (event['monsterType'] == 'DRAGON'):
        rows[i]['dragon_kills'] += 1
        if (highlight != None and 'Dragon Kill' not in highlight['tags']):
          highlight['tags'].append('Dragon Kill')
      elif (event['monsterType'] == 'RIFTHERALD'):
        rows[i]['herald_kills'] += 1
        if (highlight != None and 'Herald Kill' not in highlight['tags']):
          highlight['tags'].append('Herald Kill')
    elif (
        event['type'] == 'BUILDING_KILL'
        and (event['killerId'] == PLAYER_ID or PLAYER_ID in event['assistingParticipantIds'])
        and event['buildingType'] == 'TOWER_BUILDING'
      ):
      rows[i]['turret_kills'] += 1
      if (highlight != None and 'Tower Kill' not in highlight['tags']):
        highlight['tags'].append('Tower Kill')

  # Add assists tags
  if rows[i]['assists'] == 1:
    highlight['tags'].append('Assist')
  elif rows[i]['assists'] >= 2:
    highlight['tags'].append('Multiple Assists')

  frame['highlight'] = highlight

processed_data = DataFrame(data=rows, columns=cols)

# Normalise data
scaler = StandardScaler()
scaled_data = scaler.fit_transform(processed_data)

# Find anomalies
model = LocalOutlierFactor(contamination=0.1) 
predictions = model.fit_predict(scaled_data)

processed_data['anomaly'] = predictions
anomalies = processed_data[processed_data['anomaly'] == -1]

indices = anomalies.index.tolist()

values = []
for i in indices:
  highlight = frames[i]['highlight']
  values.append({
    'frame': i,
    'start': highlight['start'],
    'finish': highlight['finish'],
    'tags': highlight['tags']
  })

print(json.dumps(values))
sys.exit(0)
