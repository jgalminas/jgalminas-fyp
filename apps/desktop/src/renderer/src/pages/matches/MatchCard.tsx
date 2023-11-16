import { cn } from "@fyp/class-name-helper";
import Card from "@renderer/core/Card";
import { Link } from "react-router-dom";


export type MatchCardProps = {
  
}

const MatchCard = ({  }: MatchCardProps) => {

  // TODO
  const game = {
    outcome: 'loss',
    kills: 4,
    deaths: 6,
    assists: 20,
    cs: 64,
    queue: 'normal',
    date: new Date(),
    champion: 'lulu',
    role: 'support',
    runes: {
      primary: 'Aeries',
      secondary: 'Gold'
    },
    summoners: [
      'exhaust', 'flash'
    ],
    build: ['item 1', 'item 2', 'item 3'],
    blue: [
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      }
    ],
    red: [
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      },
      {
        name: 'Player 1',
        champion: 'azir'
      }
    ]
  }

  return (
    <Card className="text-white flex p-0">
      <div className={cn(
        "w-2 min-w-[0.5rem] min-h-full rounded-l-lg",
        game.outcome === 'loss' && 'bg-accent-red',
        game.outcome === 'victory' && 'bg-accent-blue'
      )}/>

      <div className="p-5">
        <Link to='/matches'> View Details </Link>
      </div>

    </Card>
  )
}

export default MatchCard;